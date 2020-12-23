<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePublishersSeriesIssues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('publishers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->timestamps();
        });

        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('publisher_id');
            $table->string('name', 255);
            $table->timestamps();

            $table->foreign('publisher_id')->references('id')->on('publishers')->cascadeOnDelete();
        });

        Schema::create('issues', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('series_id')->nullable();
            $table->string('name', 255);
            $table->string('number', 50)->nullable();
            $table->integer('sort_index')->default(0);
            $table->integer('page_count')->default(0);
            $table->string('path');
            $table->string('cover_path')->nullable();
            $table->timestamps();

            $table->foreign('series_id')->references('id')->on('series')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('issues');
        Schema::dropIfExists('series');
        Schema::dropIfExists('publishers');
    }
}
