import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Router, browserHistory} from 'react-router'
import routes from './routes'
import {Provider} from 'react-redux'
import configureStore from './store/configureStore'
// import App from './containers/App';
// import {CookiesProvider} from 'react-cookie';

// Grab the state from a global variable injected into the server-generated HTML
const initialState = window.__INITIAL_STATE__;

// Allow the passed state to be garbage-collected
delete window.__INITIAL_STATE__;

const store = configureStore(initialState);

function logPageView() {
    //console.log('starting page...');
}

render(
    <Provider store={store}>
            <Router history={browserHistory} routes={routes} onUpdate={logPageView}/>
    </Provider>,
    document.getElementById('site')
);