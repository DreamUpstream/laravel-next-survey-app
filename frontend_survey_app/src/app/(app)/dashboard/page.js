// src/app/dashboard/page.js

'use client'

import { useState, useEffect, useRef } from 'react'
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    Select,
    MenuItem,
    IconButton,
    Card,
    CardContent,
} from '@mui/material'
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material'
import axios from '@/lib/axios'
import Chart from 'chart.js/auto'

const Dashboard = () => {
    const [title, setTitle] = useState('')
    const [questions, setQuestions] = useState([{ question: '', type: 'text' }])
    const [allSurveyResults, setAllSurveyResults] = useState(null)
    const chartRef = useRef(null)

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions]
        newQuestions[index][field] = value
        setQuestions(newQuestions)
    }

    const addQuestion = () => {
        setQuestions([...questions, { question: '', type: 'text' }])
    }

    const removeQuestion = index => {
        const newQuestions = questions.filter((_, i) => i !== index)
        setQuestions(newQuestions)
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/surveys', {
                title,
                questions,
            })
            alert('Survey created successfully!')
            setTitle('')
            setQuestions([{ question: '', type: 'text' }])
        } catch (error) {
            console.error('Failed to create survey:', error)
            alert('Failed to create survey.')
        }
    }

    useEffect(() => {
        const fetchAllSurveyResults = async () => {
            try {
                const response = await axios.get('/api/surveys/result/all')
                console.log('All Survey Results:', response.data) // Log the structure of the survey results
                setAllSurveyResults(response.data)
            } catch (error) {
                console.error('Failed to fetch all survey results:', error)
            }
        }

        fetchAllSurveyResults()
    }, [])

    useEffect(() => {
        if (allSurveyResults && chartRef.current) {
            const ctx = chartRef.current.getContext('2d')
            if (chartRef.current.chartInstance) {
                chartRef.current.chartInstance.destroy()
            }

            const labels = allSurveyResults.flatMap(survey =>
                survey.questions
                    .filter(q => q.type === 'rating')
                    .map(q => q.question),
            )
            const data = allSurveyResults.flatMap(survey =>
                survey.questions
                    .filter(q => q.type === 'rating')
                    .map(question => {
                        const answers = survey.responses.map(response => {
                            const answer = response.responses[question.id]
                            return typeof answer === 'number' ? answer : 0
                        })
                        const total = answers.reduce((sum, val) => sum + val, 0)
                        const count = answers.filter(val => val > 0).length
                        const avg = count > 0 ? total / count : 0
                        return {
                            avg,
                            count,
                            surveyTitle: survey.title,
                        }
                    }),
            )

            const datasets = data.map((item, index) => ({
                label: `${item.surveyTitle}: ${labels[index]} (${item.count})`,
                data: [item.avg],
                backgroundColor: `rgba(${(index + 1) * 60}, 99, 132, 0.2)`,
                borderColor: `rgba(${(index + 1) * 60}, 99, 132, 1)`,
                borderWidth: 1,
            }))

            chartRef.current.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Average Ratings'],
                    datasets: datasets,
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5, // Ensure y-axis max is set to 5
                        },
                    },
                },
            })
        }
    }, [allSurveyResults])

    const renderTextResponses = () => {
        if (!allSurveyResults) return null
        return allSurveyResults.flatMap(survey =>
            survey.questions
                .filter(q => q.type === 'text')
                .map(question => (
                    <Card
                        key={`${survey.id}-${question.id}`}
                        variant="outlined"
                        style={{ marginBottom: '1rem' }}>
                        <CardContent>
                            <Typography variant="h6">
                                {`${survey.title}: ${question.question}`}
                            </Typography>
                            {survey.responses.map((response, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    style={{ marginTop: '0.5rem' }}>
                                    {response.responses[question.id]}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                )),
        )
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Create New Survey
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Survey Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </Box>
                {questions.map((question, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                        <TextField
                            label={`Question ${index + 1}`}
                            variant="outlined"
                            fullWidth
                            value={question.question}
                            onChange={e =>
                                handleQuestionChange(
                                    index,
                                    'question',
                                    e.target.value,
                                )
                            }
                        />
                        <Select
                            value={question.type}
                            onChange={e =>
                                handleQuestionChange(
                                    index,
                                    'type',
                                    e.target.value,
                                )
                            }
                            variant="outlined"
                            margin="dense"
                            style={{ marginLeft: 16 }}>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="rating">Rating</MenuItem>
                        </Select>
                        <IconButton
                            onClick={() => removeQuestion(index)}
                            disabled={questions.length === 1}>
                            <RemoveIcon />
                        </IconButton>
                    </Box>
                ))}
                <Box mb={2}>
                    <Button
                        variant="outlined"
                        onClick={addQuestion}
                        startIcon={<AddIcon />}>
                        Add Question
                    </Button>
                </Box>
                <Button variant="contained" color="primary" type="submit">
                    Create Survey
                </Button>
            </form>
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                style={{ marginTop: '2rem' }}>
                Survey Results
            </Typography>
            {allSurveyResults ? (
                <>
                    <div style={{ position: 'relative', height: '400px' }}>
                        <canvas ref={chartRef} />
                    </div>
                    <Typography
                        variant="h5"
                        component="h2"
                        style={{ marginTop: '2rem' }}>
                        Text Responses
                    </Typography>
                    {renderTextResponses()}
                </>
            ) : (
                <Typography variant="body1">
                    Loading survey results...
                </Typography>
            )}
        </Container>
    )
}

export default Dashboard
