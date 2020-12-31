<?php

namespace App\Http\Controller;

use App\Http\ImageResponse;
use App\Models\Issue;
use App\Services\FileReader\Factory as FileReaderFactory;
use Illuminate\Http\Response;
use Intervention\Image\ImageManagerStatic as Image;

class AssetController
{
    public function issueCover(int $issueId): Response
    {
        $issue = Issue::findOrFail($issueId);
        if (!empty($issue->cover_path)) {
            return ImageResponse::makeFromPath($issue->cover_path);
        }

        abort(404);
    }

    public function pageThumbnail(int $id, int $pageNum)
    {
        $issue = Issue::findOrFail($id);
        $fileReader = FileReaderFactory::createDriver($issue->path);
        $page = $fileReader->retrievePageNumber($pageNum);

        if (!$page) {
            abort(404);
        }

        // TODO FIXME put thumbnail size in a constant for easy configuration
        $img = Image::make($page)->resize(400, 600, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        // TODO FIXME put image quality in a constant for easy configuration
        $img->encode($img->mime, 90);
        $data = $img->getEncoded();

        return ImageResponse::makeFromContents($data);
    }

    public function fullPage(int $id, int $pageNum): Response
    {
        $issue = Issue::findOrFail($id);
        $fileReader = FileReaderFactory::createDriver($issue->path);
        $page = $fileReader->retrievePageNumber($pageNum);

        if (!$page) {
            abort(404);
        }

        return ImageResponse::makeFromContents($page);
    }
}
