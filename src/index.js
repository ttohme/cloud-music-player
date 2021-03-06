import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

import rootReducer from './js/redux/reducers/index';
import App from './js/App';

import 'react-toastify/dist/ReactToastify.min.css';
import './css/bootstrap/bootstrap.min.css';
import './index.css';

import registerServiceWorker from './registerServiceWorker';

const middlewares = [];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(promiseMiddleware(), thunk, ...middlewares));
const history = createHistory();

ReactDOM.render(
  <Provider store={store}>
		<Router history={history}>
			<App />
	  </Router>
	</Provider>,
  document.getElementById('root'));
registerServiceWorker();
