<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getReports()
    {
        $userId = auth()->id();
        $status = auth()->user()->status;

        if ((int) $status == '2') {
            // return response()->json($reports);
            return Inertia::render('Dashboard', [
                'reports' => $this->getReportStudentByExaminerId($userId),
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        } else {

            return Inertia::render('Dashboard', [
                'reports' => $this->getReportByUserId($userId),
                'flash' => [
                    'success' => session('success'),
                    'error' => session('error'),
                ],
            ]);
        }
    }

    function getReportByExaminerId($examinerId)
    {
        $reports = Report::with(['user', 'studySubject', 'subStudySubject', 'examiner'])
            ->where('examiner_id', $examinerId)
            ->get()
            ->map(function ($report) {
                return [
                    'report_id' => $report->id,
                    'user_name' => $report->user->name,
                    'identification_number' => $report->user->identification_number,
                    'study_subject' => $report->studySubject->name,
                    'sub_study_subject' => $report->subStudySubject ? $report->subStudySubject->name : '',
                    'point' => $report->studySubject->point,
                    'sub_point' => $report->subStudySubject ? $report->subStudySubject->point : 0,
                    'status' => $report->status,
                    'attachment' => $report->attachment,
                    'examiner_name' => $report->examiner->name,
                ];
            });

        return $reports;
    }

    function getReportByUserId($userId)
    {
        $reports = Report::with(['user', 'studySubject', 'subStudySubject'])
            ->where('user_id', $userId)
            ->get()
            ->map(function ($report) {
                return [
                    'user_id' => $report->user_id,
                    'user_name' => $report->user->name,
                    'study_subject' => $report->studySubject->name,
                    'sub_study_subject' => $report->subStudySubject ? $report->subStudySubject->name : '',
                    'point' => $report->studySubject->point,
                    'sub_point' => $report->subStudySubject ? $report->subStudySubject->point : '',
                    'status' => $report->status,
                    'attachment' => $report->attachment,
                ];
            });

        return $reports;
    }

    function getReportStudentByExaminerId($examinerId)
    {
        $reports = Report::select(
            'reports.user_id',
            'users.name as user_name',
            'users.identification_number',
            DB::raw('examiner.name as examiner_name')
        )
            ->join('users', 'reports.user_id', '=', 'users.id')
            ->join('users as examiner', 'reports.examiner_id', '=', 'examiner.id')
            ->where('reports.examiner_id', $examinerId)
            ->groupBy('reports.user_id', 'users.name', 'users.identification_number', 'examiner.name')
            ->get();

        return $reports;
    }

    // public function getReportsForUser()
    // {
    //     $userId = auth()->id();
    //     $reports = Report::with(['user', 'studySubject', 'subStudySubject'])
    //         ->where('user_id', $userId)
    //         ->get()
    //         ->map(function ($report) {
    //             return [
    //                 'user_id' => $report->user_id,
    //                 'user_name' => $report->user->name,
    //                 'study_subject' => $report->studySubject->name,
    //                 'sub_study_subject' => $report->subStudySubject ? $report->subStudySubject->name : '',
    //                 'point' => $report->studySubject->point,
    //                 'sub_point' => $report->subStudySubject ? $report->subStudySubject->point : '',
    //                 'status' => $report->status,
    //                 'attachment' => $report->attachment,
    //             ];
    //         });

    //     return Inertia::render('Dashboard', [
    //         'reports' => $reports,
    //         'flash' => [
    //             'success' => session('success'),
    //             'error' => session('error'),
    //         ],
    //     ]);
    //     // return response()->json($reports);
    // }

    // public function getReportsForExaminer($examinerId)
    // {
    //     $reports = Report::with(['user', 'studySubject', 'subStudySubject', 'examiner'])
    //         ->where('examiner_id', $examinerId)
    //         ->get()
    //         ->map(function ($report) {
    //             return [
    //                 'report_id' => $report->id,
    //                 'user_name' => $report->user->name,
    //                 'identification_number' => $report->user->identification_number,
    //                 'study_subject' => $report->studySubject->name,
    //                 'sub_study_subject' => $report->subStudySubject ? $report->subStudySubject->name : '',
    //                 'point' => $report->studySubject->point,
    //                 'sub_point' => $report->subStudySubject ? $report->subStudySubject->point : 0,
    //                 'status' => $report->status,
    //                 'attachment' => $report->attachment,
    //                 'examiner_name' => $report->examiner->name,
    //             ];
    //         });

    //     // return response()->json($reports);
    //     return Inertia::render('Dashboard', [
    //         'reports' => $reports,
    //         'flash' => [
    //             'success' => session('success'),
    //             'error' => session('error'),
    //         ],
    //     ]);
    // }
}