<?php

namespace App\Models;

use App\Http\Traits\MassInsertOrUpdate;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Flat extends Model
{
    use HasFactory;
    use MassInsertOrUpdate;
    protected $fillable = ['id', 'header', 'img', 'storage',
        'updated_announcement_date',
        'price', 'phone_for_contact',
        'description', 'fk_type','is_new'
    ];

    function getPriceAttribute($value)
    {
        $prepare_str = '%s руб/сут.';
        return $value == 0 ? 'Договорная' : sprintf($prepare_str, $value);
    }

    function setPriceAttribute($value){
        Log::info((int)$value);

        $this->attributes['price'] = (int)$value;
    }

    function getStorageAttribute($value)
    {

        return $value == '' ? '/images/no_image.PNG' : $value;
    }
}
