<?php

namespace App\Http\Controllers;

use App\Models\StudySubject;
use App\Models\SubStudySubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
// use Log;

class StudySubjectController extends Controller
{
    public function index(Request $request)
    {
        $query = StudySubject::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        // $studySubjects = StudySubject::with('subStudySubjects')->get();
        $studySubjects = $query->with('subStudySubjects')->get();

        return Inertia::render('StudySubject/Index', [
            'studySubjects' => $studySubjects,
            'search' => $request->input('search', ''),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function search(Request $request)
    {
        $studySubjects = StudySubject::where('name', 'like', '%' . $request->input('search') . '%')->with('subStudySubjects')->get();

        return Inertia::render('StudySubject/Index', [
            'studySubjects' => $studySubjects,
            'search' => $request->input('search', ''),
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * create
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $studySubjects = StudySubject::all();

        return Inertia::render('StudySubject/Add', [
            'studySubjects' => $studySubjects
        ]);
    }

    /**
     * update
     *
     * @return \Inertia\Response
     */
    public function updateForm($id)
    {
        $studySubject = StudySubject::with('subStudySubjects')->findOrFail($id);

        return Inertia::render('StudySubject/Add', [
            'studySubject' => $studySubject,
            'id' => $id
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'point' => 'nullable|integer',
            'sub_study_subjects' => 'array',
            'sub_study_subjects.*.name' => 'string|max:255',
            'sub_study_subjects.*.description' => 'nullable|string|max:1000',
            'sub_study_subjects.*.point' => 'integer',
        ]);


        $studySubject = StudySubject::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'point' => $validated['point'],
        ]);



        foreach ($validated['sub_study_subjects'] as $sub) {
            $studySubject->subStudySubjects()->create($sub);
        }

        return redirect()->route('studySubject');
    }

    public function storeSub(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'point' => 'nullable|integer',
            'sub_study_subjects' => 'array',
            'sub_study_subjects.*.study_subject_id' => 'integer',
            'sub_study_subjects.*.name' => 'string|max:255',
            'sub_study_subjects.*.description' => 'nullable|string|max:1000',
            'sub_study_subjects.*.point' => 'integer',
        ]);


        $studySubject = StudySubject::findOrFail($id);
        $studySubject->update($validated);

        // Delete existing sub-study subjects
        $studySubject->subStudySubjects()->delete();


        foreach ($validated['sub_study_subjects'] as $sub) {
            $studySubject->subStudySubjects()->create($sub);
        }

        return redirect()->route('studySubject')->with('success', 'Study Subject updated successfully.');
        ;
    }

    public function show($id)
    {
        $studySubject = StudySubject::with('subStudySubjects')->findOrFail($id);
        return response()->json($studySubject);
    }


    public function update(Request $request, $id)
    {
        $studySubject = StudySubject::findOrFail($id);
        $studySubject->update($request->all());
        return response()->json($studySubject, 200);
    }

    public function destroy($id)
    {
        $studySubject = StudySubject::findOrFail($id);
        $studySubject->delete();

        return redirect()->route('studySubject')->with('success', 'Study Subject and related Sub Study Subjects deleted successfully.');
    }

    /**
     * Display the user's profile form.
     */
    // public function add(Request $request): Response
    // {
    //     $exampleData = [
    //         'message' => 'Hello, this is a message from the controller!',
    //         'subjects' => StudySubject::all(), // Fetch all study subjects
    //     ];

    //     return Inertia::render('/dashboard/study-subject/add', $exampleData);
    // }
}
