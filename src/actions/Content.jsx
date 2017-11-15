import axios from 'axios';
import Cookies from 'universal-cookie';
import * as constants from '../constants/constants';

let api;

// if(process.env.NODE_ENV === 'development') {
//     api = constants.TEST_API;
// }else{
//     let apiConfig = require('../../apiConfig');
//     api = apiConfig.API_URL;
// }

function getLanguage() {
    //This is for future language settings
    let lang = 'ru';
    if (process.env.WEBPACK) {
        const cookies = new Cookies();
        if (!!cookies.get('language')) {
            lang = cookies.get('language');
        } else {
            lang = 'ru';
        }
    } else {
        lang = process.env.language;
    }

    if (!lang) {
        lang = 'ru';
    }

    return lang;
}

function returnToken() {

    let Token = '';
    if (process.env.WEBPACK) {
        const cookies = new Cookies();
        Token = cookies.get('APIToken')
    }

    return Token
}

function returnURL() {

    let url = '';
    if (process.env.WEBPACK) {
        url = window.location.href
    }else{
        url = process.env.webSiteUrl
    }

    return url
}

// function returnOriginURL() {
//
//     let url = '';
//     if (process.env.WEBPACK) {
//         // url = window.location.href
//         url = window.location.origin
//     }else{
//         url = process.env.webSiteUrl
//     }
//
//     return url
// }

export function getContent() {
    return {
        type: 'GET_CONTENT',
        promise: axios.get('' + getLanguage()),
        load: true
    }
}

















