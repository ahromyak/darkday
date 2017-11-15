import React from 'react';
import {renderToString} from 'react-dom/server';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {match, RouterContext} from 'react-router';
import reducers from './reducers';
import routes from './routes';
import {Helmet} from "react-helmet";
import thunk from 'redux-thunk'
import promiseMiddleware from '../src/middleware/promiseMiddleware'
import {applyMiddleware} from 'redux'

let helmet;

function observeStore(store, select, onChange) {
    let currentState;

    function handleChange() {
        let nextState = select(store.getState());
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    }

    let unsubscribe = store.subscribe(handleChange);
    handleChange();
    return unsubscribe;
}

function select(state) {
    return state.some.deep.property
}

export default (token, sessionId) => {
    return (req, res) => {

        match({routes, location: req.url}, (error, redirectLocation, renderProps) => {

            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                if (process.env.NODE_ENV == 'development') {
                    res.status(200).send(`
					<!doctype html>
					<html>
						<head>
							<meta charset="UTF-8">
                            <meta http-equiv="content-type" content="text/html;charset=utf-8" />
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
							<meta name="google-signin-client_id" content="162881445587-jpitbbhpc3892s8bna9dpeg1o58ds3is.apps.googleusercontent.com">
							 <link href="/assets/images/favicon.ico" rel="shortcut icon">
							<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&amp;subset=cyrillic" rel="stylesheet">
							<link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
							<script type='text/javascript' src='https://apis.google.com/js/platform.js'></script>
						</head>
						<body>
							<div id='site'></div>
							<script src='/bundle.js'></script>
						</body>
					</html>
				`);
                } else if (process.env.NODE_ENV == 'production') {

                    let finalState;
                    const store = createStore(reducers, applyMiddleware(thunk, promiseMiddleware));
                    renderToString(
                        <Provider store={store}>
                            <RouterContext {...renderProps} />
                        </Provider>
                    );

                    const unsubscribe = store.subscribe(() => {
                        finalState = store.getState();
                        if (finalState.content.wait === 0) {
                            unsubscribe();
                            let html = renderToString(
                                <Provider store={store}>
                                    <RouterContext {...renderProps} />
                                </Provider>
                            );
                            helmet = Helmet.renderStatic();

                            let cache = [];
                            let initialState = JSON.stringify(finalState, function (key, value) {
                                if (typeof value === 'object' && value !== null) {
                                    if (cache.indexOf(value) !== -1) {
                                        // Circular reference found, discard key
                                        return;
                                    }
                                    // Store value in our collection
                                    cache.push(value);
                                }
                                return value;
                            });
                            cache = null;

                            res.status(200).send(renderFullPage(html, initialState));
                        }
                    });
                }
            } else {
                res.status(404).send('Server Not found');
            }
        });
    };
}

function renderFullPage(html, finalState) {
    return `
    <!doctype html>
    <html>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <meta charset="UTF-8">
            <meta http-equiv="content-type" content="text/html;charset=utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
            <meta name="google-signin-client_id" content="162881445587-jpitbbhpc3892s8bna9dpeg1o58ds3is.apps.googleusercontent.com">
            <script type='text/javascript' src='https://apis.google.com/js/platform.js' async></script>
            <link href="/assets/images/favicon.ico" rel="shortcut icon">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&amp;subset=cyrillic" rel="stylesheet">
            <link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
            <link rel='stylesheet' href='/bundle.css' >
        </head>
        <body>
            <div id='site'>${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${finalState}; 
        </script>
            <script src='/bundle.js' async></script>
        </body>
    </html>
    `
}

// function parseCookies(request) {
//     let list = {},
//         rc = request.headers.cookie;
//
//     rc && rc.split(';').forEach(function (cookie) {
//         let parts = cookie.split('=');
//         list[parts.shift().trim()] = decodeURI(parts.join('='));
//     });
//
//     return list;
// }



