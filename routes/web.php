<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'PagesController@index')->name('index');
Route::get('/login', 'PagesController@login')->name('login');
Route::get('/register', 'PagesController@register');
Route::get('/upload_data/{start_page?}','PagesController@upload_data');
Route::get('/new','PagesController@newAnnouncement')->name('new_flats');

Route::group(['prefix'=>'/ajax','middleware'=>'web'],function(){
    Route::post('/filter','PagesController@filter');
    Route::get('/filter','PagesController@pagination');
    Route::get('/edit','PagesController@edit');
    Route::post('/edit','PagesController@saveChange');
    Route::post('/delete','PagesController@delete');
    Route::post('/new_flats/filter','PagesController@newFlats');
    Route::get('/new_flats/filter','PagesController@paginationNewFlats');
});

Route::group(['prefix'=>'/cron','middleware'=>'web'],function(){
    Route::get('/new','CronController@new');
    Route::get('/reset','CronController@reset');
});


Route::group(['middleware'=>'auth'],function(){
    Route::get('/auth/index','PagesController@authIndex')->name('auth_index');
    Route::get('/logout','PagesController@logout');
});

