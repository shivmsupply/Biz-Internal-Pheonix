// IMPORT PACKAGE REFERENCES
import { combineReducers } from 'redux';


// IMPORT REDUCERS
import { FetchZipCodesReducer } from './FetchZipCodesReducer';
import { LoginReducer } from './LoginReducer';

// EXPORT APP REDUCER
export const AppReducer = combineReducers({
    zipCodes: FetchZipCodesReducer,
    LoginReducer: LoginReducer
});

