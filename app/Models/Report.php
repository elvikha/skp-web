<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'study_subject_id', 'sub_study_subject_id', 'status', 'attachment', 'examiner_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function studySubject()
    {
        return $this->belongsTo(StudySubject::class);
    }

    public function subStudySubject()
    {
        return $this->belongsTo(SubStudySubject::class);
    }

    public function examiner()
    {
        return $this->belongsTo(User::class, 'examiner_id');
    }
}
