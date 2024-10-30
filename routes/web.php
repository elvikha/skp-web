<?php

use App\Http\Controllers\ProfileController;
use App\Models\StudySubject;
use App\Http\Controllers\StudySubjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard/study-subject', [StudySubjectController::class, 'index'])->middleware(['auth', 'verified'])->name('studySubject');

Route::get('/dashboard/study-subject/add', [StudySubjectController::class, 'create'])->middleware(['auth', 'verified'])->name('studySubject.add');

Route::post('/dashboard/study-subject/add', [StudySubjectController::class, 'store'])->name('studySubject.store');

Route::post('/dashboard/study-subject/edit/{id}', [StudySubjectController::class, 'storeSub'])->name('studySubject.storeSub');

Route::get('/dashboard/study-subject/edit/{id}', [StudySubjectController::class, 'updateForm'])->name('studySubject.edit');

Route::get('/dashboard/study-subject/delete/{id}', [StudySubjectController::class, 'destroy'])->name('studySubject.destroy');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
