<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 18.09.2020
 * Time: 15:56
 */

namespace App\Http\Traits;


use Illuminate\Support\Facades\Log;

trait ErrorCatch
{
    function errorCatch(\Exception $e){
        echo "Errors occurred while running the application";
        Log::error($e->getMessage());
        die();
    }
}
