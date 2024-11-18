<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Middleware\isAuthorized;
use App\Models\StudySubject;
use App\Http\Controllers\StudySubjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canResetPassword' => Route::has('password.request'),
        'status' => session('status'),
    ]);
});


Route::get('/dashboard', [ReportController::class, 'getReports'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard/report/add', [ReportController::class, 'create'])->middleware(['auth', 'verified'])->name('report.add');
Route::post('/dashboard/reports/bulk-insert', [ReportController::class, 'storeBulk'])->middleware(['auth', 'verified'])->name('reports.bulk-insert');
Route::get('/dashboard/report/delete/{id}', [ReportController::class, 'destroy'])->middleware(['auth', 'verified'])->name('reports.destroy');

Route::middleware(['auth', isAuthorized::class])->group(function () {
    Route::get('/dashboard/study-subject', [StudySubjectController::class, 'index'])->middleware(['auth', 'verified'])->name('studySubject');
    Route::get('/dashboard/study-subject/add', [StudySubjectController::class, 'create'])->middleware(['auth', 'verified'])->name('studySubject.add');
    Route::post('/dashboard/study-subject/add', [StudySubjectController::class, 'store'])->name('studySubject.store');
    Route::post('/dashboard/study-subject/edit/{id}', [StudySubjectController::class, 'storeSub'])->name('studySubject.storeSub');
    Route::get('/dashboard/study-subject/edit/{id}', [StudySubjectController::class, 'updateForm'])->name('studySubject.edit');
    Route::get('/dashboard/study-subject/delete/{id}', [StudySubjectController::class, 'destroy'])->name('studySubject.destroy');
    Route::get('/dashboard/study-subject/search', [StudySubjectController::class, 'search'])->name('studySubject.search');
    Route::get('/dashboard/student-report/{student_id}', [ReportController::class, 'getStudentReports'])->name('studentReport.view');
    Route::put('/dashboard/student-report/{student_id}', [ReportController::class, 'updateReportStatus'])->name('studentReport.update');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });

require __DIR__ . '/auth.php';
