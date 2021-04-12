<?php

namespace App\Service;

use App\Models\Issue;
use Intervention\Image\ImageManagerStatic as Image;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

const SUPPORTED_TYPES = ['cbz'];

function getIssueFolder($id)
{
    return ($id - ($id % 100));
}

class DirectoryScanner
{
    public function scanDirectory($directory)
    {
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory));

        $files = [];

        foreach ($rii as $file) {
            if ($file->isDir()) {
                continue;
            }

            if (!in_array(strtolower($file->getExtension()), SUPPORTED_TYPES)) {
                // TODO FIXME log
                continue;
            }

            $issue = Issue::where('path', $file->getPathname())->first();
            if ($issue) {
                continue;
            }

            $issue = new Issue();
            $issue->path = $file->getPathname();
            $issue->name = str_replace('.' . $file->getExtension(), '', $file->getFilename());

            $issue->save();

            $issueFolder = getIssueFolder($issue->id);

            $files[] = $file->getPathname();

            $zip = new \ZipArchive();
            if (!$zip->open($file->getPathname())) {
                // TODO FIXME error report, something
                continue;
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

                $relevantFiles[] = $fileName;
            }

            if (count($relevantFiles)) {
                sort($relevantFiles);

                $coverImageName = $relevantFiles[0];
                $coverImage = stream_get_contents($zip->getStream($coverImageName));
                $storageFileName = rtrim(env('COVER_AND_META_PATH'), '/') . '/' . $issueFolder . '/' . $issue->id .
                    substr($coverImageName, strrpos($coverImageName, '.'));

                if (!file_exists(dirname($storageFileName))) {
                    mkdir(dirname($storageFileName));
                }

                $img = Image::make($coverImage)->resize(400, 600, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                $img->save($storageFileName);

                $issue->cover_path = $storageFileName;
                $issue->page_count = count($relevantFiles);
                $issue->save();
            }
        }
    }
}
