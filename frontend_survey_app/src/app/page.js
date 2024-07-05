// src/app/page.js

'use client'

import { useState, useEffect } from 'react'
import {
    TextField,
    Button,
    Typography,
    Box,
    Container,
    Rating,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
} from '@mui/material'
import axios from '@/lib/axios'
import Link from 'next/link'
import LoginLinks from '@/app/LoginLinks'

const Home = () => {
    const [surveys, setSurveys] = useState([])
    const [selectedSurveyId, setSelectedSurveyId] = useState('')
    const [survey, setSurvey] = useState(null)
    const [responses, setResponses] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await axios.get('/api/surveys')
                setSurveys(response.data)
            } catch (error) {
                setError('Failed to fetch surveys.')
            }
        }

        fetchSurveys()
    }, [])

    const fetchSurvey = async surveyId => {
        setLoading(true)
        setError(null)
        setSurvey(null)
        try {
            const response = await axios.get(`/api/surveys/${surveyId}`)
            setSurvey(response.data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Survey not found.')
            } else {
                setError('Failed to fetch survey.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleSurveyChange = event => {
        const surveyId = event.target.value
        setSelectedSurveyId(surveyId)
        if (surveyId) {
            fetchSurvey(surveyId)
        } else {
            setSurvey(null)
        }
    }

    const handleResponseChange = (questionId, value) => {
        setResponses({
            ...responses,
            [questionId]: value,
        })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            await axios.post(`/api/surveys/${survey.id}/responses`, {
                responses,
            })
            setSuccess('Survey response submitted successfully!')
            setResponses({})
        } catch (error) {
            console.error('Failed to submit survey response:', error)
            setError('Failed to submit survey response.')
        }
    }

    return (
        <>
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <LoginLinks />

                <Container maxWidth="sm">
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Select Survey</InputLabel>
                        <Select
                            value={selectedSurveyId}
                            onChange={handleSurveyChange}
                            label="Select Survey">
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {surveys.map(survey => (
                                <MenuItem key={survey.id} value={survey.id}>
                                    {survey.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {loading && (
                        <Typography variant="h6">Loading...</Typography>
                    )}

                    {!loading && !error && survey && (
                        <>
                            <Typography
                                variant="h4"
                                component="h1"
                                gutterBottom>
                                {survey.title}
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                {survey.questions.map(question => (
                                    <Box key={question.id} mb={2}>
                                        <Typography component="legend">
                                            {question.question}
                                        </Typography>
                                        {question.type === 'rating' ? (
                                            <Rating
                                                name={`question-${question.id}`}
                                                value={
                                                    responses[question.id] || 0
                                                }
                                                onChange={(event, newValue) =>
                                                    handleResponseChange(
                                                        question.id,
                                                        newValue,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                value={
                                                    responses[question.id] || ''
                                                }
                                                onChange={e =>
                                                    handleResponseChange(
                                                        question.id,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </Box>
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit">
                                    Submit
                                </Button>
                            </form>
                        </>
                    )}
                    {!loading && !error && !survey && selectedSurveyId && (
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom>
                            No survey found for the selected survey.
                        </Typography>
                    )}
                    {!loading && !error && !survey && !selectedSurveyId && (
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            gutterBottom>
                            Please select a survey.
                        </Typography>
                    )}
                </Container>
            </div>
        </>
    )
}

export default Home
