import {getFullDate} from "./functions";

const NavData = [

    {
        filter:'all',
        title:'Все'
    },
    {
        filter:1,
        title:'1 комнатные'
    },
    {
        filter:2,
        title:'2 комнатные'
    },
    {
        filter:3,
        title:'3 комнатные'
    },
    {
        filter:4,
        title:'4 комнатные'
    },
    {
        filter:5,
        title:'Апартаменты'
    },
];

const NavButtons = {
    '/':[{'title':'Войти','href':'/login'},{'header':'Поиск квартир в Беларуси'}],
    '/login':[{'title':'Главная','href':'/'},{'title':'Регистрация','href':'/register'},{'header':'Вход в приложение'}],
    '/register':[{'title':'Главная','href':'/'},{'title':'Войти','href':'/login'},{'header':'Регистрация в приложении'}],
    '/auth/index':[{'title':'Выход','href':'/logout'},{'header':'Приветствуем Вас в приложении'},{}],
    '/new':[{'title':'Войти','href':'/login'},{'header':`Новые предложения по квартирам за ${getFullDate()}`}],
};

const Marks = [
    {
        value: 0,
        label: '0 BYN',
    },
    {
        value: 50,
        label: '50 BYN',
    },
    {
        value: 100,
        label: '100 BYN',
    },
    {
        value: 150,
        label: '150 BYN',
    },
    {
        value: 200,
        label: '200 BYN',
    },

    {
        value: 250,
        label: '250 BYN',
    },

    {
        value: 300,
        label: '300 BYN',
    },
];
const AjaxSettings = {
    post:{
        url: '/ajax/filter',
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'application/json'
        },
    },
    get:{
        url: '/ajax/filter?',
        type: "GET",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'text/plain',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'text/plain'
        },
    }

};

const RemoveAjaxSettings = {
    post:{
        url: '/ajax/delete',
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'application/json'
        },
    },
};
const EditAjaxSettings = {

    get:{
        url: '/ajax/edit?',
        type: "GET",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'text/plain',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'text/plain'
        },
    },
    post:{
        url: '/ajax/edit',
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'enctype': 'multipart/form-data',
            processData: false,
            contentType : false,
        },
    },
};

const NewFlatsAjaxSettings = {
    post:{
        url: '/ajax/new_flats/filter',
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'application/json'
        },
    },
    get:{
        url: '/ajax/new_flats/filter?',
        type: "GET",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'Content-Type': 'text/plain',
            'charset': 'utf-8',
            'async': true,
            'Accept': 'text/plain'
        },
    }
};


export {NavButtons,NavData,Marks,AjaxSettings,EditAjaxSettings,RemoveAjaxSettings,NewFlatsAjaxSettings};
