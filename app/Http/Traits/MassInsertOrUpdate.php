<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 16.09.2020
 * Time: 0:04
 */

namespace App\Http\Traits;


use Illuminate\Support\Facades\DB;

trait MassInsertOrUpdate
{
    function insertOrUpdate(array $rows)
    {
        $table = DB::getTablePrefix() . with(new self)->getTable();


        $first = reset($rows);

        $columns = implode(',',
            array_map(function ($value) {
                return "$value";
            }, array_keys($first))
        );

        $values = implode(',', array_map(function ($row) {
                return '(' . implode(',',
                        array_map(function ($value) {
                            return '"' . str_replace('"', '""', $value) . '"';
                        }, $row)
                    ) . ')';
            }, $rows)
        );

        $updates = implode(',',
            array_map(function ($value) {
                return "$value = VALUES($value)";
            }, array_keys($first))
        );

        $sql = "INSERT INTO {$table}({$columns}) VALUES {$values} ON DUPLICATE KEY UPDATE {$updates}";

        return DB::statement($sql);
    }
}
