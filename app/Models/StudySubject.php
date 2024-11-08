<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudySubject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'point'];

    public function subStudySubjects()
    {
        // return $this->hasMany(SubStudySubject::class);
        return $this->hasMany(SubStudySubject::class, 'study_subject_id');
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}