<?php

namespace App\Console\Crons;

use App\Service\DirectoryScanner;
use Illuminate\Support\Facades\DB;

class Scan
{
    public function __invoke()
    {
        DB::beginTransaction();

        $scanner = new DirectoryScanner();
        $scanner->scanDirectory(env('BOOK_PATH'));

        DB::commit();
    }
}
