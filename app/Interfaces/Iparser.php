<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 12.09.2020
 * Time: 20:14
 */

namespace App\Interfaces;


interface Iparser
{
    function getContent(string $link);
    function uploadToDb(int $startPage);
}
