<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sub_study_subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('study_subject_id')->constrained('study_subjects')->onDelete('cascade');
            $table->string('name');
            $table->string('description')->nullable();
            $table->integer('point');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_study_subjects');
    }
};
