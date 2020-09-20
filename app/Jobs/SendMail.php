<?php

namespace App\Jobs;

use App\Mail\NewFlatAnnouncements;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendMail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Collection $collection)
    {
        $this->collection = $collection;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::to('vladislav.beluaev@gmail.com')->
        send(new NewFlatAnnouncements($this->collection->count()));
        $resultSendMail = count(Mail::failures()) === 0;
        if ($resultSendMail == true) {
            foreach ($this->collection as $flat){
                $flat->is_new = true;
                $flat->save();
            }
        }
    }

    public $collection;
}
