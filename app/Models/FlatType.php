<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class FlatType extends Model
{
    use HasFactory;

    protected $fillable = ['type_description'];

    function flats()
    {
        return $this->hasMany(Flat::class, 'fk_type');
    }
}
