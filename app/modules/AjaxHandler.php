<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 15.09.2020
 * Time: 12:40
 */

namespace App\modules;


use App\Http\Traits\ErrorCatch;
use App\Interfaces\Imanager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AjaxHandler
{
    use ErrorCatch;

    public function __construct(Request $request, Model $model, Imanager $manager)
    {
        $this->request = $request;
        $this->model = $model;
        $this->manager = $manager;
    }

    function filter()
    {
        try {
            $filterParam = $this->decodingJson($this->request->getContent());
            if (!is_array($filterParam['filter']))
                return $this->filterByRoom($filterParam['filter']);
            return $this->filterByPrice($filterParam['filter']);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function paginate()
    {
        try {
            extract($this->request->all());

            $skip = $count * ($page - 1);
            if (stristr($filter, ',') === false) {
                return $this->filterByRoom($filter, $skip, $count);
            }
            return $this->filterByPrice(explode(',', $filter), $skip, $count);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }

    }

    function paginationNewFlats(){
        try {
            extract($this->request->all());

            $skip = $count * ($page - 1);
            if (stristr($filter, ',') === false) {
                return $this->newFlatsFilterByRoom($filter, $skip, $count);
            }
            return $this->newFlatsFilterByPrice(explode(',', $filter), $skip, $count);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function edit()
    {
        try {
            extract($this->request->all());
            return $this->manager->get($id);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }

    }

    function saveChange()
    {
        try{
            $data = $this->request->all();
            return $this->manager->update($data);
        }
        catch (\Exception $e){
            $this->errorCatch($e);
            return false;
        }

    }

    function delete()
    {
        try{
            $filterParam = $this->decodingJson($this->request->getContent());
            return $this->encodingJson($this->manager->delete($filterParam['filter']));
        }
        catch (\Exception $e){
            $this->errorCatch($e);
            return false;
        }
    }

    function filterByRoom($filter, $skip = 0, $take = 15)
    {
        try {
            $filterData = null;
            $count = null;
            $allFlats = null;
            if ($filter == 'all') {
                $allFlats = $this->manager->all();
                $count = count($allFlats);
                $filterData = $allFlats->splice($skip, $take);
                $filterData->push($count);
                return $this->encodingJson($filterData->all());
            }
            $allFlats = $this->model->find($filter)->flats;
            $count = count($allFlats);
            $filterData = $allFlats->splice($skip, $take);
            $filterData->push($count);
            return $this->encodingJson($filterData->all());
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }
    function newFlatsFilterByRoom($filter, $skip = 0, $take = 15){
        try {
            $filterData = null;
            $count = null;
            $allFlats = null;
            if ($filter == 'all') {
                $allFlats = $this->manager->newFlats();
                $count = count($allFlats);
                $filterData = $allFlats->splice($skip, $take);
                $filterData->push($count);
                return $this->encodingJson($filterData->all());
            }
            $allFlats = $this->model->find($filter)->flats()->where('is_new','=',true)->get();
            $count = count($allFlats);
            $filterData = $allFlats->splice($skip, $take);
            $filterData->push($count);
            return $this->encodingJson($filterData->all());
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function filterByPrice($filter,$skip = 0, $take = 15)
    {
        try {
            $minPrice = min($filter);
            $maxPrice = max($filter);
            $allFlats = $this->manager->getFlatsByPriceRange([$minPrice, $maxPrice]);
            $count = count($allFlats);
            $filterData = $allFlats->splice($skip, $take);
            $filterData->push($count);
            return $this->encodingJson($filterData->all());
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }
    function newFlatsFilterByPrice($filter, $skip = 0, $take = 15)
    {
        try {
            $minPrice = min($filter);
            $maxPrice = max($filter);
            $allFlats = $this->manager->getNewFlatsByPriceRange([$minPrice, $maxPrice]);
            $count = count($allFlats);
            $filterData = $allFlats->splice($skip, $take);
            $filterData->push($count);
            return $this->encodingJson($filterData->all());
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    function filterNewFlats(){
        try {
            $filterParam = $this->decodingJson($this->request->getContent());
            if (!is_array($filterParam['filter']))
                return $this->newFlatsFilterByRoom($filterParam['filter']);
            return $this->newFlatsFilterByPrice($filterParam['filter']);
        } catch (\Exception $e) {
            $this->errorCatch($e);
            return false;
        }
    }

    private function decodingJson($json)
    {
        return \GuzzleHttp\json_decode($json, true);
    }

    private function encodingJson($array)
    {
        return \GuzzleHttp\json_encode($array);
    }

    protected $request;
    protected $model;
    protected $manager;
}
