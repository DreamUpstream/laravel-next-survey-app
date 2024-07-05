<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use App\Models\SurveyResponse;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function createSurvey(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'questions' => 'required|array',
            'questions.*.question' => 'required|string',
            'questions.*.type' => 'required|in:text,rating',
        ]);

        $survey = Survey::create(['title' => $request->title]);

        foreach ($request->questions as $question) {
            $survey->questions()->create($question);
        }

        return response()->json($survey, 201);
    }

    public function submitSurvey(Request $request, $id)
    {
        $survey = Survey::findOrFail($id);

        $request->validate([
            'responses' => 'required|array',
            'responses.*' => 'required',
        ]);

        SurveyResponse::create([
            'survey_id' => $survey->id,
            'responses' => $request->responses,
        ]);

        return response()->json(['message' => 'Survey response submitted successfully!'], 201);
    }

    public function getSurveyResults($id)
    {
        $survey = Survey::with(['responses', 'questions'])->findOrFail($id);
        return response()->json($survey);
    }

    public function getSurvey($id)
    {
        $survey = Survey::with('questions')->findOrFail($id);
        return response()->json($survey);
    }

    public function listSurveys()
    {
        $surveys = Survey::all();
        return response()->json($surveys);
    }

    public function getAllSurveyResults()
    {
        $surveys = Survey::with(['responses', 'questions'])->get();
        return response()->json($surveys);
    }
}
