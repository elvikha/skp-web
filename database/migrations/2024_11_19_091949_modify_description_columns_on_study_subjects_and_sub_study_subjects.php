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
        // Update NULL values to an empty string or a default value
        DB::table('study_subjects')->whereNull('description')->update(['description' => '']);
        DB::table('sub_study_subjects')->whereNull('description')->update(['description' => '']);

        Schema::table('study_subjects', function (Blueprint $table) {
            $table->string('description', 1000)->nullable()->change();
        });

        Schema::table('sub_study_subjects', function (Blueprint $table) {
            $table->string('description', 1000)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('study_subjects', function (Blueprint $table) {
            $table->string('description', 255)->change();
        });

        Schema::table('sub_study_subjects', function (Blueprint $table) {
            $table->string('description', 255)->change();
        });
    }
};
