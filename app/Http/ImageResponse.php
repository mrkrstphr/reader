<?php

namespace App\Http;

use Illuminate\Support\Facades\Response;

class ImageResponse
{
    public static function makeFromPath(string $path)
    {
        $data = file_get_contents($path);
        $mime = finfo_file(finfo_open(FILEINFO_MIME_TYPE), $path);
        $length = strlen($data);

        $response = Response::make($data);
        $response->header('Content-Type', $mime);
        $response->header('Content-Length', $length);
        $response->header('Cache-control', 'max-age=' . (60 * 60 * 24));

        return $response;
    }

    public static function makeFromContents(string $contents)
    {
        $mime = finfo_buffer(finfo_open(FILEINFO_MIME_TYPE), $contents);
        $length = strlen($contents);

        $response = Response::make($contents);
        $response->header('Content-Type', $mime);
        $response->header('Content-Length', $length);
        $response->header('Cache-control', 'max-age=' . (60 * 60 * 24));

        return $response;
    }
}
