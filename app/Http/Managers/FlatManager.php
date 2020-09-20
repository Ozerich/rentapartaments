<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 18.09.2020
 * Time: 15:46
 */

namespace App\Http\Managers;


use App\Http\Traits\ErrorCatch;
use App\Interfaces\Imanager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class FlatManager implements Imanager
{
    use ErrorCatch;

    function __construct(Model $model)
    {
        $this->model = $model;
    }

    function all()
    {
        try {
            return $this->model->all();
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function newFlats(){
        try {
            return $this->model->where('is_new','=',1)->get();
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function get(int $id)
    {
        try {
            return $this->model->find($id);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }

    }

    function getFlatsByPriceRange(array $range)
    {
        try {
            return $this->model->whereBetween('price', $range)->orderBy('price', 'asc')->get();
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }
    function getNewFlatsByPriceRange(array $range){
        try {
            return $this->model->whereBetween('price', $range)->where('is_new','=',true)->orderBy('price', 'asc')->get();
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function update($data)
    {
        try {
            $id = $data['id'];
            $flat = $this->get($id);
            $saveData = array_filter($data, function ($key) {
                return in_array($key, ['header', 'updated_announcement_date', 'price', 'phone_for_contact', 'description']);
            }, ARRAY_FILTER_USE_KEY);
            if (isset($data['storage']) && is_file($data['storage'])) {
                $uploadFile = $data['storage'];
                if (Storage::disk('public')->exists($flat->storage))
                    Storage::disk('public')->delete($flat->storage);

                $uploadFileName = $uploadFile->getClientOriginalName();
                $preparePath = '%s/%d_%s';
                $name = sprintf($preparePath, 'uploads', time(), $uploadFileName);
                Storage::disk('public')->put($name, file_get_contents($uploadFile));
                $saveData['storage'] = $name;
            }
            return $flat->update($saveData);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function delete(int $id)
    {
        try {
            $result = $this->get($id)->delete();
            return ['result' => $result];
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    protected $model;
}
