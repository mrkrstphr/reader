<?php

namespace App\Console\Commands;

use App\Models\Issue;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManagerStatic as Image;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

const SUPPORTED_TYPES = ['cbz'];

function getIssueFolder($id)
{
    return ($id - ($id % 100));
}

class Scan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(env('BOOK_PATH')));

        $files = array();

        DB::beginTransaction();

        foreach ($rii as $file) {
            if ($file->isDir()) {
                continue;
            }

            $issue = Issue::where('path', $file->getPathname())->first();
            if ($issue) {
                continue;
            }

            echo "-- Processing file: [$file->getPathname()]\n";

            $issue = new Issue();
            $issue->path = $file->getPathname();
            $issue->name = str_replace('.' . $file->getExtension(), '', $file->getFilename());

            $issue->save();

            $issueFolder = getIssueFolder($issue->id);

            $files[] = $file->getPathname();

            $zip = new \ZipArchive();
            if (!$zip->open($file->getPathname())) {
                echo "---- Failed to open file, skipping...\n";
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

                // var_dump($fileName);
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

                // file_put_contents($storageFileName, $coverImage);

                $issue->cover_path = $storageFileName;
                $issue->page_count = count($relevantFiles);
                $issue->save();
            }

            echo "---- done!\n";
        }

        DB::commit();

        return 0;
    }
}
