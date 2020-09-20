<?php

namespace App\Providers;

use App\Console\Commands\ParseAds;
use App\Http\Controllers\CronController;
use App\Http\Controllers\PagesController;
use App\Http\Managers\CronManager;
use App\Http\Managers\FlatManager;
use App\Interfaces\Imanager;
use App\Interfaces\Iparser;
use App\Models\Flat;
use App\Models\FlatType;
use App\Models\User;
use App\modules\AjaxHandler;
use App\modules\Parser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->when(ParseAds::class)
            ->needs(Iparser::class)
            ->give(Parser::class);

        $this->app->when(PagesController::class)
            ->needs(Iparser::class)
            ->give(Parser::class);

        $this->app->when(PagesController::class)
            ->needs(Model::class)
            ->give(User::class);

        $this->app->when(CronController::class)
            ->needs(Imanager::class)
            ->give(CronManager::class);

        $this->app->when(FlatManager::class)
            ->needs(Model::class)
            ->give(Flat::class);

        $this->app->when(FlatManager::class)
            ->needs(Imanager::class)
            ->give(FlatManager::class);

        $this->app->when(CronManager::class)
            ->needs(Model::class)
            ->give(Flat::class);

        $this->app->when(AjaxHandler::class)
            ->needs(Model::class)
            ->give(FlatType::class);

        $this->app->when(AjaxHandler::class)
            ->needs(Imanager::class)
            ->give(FlatManager::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
