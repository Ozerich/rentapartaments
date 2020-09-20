<?php

namespace App\Http\Controllers;

use App\Interfaces\Imanager;
use Illuminate\Http\Request;

class CronController extends Controller
{
    function __construct(Imanager $manager)
    {
        $this->manager = $manager;
    }

    function new()
    {
        return $this->manager->all();
    }
    function reset(){
        return $this->manager->reset();
    }

    protected $manager;
}
