<?php

namespace App\Services\FileReader;

use ZipArchive;

class CbzFileReader
{
    public function __construct(string $path)
    {
        $this->zipFile = new ZipArchive();
        if (!$this->zipFile->open($path)) {
            throw new \RuntimeException('Failed to open cbz file: ' . $path);
        }
    }

    public function retrievePageNumber(int $pageNum)
    {
        $relevantFiles = [];

        for ($i = 0; $i < $this->zipFile->numFiles; $i++) {
            $fileName = $this->zipFile->getNameIndex($i);
            if (strpos($fileName, '/') > -1) {
                continue;
            }

            $extension = substr($fileName, strrpos($fileName, '.') + 1);
            // TODO FIXME extract allowed extensions into a constant/preference
            if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png'])) {
                continue;
            }

            $relevantFiles[] = $fileName;
        }

        sort($relevantFiles);

        if (count($relevantFiles) >= $pageNum) {
            return stream_get_contents($this->zipFile->getStream($relevantFiles[$pageNum - 1]));
        }
    }
}
