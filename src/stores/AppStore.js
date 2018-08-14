// IMPORT PACKAGE REFERENCES

import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';

// IMPORT REDUCERS
import AppReducer from '../reducers/AppReducer';

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
});
// CONFIGURE STORE

export const createAppStore = () => {
    return createStore(AppReducer, composeEnhancers(
	  applyMiddleware(thunk, promiseMiddleware())
	)
)};

