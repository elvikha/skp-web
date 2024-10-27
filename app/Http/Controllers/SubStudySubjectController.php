<?php
namespace App\Http\Controllers;

use App\Models\SubStudySubject;
use Illuminate\Http\Request;

class SubStudySubjectController extends Controller
{
    public function index()
    {
        $subStudySubjects = SubStudySubject::with('studySubject')->get();
        return response()->json($subStudySubjects);
    }

    public function store(Request $request)
    {
        $subStudySubject = SubStudySubject::create($request->all());
        return response()->json($subStudySubject, 201);
    }

    public function show($id)
    {
        $subStudySubject = SubStudySubject::with('studySubject')->findOrFail($id);
        return response()->json($subStudySubject);
    }

    public function update(Request $request, $id)
    {
        $subStudySubject = SubStudySubject::findOrFail($id);
        $subStudySubject->update($request->all());
        return response()->json($subStudySubject);
    }

    public function destroy($id)
    {
        SubStudySubject::destroy($id);
        return response()->json(null, 204);
    }
}