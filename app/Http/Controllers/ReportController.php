<?php
namespace App\Http\Controllers;

use App\Models\Report;
use Inertia\Inertia;
use App\Models\StudySubject;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function create(Request $request)
    {
        $studySubjects = StudySubject::with('subStudySubjects')->get()->map(function ($studySubject) {
            return [
                'study_subjects_id' => $studySubject->id,
                'study_subjects_name' => $studySubject->name,
                'description' => $studySubject->description,
                'point' => $studySubject->point,
                'sub_study_subjects' => $studySubject->subStudySubjects->map(function ($subStudySubject) {
                    return [
                        'sub_study_subjects_id' => $subStudySubject->id,
                        'sub_study_subjects_name' => $subStudySubject->name,
                        'description' => $subStudySubject->description,
                        'point' => $subStudySubject->point,
                    ];
                }),
            ];
        });

        return Inertia::render('Report/Add', [
            'studySubjects' => $studySubjects,
            'exampiner' => [],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }


    public function storeBulk(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'reports' => 'required|array',
            'reports.*.user_id' => 'required|exists:users,id',
            'reports.*.study_subject_id' => 'required|exists:study_subjects,id',
            'reports.*.sub_study_subject_id' => 'nullable|exists:sub_study_subjects,id',
            'reports.*.status' => 'required|in:0,1,2',
            'reports.*.attachment' => 'nullable|file|mimes:pdf,ppt,zip,docx|max:3072',
            'reports.*.examiner_id' => 'required|exists:users,id',
        ]);

        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 422);
        // }

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Extract the validated reports data
        $reportsData = $validator->validated()['reports'];

        // Check for existing records with the same user_id and study_subject_id
        $existingReports = Report::whereIn('user_id', array_column($reportsData, 'user_id'))
            ->whereIn('study_subject_id', array_column($reportsData, 'study_subject_id'))
            ->get()
            ->keyBy(function ($item) {
                return $item['user_id'] . '-' . $item['study_subject_id'];
            });

        // Filter out reports that already exist
        $newReportsData = array_filter($reportsData, function ($report) use ($existingReports) {
            $key = $report['user_id'] . '-' . $report['study_subject_id'];
            return !isset($existingReports[$key]);
        });

        if (empty($newReportsData)) {
            return redirect()->back()->withErrors(['error' => 'No new reports to insert.'])->withInput();
        }

        // Handle file uploads and update the reports data with file paths
        foreach ($newReportsData as &$report) {
            if (isset($report['attachment']) && $report['attachment'] instanceof \Illuminate\Http\UploadedFile) {
                $filePath = $report['attachment']->store('documents', 'public');
                $report['attachment'] = $filePath;
            } else {
                $report['attachment'] = null;
            }
        }

        // Insert the reports in bulk
        Report::insert($newReportsData);

        return redirect()->route('dashboard')->with('success', 'Reports inserted successfully.');
    }

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

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();

        return redirect()->route('dashboard')->with('success', 'Report deleted successfully.');
    }

    public function getStudentReports($id)
    {
        $reports = $this->getReportByUserId($id);

        return Inertia::render('Report/Detail', [
            'reports' => $reports,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Update the specified report in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'study_subject_id' => 'required|exists:study_subjects,id',
            'sub_study_subject_id' => 'nullable|exists:sub_study_subjects,id',
            'status' => 'required|in:0,1,2',
            'attachment' => 'nullable|string',
            'examiner_id' => 'required|exists:users,id',
        ]);

        // Find the report by ID
        $report = Report::findOrFail($id);

        // Update the report with validated data
        $report->update($validated);

        // Return a response, e.g., redirect to a specific route or return JSON
        return redirect()->route('studentReport.view', $id)->with('success', 'Report updated successfully.');
    }

    public function updateReportStatus(Request $request, $student_id)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'id' => 'required|int',
            'status' => 'required|in:0,1,2',
        ]);

        // Find the report by ID
        $report = Report::findOrFail($validated['id']);
        // Update the report with validated data
        $report->update($validated);

        // Return a response, e.g., redirect to a specific route or return JSON
        return redirect()->route('studentReport.view', $student_id)->with('success', 'Report updated successfully.');
    }

    function getReportByExaminerId($examinerId)
    {
        $reports = Report::with(['user', 'studySubject', 'subStudySubject', 'examiner'])
            ->where('examiner_id', $examinerId)
            ->get()
            ->map(function ($report) {
                return [
                    'id' => $report->id,
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
                    'id' => $report->id,
                    'user_id' => $report->user_id,
                    'examiner_id' => $report->examiner_id,
                    'user_name' => $report->user->name,
                    'study_subject_id' => $report->studySubject->id,
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
}