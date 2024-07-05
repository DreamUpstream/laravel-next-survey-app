<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SurveyController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/surveys', [SurveyController::class, 'createSurvey']);
Route::post('/surveys/{id}/responses', [SurveyController::class, 'submitSurvey']);
Route::get('/surveys/{id}/results', [SurveyController::class, 'getSurveyResults']);
Route::get('/surveys/{id}', [SurveyController::class, 'getSurvey']);
Route::get('/surveys', [SurveyController::class, 'listSurveys']);
Route::get('/surveys/result/all', [SurveyController::class, 'getAllSurveyResults']);
