<?php

namespace App\Http\Controllers;

use App\Interfaces\Iparser;
use App\Models\FlatType;
use App\modules\AjaxHandler;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

class PagesController extends Controller
{
    function __construct(Iparser $parser, AjaxHandler $handler, Model $model)
    {
        $this->parser = $parser;
        $this->handler = $handler;
        $this->model = $model;
    }

    function index()
    {
        return view('pages.index');
    }

    function authIndex()
    {
        return view('pages.auth.index');
    }

    function newAnnouncement()
    {
        return view('pages.new');
    }

    function login()
    {
        return $this->model->login();
    }

    function logout()
    {
        return $this->model->logout();
    }

    function register()
    {
        return view('pages.register');
    }

    function upload_data($start_page=1)
    {
        $segmentsUrl = \request()->segments();
        if(count($segmentsUrl)==1)
          return  Artisan::call('parse:ads');
        return Artisan::call('parse:ads --start_page='.end($segmentsUrl));
    }

    function filter()
    {
        return $this->handler->filter();
    }

    function pagination()
    {
        return $this->handler->paginate();
    }

    function edit()
    {
        return $this->handler->edit();
    }

    function saveChange()
    {
        return $this->handler->saveChange();
    }

    function delete()
    {
        return $this->handler->delete();
    }

    function newFlats()
    {
        return $this->handler->filterNewFlats();
    }

    function paginationNewFlats()
    {
        return $this->handler->paginationNewFlats();
    }

    protected $parser;
    protected $handler;
    protected $model;

}
