<?php

namespace App\Services\FileReader;

use RuntimeException;

class Factory
{
    public static function createDriver(string $fileName)
    {
        $extension = substr($fileName, strrpos($fileName, '.') + 1);
        switch (strtolower($extension)) {
            case 'cbz':
            case 'zip':
                return new CbzFileReader($fileName);
        }

        throw new RuntimeException('Cannot find a driver for file: ' . $fileName);
    }
}
