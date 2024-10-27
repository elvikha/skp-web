<?php

namespace App\Http\Controllers;

use App\Models\StudySubject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
// use Log;

class StudySubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('StudySubject/Index', [
            'StudySubject' => StudySubject::all(),
        ]);
    }

    /**
     * create
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return inertia('Pages/StudySubject/Add');
    }

    // public function store(Request $request)
    // {
    //     $studySubject = StudySubject::create($request->all());
    //     return response()->json($studySubject, 201);
    // }


    // public function store(Request $request)
    // {
    //     StudySubject::create([
    //         'name' => $request->name,
    //         'description' => $request->description,
    //         'point' => $request->point,
    //     ]);

    //     return to_route('studySubject');
    // }

    public function store(Request $request)
    {
        // $validated = $request->validate([
        //     'name' => 'required|string|max:50',
        //     'description' => 'nullable|string|max:255',
        //     'point' => 'nullable|integer',
        // ]);

        // StudySubject::create(attributes: $validated);

        Log::info(message: 'store SS ===heily====');

        info($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'point' => 'nullable|integer',
            'subStudySubjects' => 'array',
            'subStudySubjects.*.name' => 'string|max:255',
            'subStudySubjects.*.description' => 'string|max:255',
            'subStudySubjects.*.point' => 'integer',
        ]);


        $studySubject = StudySubject::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'point' => $validated['point'],
        ]);

        foreach ($validated['subStudySubjects'] as $sub) {
            $studySubject->subStudySubjects()->create($sub);
        }

        // $output->writeln($studySubject);
        // $output->writeln(messages: '====>');
        // $output->writeln($request);

        return redirect()->route('studySubject');
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
