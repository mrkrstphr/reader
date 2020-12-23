<?php

use App\Http\Controllers\PeopleController;
use App\Models\Issue;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Route;
use Intervention\Image\ImageManagerStatic as Image;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/cover/{id}', function ($id) {
    $issue = Issue::findOrFail($id);
    if (!empty($issue->cover_path)) {
        return file_get_contents($issue->cover_path);
    }

    return new Response('', Response::HTTP_NOT_FOUND);
});

Route::get('/issue/{id}/page/{pageNum}', function ($id, $pageNum) {
    $issue = Issue::findOrFail($id);
    $zip = new \ZipArchive();
    // var_dump($issue->path);
    if (!$zip->open($issue->path)) {
        return new Response('', Response::HTTP_NOT_FOUND);
    }

    $relevantFiles = [];

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $fileName = $zip->getNameIndex($i);
        if (strpos($fileName, '/') > -1) {
            continue;
        }

        $extension = substr($fileName, strrpos($fileName, '.') + 1);
        if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
            continue;
        }

        // var_dump($fileName);
        $relevantFiles[] = $fileName;
    }

    sort($relevantFiles);

    // var_dump($relevantFiles);

    if (count($relevantFiles) >= $pageNum) {
        return stream_get_contents($zip->getStream($relevantFiles[$pageNum - 1]));
    }

    return new Response('', Response::HTTP_NOT_FOUND);
});


Route::get('/issue/{id}/page/{pageNum}/thumbnail', function ($id, $pageNum) {
    $issue = Issue::findOrFail($id);
    $zip = new \ZipArchive();
    // var_dump($issue->path);
    if (!$zip->open($issue->path)) {
        return new Response('', Response::HTTP_NOT_FOUND);
    }

    $relevantFiles = [];

    for ($i = 0; $i < $zip->numFiles; $i++) {
        $fileName = $zip->getNameIndex($i);
        if (strpos($fileName, '/') > -1) {
            continue;
        }

        $extension = substr($fileName, strrpos($fileName, '.') + 1);
        if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
            continue;
        }

        // var_dump($fileName);
        $relevantFiles[] = $fileName;
    }

    sort($relevantFiles);

    // var_dump($relevantFiles);

    if (count($relevantFiles) >= $pageNum) {
        $img = Image::make(stream_get_contents($zip->getStream($relevantFiles[$pageNum - 1])))->resize(400, 600, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        return $img->response('png');
    }

    return new Response('', Response::HTTP_NOT_FOUND);
});

Route::view('/{path?}', 'react')
     ->where('path', '.*')
     ->name('react');
