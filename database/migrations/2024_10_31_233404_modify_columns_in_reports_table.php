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
        Schema::table('reports', function (Blueprint $table) {
            // Modify sub_study_subject_id to be nullable
            $table->unsignedBigInteger('sub_study_subject_id')->nullable()->change();

            // Modify status to accept only enum values [0, 1, 2]
            $table->enum('status', ['0', '1', '2'])->default('0')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            // Revert sub_study_subject_id to not nullable
            $table->unsignedBigInteger('sub_study_subject_id')->nullable(false)->change();

            // Revert status to its previous state (assuming it was a string)
            $table->string('status')->default('0')->change();
        });
    }
};
