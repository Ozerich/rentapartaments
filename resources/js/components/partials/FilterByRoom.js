import React, {Component} from 'react';
import Axios from '../../ajax/Axios';
import {Preloader} from "./Preloader";
import {AlertEmptyCollection} from "./AlertEmptyCollection";
import {FlatCard} from "./FlatCard";
import SimplePagination from "./SimplePagination";

export default class FilterByRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            currentFilter: 'all',
            skip: [0, 15],
            currentPage: 1
        };
        this._showCountData = 15;
        this.clickHandler = $.proxy(this.clickHandler, this);
        this.paginationHandler = $.proxy(this.paginationHandler, this);
        this.reload = $.proxy(this.reload, this);
    }

    componentDidMount() {
        let {links, ajax} = this.props;
        let {currentFilter} = this.state;
        this.request = new Axios(ajax.post);
        let promise = this.request.post(JSON.stringify({filter: currentFilter}));
        promise.then((response) => {
            this.setState({
                pagesData: response.data,
                loading: false
            });
        }).catch((error) => {
            console.log(error);
        });

    }

    render() {
        let {loading, pagesData, currentPage} = this.state;
        let {links, ajax, admin} = this.props;
        let totalCount = pagesData !== undefined ? pagesData.pop() : null;
        let paginationItemsCount = this._createPaginationItemCount(totalCount);
        return (
            <div className='filter-by-room'>

                <div className={'filter-by-room__container-items'}>
                    {
                        links.map((item, key) => {
                            return (
                                <p className='filter-container-by-room__item' key={key}>
                                    <input id={`filter${key + 1}`} type="radio"
                                           defaultChecked={key === 0 ? true : false} name="flat_type"
                                           key={`input${key}`}/>

                                    <label data-filter={item.filter} htmlFor={`filter${key + 1}`}
                                           key={`label${key}`} onClick={this.clickHandler}>{item.title}</label>
                                </p>
                            )
                        })
                    }
                </div>
                <div className='filter-container-by-room__result'>
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
                                            <FlatCard data={item} admin={admin} reload={this.reload}
                                                      key={i}/>) :
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

    clickHandler(e) {
        let target$ = $(e.target);
        let {currentFilter} = this.state;
        if (currentFilter === target$.data('filter')) return false;
        this.setState({
            loading: true
        });
        let promise = this.request.post(JSON.stringify({filter: target$.data('filter')}));
        promise.then((response) => {
            this.setState({
                pagesData: response.data,
                loading: false,
                currentFilter: target$.data('filter'),
                currentPage: 1
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    paginationHandler(e, stateValue) {
        let {ajax} = this.props;
        let {currentPage, currentFilter} = this.state;
        if (stateValue === currentPage) return false;
        let requestParams = {...ajax.get};
        requestParams.url = requestParams.url + `filter=${currentFilter}&page=${stateValue}&count=${this._showCountData}`;
        this.request = new Axios(requestParams);
        let promise = this.request.get();
        this.setState({
            loading: true
        });
        promise.then((response) => {
            this.setState({
                pagesData: response.data,
                loading: false
            });
        }).catch((error) => {
            console.log(error);
        });
        this.setState({
            currentPage: stateValue,
            skip: [stateValue * 15, 15],
        });

    }

    reload() {
        this.setState({
            currentFilter: 0,
        });
        $('input:checked').last().next().trigger('click');
    }


    _createPaginationItemCount(totalCount) {
        return totalCount % this._showCountData === 0 ? totalCount / this._showCountData :
            parseInt((totalCount / this._showCountData) + 1)
    }
}
