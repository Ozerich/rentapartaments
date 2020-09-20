import React, {Component} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import {Marks} from "../../componentsData/Data";
import $ from 'jquery';
import Axios from "../../ajax/Axios";
import {Preloader} from "./Preloader";
import {FlatCard} from "./FlatCard";
import {AlertEmptyCollection} from "./AlertEmptyCollection";
import SimplePagination from "./SimplePagination";

export default class FilterByRoom extends Component {
    constructor(props) {
        super(props);
        this._showCountData = 15;
        this.state = {
            range: [0, 150],
            marks:Marks,
            loading: true,
            clickBtn: false,
            currentPage: 1
        };
        this.handleChange = $.proxy(this.handleChange, this);
        this.clickHandler = $.proxy(this.clickHandler, this);
        this.paginationHandler = $.proxy(this.paginationHandler, this);
        this.reload = $.proxy(this.reload, this);
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    componentDidMount() {
        this.updateDimensions();
        let {ajax} = this.props;
        let {range} = this.state;
        this.request = new Axios(ajax.post);
        let promise = this.request.post(JSON.stringify({filter: range}));
        promise.then((response) => {
            let count = response.data.pop();
            this.setState({
                pagesData: response.data,
                loading: false,
                totalCount: count
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        let {range,marks, loading, pagesData, clickBtn, currentPage, totalCount} = this.state;
        let paginationItemsCount = this._createPaginationItemCount(totalCount);
        return (
            <div className='filter-by-price'>
                <div>
                    <Typography id="range-slider" component="h2">
                        <span>Диапазон цен</span> <span>(за сутки)</span>
                    </Typography>
                    <div className='filter-by-price__slider-container'>
                        <Slider
                            value={range}
                            onChange={this.handleChange}
                            step={1}
                            aria-labelledby="range-slider"
                            valueLabelDisplay="on"
                            min={0}
                            max={300}
                            marks={marks}
                        />
                    </div>
                    <button className={clickBtn === false ? 'btn btn-info disabled' : 'btn btn-info'}
                            onClick={this.clickHandler}>
                        Показать результат
                    </button>
                </div>

                <div className='filter-by-price__result'>
                    <h2 className={loading === true ? 'd-none' : 'd-block'}>
                        {pagesData === undefined ? '' :
                            pagesData.length === this._showCountData ?
                                `Показано квартир: ${pagesData.length * currentPage} из ${totalCount}` :
                                `Показано квартир: ${totalCount} из ${totalCount}`

                        }
                    </h2>
                    {
                        loading === true ?
                            <div className='ajax-loading'>
                                <Preloader/>
                                <p>Идет загрузка информации</p>

                            </div>
                            :
                            <div className='result__items'>
                                {
                                    pagesData.length !== 0 ? pagesData.map((item, i) =>
                                            <FlatCard data={item} admin={this.props.admin} key={i} reload={this.reload}/>) :
                                        <AlertEmptyCollection/>
                                }
                            </div>
                    }
                    <SimplePagination defaultPage={currentPage} count={paginationItemsCount} isLoading={loading}
                                      onChange={this.paginationHandler}/>
                </div>
            </div>
        )
    }
    updateDimensions() {
        let {marks} = this.state;
        console.log($(window).width());
        if($(window).width() <= 600) {

            this.setState({
                marks:[
                    {
                        value: 0,
                        label: '0 BYN',
                    },
                    {
                        value: 100,
                        label: '100 BYN',
                    },
                    {
                        value: 200,
                        label: '150 BYN',
                    },
                    {
                        value: 300,
                        label: '300 BYN',
                    },
                ],
                range:[0,100],
            });

        } else {
            this.setState({
                marks:Marks,
                range:[0,150]
            })
        }
    }

    handleChange(event, stateValue) {
        this.setState({
            range: stateValue,
            clickBtn: true
        });
    }

    clickHandler(e) {
        let target$ = $(e.target);
        if (target$.hasClass('disabled')) return false;
        let {range} = this.state;
        this.setState({
            loading: true
        });
        let promise = this.request.post(JSON.stringify({filter: range}));
        promise.then((response) => {
            let count = response.data.pop();
            this.setState({
                pagesData: response.data,
                loading: false,
                clickBtn: false,
                currentPage: 1,
                totalCount: count,
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    paginationHandler(e, stateValue) {
        let {ajax} = this.props;
        let {currentPage, range} = this.state;
        if (stateValue === currentPage) return false;
        console.log('calling');
        let requestParams = {...ajax.get};
        requestParams.url = requestParams.url + `filter=${range}&page=${stateValue}&count=${this._showCountData}`;
        this.request = new Axios(requestParams);
        let promise = this.request.get();
        this.setState({
            loading: true
        });
        promise.then((response) => {
            let count = response.data.pop();
            this.setState({
                pagesData: response.data,
                loading: false,
                totalCount: count,
            });
        }).catch((error) => {
            console.log(error);
        });
        this.setState({
            currentPage: stateValue,
        });
    }
    reload() {
        this.setState({
            clickBtn: true,
        });
        $('.btn.btn-info').trigger('click');
    }

    _createPaginationItemCount(totalCount) {
        return totalCount % this._showCountData === 0 ? totalCount / this._showCountData :
            parseInt((totalCount / this._showCountData) + 1)
    }
}
