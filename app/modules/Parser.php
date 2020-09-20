<?php
/**
 * Created by IntelliJ IDEA.
 * User: Влад
 * Date: 12.09.2020
 * Time: 19:49
 */

namespace App\modules;


use App\Interfaces\Iparser;
use App\Models\Flat;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\DomCrawler\Crawler;

class Parser implements Iparser
{
    function getContent(string $link)
    {
        try {
            $html = file_get_contents($link);
            $this->crawler = new Crawler($html);
            $this->countContainerCollection = $this->crawler->filter('.bd-item')->count();
            $this->idCounter = count(Flat::all()) == 0 ? 1 : Flat::all()->max()->id + 1;
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getHeader()
    {
        try {
            $headerCollection = $this->crawler
                ->filter('.bd-item .media-body>a');
            Log::info('getHeader '.$headerCollection->count());
            foreach ($headerCollection as $collectionItem) {
                $this->headerArr[] = $collectionItem->nodeValue;
                $this->fkFlatTypeArr[] = $this->selectFkFlatTypeByHeader($collectionItem->nodeValue);
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getImgSrc()
    {
        try {
            $imgSrcCollection = $this->crawler
                ->filter('.bd-item .bd-item-left-top a:last-child>img');
            foreach ($imgSrcCollection as $collectionItem) {
                $this->imgSrcArr[] = $collectionItem->getAttribute('data-original');
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getUpdatedAnnouncementDate()
    {
        try {
            $updatedAnnouncementDateCollection = $this->crawler
                ->filter('.bd-item .bd-item-right-top p.fl');
            foreach ($updatedAnnouncementDateCollection as $collectionItem) {
                $this->updatedAnnouncementDateArr[] = $collectionItem->nodeValue;
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getPrice()
    {
        try {
            $priceCollection = $this->crawler
                ->filter('.bd-item .bd-item-left-bottom-right>p>span:first-child');
            foreach ($priceCollection as $collectionItem) {
                $this->priceArr[] = (int)$collectionItem->nodeValue;
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getPhoneForContact()
    {
        try {
            $phoneForContactCollection = $this->crawler
                ->filter('.bd-item .bd-item-right-bottom-left>p>a');
            foreach ($phoneForContactCollection as $collectionItem) {
                $this->phoneForContactArr[] = $this->getFormattedPhone($collectionItem->getAttribute('data-full'));
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    protected function getDescription()
    {
        try {
            $descriptionCollection = $this->crawler
                ->filter('.bd-item .bd-item-right-center');
            $this->descriptionArr = [];
            $str = '';
            foreach ($descriptionCollection as $collectionItem) {
                foreach ($collectionItem->childNodes as $key => $nodes) {
                    if ($nodes->nodeType == 3 || stristr($nodes->nodeValue, 'Минская область') !== false) continue;

                    if ($nodes->getElementsByTagName('a')->length != 1) {
                        $str .= $nodes->nodeValue . ";";
                    } else {
                        $anchor = $nodes->getElementsByTagName('a')[0];
                        $anchorHref = $this->createHrefAttribute($anchor->getAttribute('href'));
                        $stringWithOutLink = stristr($nodes->nodeValue, $anchor->nodeValue, true);
                        $prepare_link = "<a href='%s'>%s</a>";
                        $assembled_string = $stringWithOutLink . sprintf($prepare_link, $anchorHref, $anchor->nodeValue);
                        $str .= $assembled_string . ";";
                    }
                }
                $this->descriptionArr[] = $str;
                $str = '';
            }
            return $this;
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }


    protected function generateFillArray()
    {
        try {
            $this->getHeader()->getImgSrc()->
            getUpdatedAnnouncementDate()->getPrice()->getPhoneForContact()->getDescription();
            return $this;
        } catch (\Exception $e) {
            echo "Errors occurred while running the application";
            Log::error($e->getMessage());
        }
    }

    protected function save()
    {
        $counter = 0;
        $insertArray = [];
        while ($counter != $this->countContainerCollection) {
            $storagePath = $this->uploadImg($this->imgSrcArr[$counter],$counter);
            $insertArray[] = [
                'id' => $this->idCounter,
                'header' => $this->headerArr[$counter],
                'img' => $this->imgSrcArr[$counter],
                'storage' => $storagePath,
                'updated_announcement_date' => $this->updatedAnnouncementDateArr[$counter],
                'price' => $this->priceArr[$counter],
                'phone_for_contact' => $this->phoneForContactArr[$counter],
                'description' => $this->descriptionArr[$counter],
                'fk_type' => $this->fkFlatTypeArr[$counter],
            ];
            $counter++;
            $this->idCounter++;
            Log::info('save' . $counter);
        }
        $flat = new Flat();
        $flat->insertOrUpdate($insertArray);
        $this->headerArr = [];
        $this->imgSrcArr = [];
        $this->updatedAnnouncementDateArr = [];
        $this->priceArr = [];
        $this->phoneForContactArr = [];
        $this->descriptionArr = [];
        $this->fkFlatTypeArr = [];
    }

    protected function uploadImg(string $url,int $prefix)
    {

        try{
            $contents = file_get_contents($url);
            $name = sprintf('%s/%d_%s','uploads',$prefix,substr($url, strrpos($url, '/') + 1));
            if(!Storage::disk('public')->exists($name))
                Storage::disk('public')->put($name, $contents);
            Log::info($name);
            return $name;
        }
        catch (\Exception $e){

            return '';
        }
    }

    function uploadToDb(int $startPage = 1)
    {
        try {
            if ($startPage == 0 || !is_int($startPage)) throw new \Exception('Incorrect start page');
            $page = $startPage - 1;
            $default_page_parse = config('app.default_page_parse');
            $counter = 0;
            while ($counter != $default_page_parse) {
                $parseLink = sprintf($this->base_parse_url, $page + $counter);
                Log::info('calling ' . $parseLink);
                $this->getContent($parseLink)->generateFillArray()->save();
                $counter++;
            }
            return "success";
        } catch (\Exception $e) {
            return $this->catchError($e);
        }
    }

    private function createHrefAttribute($href)
    {
        return 'http://' . trim($href, '\.\./go/199/');
    }

    private function getFormattedPhone(string $phone)
    {
        $phoneArr = explode(', ', $phone);
        $count = count($phoneArr);
        return $count == 1 ? $phoneArr[0] : $phoneArr[$count - 2];
    }

    private function catchError(\Exception $e)
    {
        echo "Errors occurred while running the command. Check Logs";
        Log::error($e->getTraceAsString());
        Log::error($e->getMessage());
        die();
    }

    protected function selectFkFlatTypeByHeader($header)
    {
        if (stristr($header, '1 комнатную') !== false || stristr($header, '1-х') !== false ||
            stristr($header, '1-ком') !== false || stristr($header, '1-ную') !== false ||
            stristr($header, 'Одноком') !== false
        )
            return 1;

        else if (stristr($header, strtolower('2 комнатную')) !== false || stristr($header, '2-х') !== false
            || stristr($header, '2-ком.') !== false || stristr($header, '2 -') !== false ||
            stristr($header, 'Двухком') !== false || stristr($header, '2-комнатная') !== false ||
            stristr($header, '2-ух') !== false
        )
            return 2;

        else if (stristr($header, strtolower('3 комнатную')) !== false || stristr($header, '3-х') !== false ||
            stristr($header, '3 -') !== false || stristr($header, '3-ком') !== false || stristr($header, 'Трех') !== false
        )
            return 3;
        else if (stristr($header, strtolower('4 комнатную')) !== false || stristr($header, '4-х') !== false ||
            stristr($header, 'Четырехко') !== false || stristr($header, '4х') !== false
        )
            return 4;
        else
            return 5;
    }

    protected $idCounter;
    protected $crawler;
    protected $countContainerCollection;
    protected $fkFlatTypeArr;
    protected $headerArr;
    protected $imgSrcArr;
    protected $updatedAnnouncementDateArr;
    protected $priceArr;
    protected $phoneForContactArr;
    protected $descriptionArr;
    private $base_parse_url = 'https://realt.by/rent/flat-for-day/?page=%d';
}
