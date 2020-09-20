import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import {NavData, AjaxSettings,NewFlatsAjaxSettings} from "../componentsData/Data";

import {Header} from '../components/Header';
import MainContent from '../components/MainContent';
import {Footer} from "../components/Footer";

let path = window.location.pathname;
let header$ = $('header[role="banner"]');
let nav$ = $('nav[role="navigation"]');
let main$ = $('section[role="main"]');
let login$ = $('main');
let footer$ = $('footer[role="contentinfo"]');

switch (path) {
    case '/auth/index':
        ReactDOM.render(
            <Header page={path}/>
            , header$[0]
        );
        ReactDOM.render(
            <MainContent links={NavData} ajax={AjaxSettings} admin={true}/>
            , main$[0]
        );
        ReactDOM.render(
            <Footer/>
            , footer$[0]
        );
        break;
    case '/new':
        ReactDOM.render(
            <Header page={path}/>
            , header$[0]
        );
        ReactDOM.render(
            <MainContent links={NavData} ajax={NewFlatsAjaxSettings} admin={true}/>
            , main$[0]
        );
        break;
    default:
        ReactDOM.render(
            <Header page={path}/>
            , header$[0]
        );

        ReactDOM.render(
            <MainContent links={NavData} ajax={AjaxSettings} admin={false}/>
            , main$[0]
        );
        ReactDOM.render(
            <Footer/>
            , footer$[0]
        );
        break;
}



