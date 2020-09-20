<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 19.09.2020
 * Time: 10:39
 */

namespace App\Interfaces;


interface Imanager
{
    function all();
    function get(int $id);
    function update(array $data);
    function delete(int $id);

}
