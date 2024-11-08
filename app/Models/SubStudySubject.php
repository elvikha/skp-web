<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubStudySubject extends Model
{
    use HasFactory;

    protected $fillable = ['study_subject_id', 'name', 'description', 'point'];

    public function studySubject()
    {
        // return $this->belongsTo(StudySubject::class);
        return $this->belongsTo(StudySubject::class, 'study_subject_id');
    }
}