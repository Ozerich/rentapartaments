<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 19.09.2020
 * Time: 10:48
 */

namespace App\Http\Managers;


use App\Http\Traits\ErrorCatch;
use App\Interfaces\Imanager;
use App\Jobs\SendMail;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;

class CronManager implements Imanager
{
    use ErrorCatch;

    function __construct(Model $model)
    {
        $this->model = $model;
    }

    function all()
    {
        try {
            $allFlats =  $this->model->where('created_at', '>=',Carbon::now()->subHour())->get();
            if(count($allFlats)){
                SendMail::dispatch($allFlats);
                return true;
            }

        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }
    function reset(){
       try{
           Log::info('Reset property is_new in flats ');
           $flatsBuilder = $this->model->where('created_at', '<=', Carbon::now()->subDay());
           $flatsBuilder->update(['is_new'=>false]);
           Log::info('Reset property is_new in flats.Count '.$flatsBuilder->count());
       }
       catch (\Exception $e){
           $this->errorCatch($e);
           return false;
       }
    }

    function get(int $id)
    {
        // TODO: Implement get() method.
    }

    function update(array $data)
    {
        // TODO: Implement update() method.
    }

    function delete(int $id)
    {
        // TODO: Implement delete() method.
    }

    protected $model;

}
