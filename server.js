import path from 'path';
import express from 'express';
import webpack from 'webpack';
import middleware from './src/middleware';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import request from 'request';

let constants = require('./src/constants/constants');

let url = require('url');

const app = express();

let API_PATH;

if (process.env.NODE_ENV === 'development') {

    API_PATH = constants.TEST_API;

    const config = require('./webpack.config.dev');
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath,
        stats: {
            assets: false,
            colors: true,
            version: false,
            hash: false,
            timings: false,
            chunks: false,
            chunkModules: false
        }
    }));
    app.use(require('webpack-hot-middleware')(compiler));
    app.use(express.static(path.resolve(__dirname, 'src')));

} else {

    let apiConfig = require('./apiConfig');
    API_PATH = apiConfig.API_URL;
    process.env.NODE_ENV = apiConfig.ENV;

    app.use(express.static(path.resolve(__dirname, 'dist')));
}

//Generating secret token
const secret = 'abcdefg';
const sessionId = crypto.createHmac('sha256', secret)
    .update(Math.random().toString())
    .digest('hex');
app.set('superSecret', '9867D4F2BFAF4B37BEADEDC64720B225');
app.set('sessionID', sessionId);

let token = jwt.sign({
    sessionId: app.get('sessionID')
}, app.get('superSecret'), {expiresIn: '1h'});

app.use(cookieParser());

function parseCookies(request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function setCookies(req, res, next) {

    let cookies = parseCookies(req);
    if (!cookies.APIToken) {
        res.clearCookie('ELToken', {path: '/'});
        res.clearCookie('ELSessionId', {path: '/'});
        res.cookie('ELToken', token, {maxAge: 9000000000, httpOnly: false});
        res.cookie('ELSessionId', sessionId, {maxAge: 9000000000, httpOnly: false});
        next();
    } else {
        next();
    }
}

function checkRight(req, res, next) {

    let cookies = parseCookies(req);
    if (cookies.APIToken) {
        next();
    } else {
        res.redirect('/')
    }
}

function fullUrl(req) {
    return url.format({
        protocol: req.headers['REQUEST_SCHEME'],
        host: req.get('host'),
        pathname: req.originalUrl
    });
}

function isTokenValid(req, res, next) {

    let allCookies = parseCookies(req);

    process.env.webSiteUrl = fullUrl(req);

    //------------------------CHECKING IF TOKEN IS VALID-----------------------------------------

    // if (typeof allCookies.APIToken != 'undefined') {
    //     let options = {
    //         method: 'post',
    //         url: API_PATH + 'api/account/checktokenisvalid/',
    //         headers: {
    //             "Authorization": "Bearer " + allCookies.APIToken,
    //         }
    //     };
    //
    //     function callback(error, response, body) {
    //
    //         if (!error && response.statusCode == 200) {
    //             let isValidToken = JSON.parse(body);
    //             if (!isValidToken.result) {
    //                 res.clearCookie('APIToken', {path: '/'});
    //             }
    //             next();
    //         } else {
    //             next();
    //         }
    //     }
    //
    //     request(options, callback);
    // } else {
    //     next();
    // }

    next();
}

//added token validation
app.get('*', isTokenValid, setCookies, middleware(token, sessionId));

let nodePort = 3000;

if (typeof process.env.NODE_PORT != 'undefined') {
    nodePort = process.env.NODE_PORT;
}

app.listen(nodePort, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.info('Listening at port ' + nodePort);
    }
});