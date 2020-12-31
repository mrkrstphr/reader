<?php

use App\Http\Controller\AssetController;
use Illuminate\Support\Facades\Route;

$assetDef = ['prefix' => 'assets'];

Route::group($assetDef, function ($router) {
    $router->get(
        '/cover/{issueId}',
        [AssetController::class, 'issueCover']
    );

    $router->get(
        '/issue/{id}/page/{pageNum}',
        [AssetController::class, 'fullPage']
    );

    $router->get(
        '/issue/{id}/page/{pageNum}/thumbnail',
        [AssetController::class, 'pageThumbnail']
    );
});

Route::view('/{path?}', 'react')
     ->where('path', '.*')
     ->name('react');
