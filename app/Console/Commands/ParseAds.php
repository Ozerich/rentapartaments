<?php

namespace App\Console\Commands;

use App\Interfaces\Iparser;
use Illuminate\Console\Command;

class ParseAds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'parse:ads {--start_page=1 : Номер страницы с которой начинать парсинг}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Parse data from web site';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(Iparser $parser)
    {
        parent::__construct();
        $this->parser = $parser;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $start_page = $this->option('start_page');
       $result = $this->parser->uploadToDb($start_page);
        $this->info('Данные успешно получены!');
    }

    protected $parser;
}
