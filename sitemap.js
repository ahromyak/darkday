import request from 'request';
import * as constants from './src/constants/constants';
let sm = require('sitemap'),fs = require('fs');

let apiConfig = require('./apiConfig');
let PATH_API;
PATH_API = apiConfig.API_URL;

let allNewsIdsRequestSettings = {
    // url: constants.PATH_API + '/api/News/getNewsSiteMap/',
    url: PATH_API + '/api/News/getNewsSiteMap/',
    method: 'GET',
    encoding: null
};

let newsCountRequestSettings = {
    // url: constants.PATH_API + '/api/news/GetNewsCount/en',
    url: PATH_API + '/api/news/GetNewsCount/en',
    method: 'GET',
    encoding: null
};

let newsIdsPromise = new Promise((resolve, reject) => {
    request(allNewsIdsRequestSettings, (error, response, body) => {
        let idsArray = JSON.parse(body);
        resolve(idsArray);
    });
});

let newsCountPromise = new Promise((resolve, reject) => {
    request(newsCountRequestSettings, (error, response, body) => {
        resolve(JSON.parse(body));
    });
});

Promise.all([newsIdsPromise, newsCountPromise]).then(values => {

    let newsPage = [];
    let newsPerPage = 15;
    let newsList = [];
    let countMaxIds = 4000;

    let pages = [
        {url: '/faq/', changefreq: 'daily', priority: 0.3},
        {url: '/contact/', changefreq: 'monthly', priority: 0.7},
        {url: '/representatives/', changefreq: 'monthly', priority: 0.7},
        {url: '/createdeposit/', changefreq: 'monthly', priority: 0.7},
        {url: '/confidentialpolicy/', changefreq: 'monthly', priority: 0.7},
        {url: '/rules/', changefreq: 'monthly', priority: 0.7},
        {url: '/antispampolicy/', changefreq: 'monthly', priority: 0.7},
        {url: '/deposit/', changefreq: 'monthly', priority: 0.7},
    ]

    if(values[0].list.length > countMaxIds){
        values[0].list.length = countMaxIds;
    }

    values[0].list.map((el) => {
        countMaxIds--;
        if (countMaxIds) {
            newsList.push(
                {url: '/singlenews/' + el, changefreq: 'monthly', priority: 0.7},
            )
        }
    });

    for (let i = 0; i <= Math.ceil(values[1] / newsPerPage); i++) {
        if(i == 0){
            newsPage.push(
                {url: '/news/', changefreq: 'monthly', priority: 0.7},
            )
        }else{
            newsPage.push(
                {url: '/news/' + i, changefreq: 'monthly', priority: 0.7},
            )
        }

        if(i>980){
            break;
        }
    }

    let allPages = [...pages,...newsPage,...newsList];

    let sitemap = sm.createSitemap({
        hostname:  constants.DOMAIN_NAME,
        // hostname:  'http://elquire.com',
        cacheTime: 600000,
        urls: allPages
    });

    try {
        fs.writeFileSync("./dist/sitemap.xml", sitemap.toString());
    }
    catch (e) {
       console.log('Probably dist folder doesnt exist. Full Error is - ' + e);
    }

});