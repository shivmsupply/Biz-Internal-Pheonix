// IMPORT PACKAGE REFERENCES
import { combineReducers } from 'redux';
import storeSession from "./SessionReducer";
import storeState from "./StateReducer";
import commonReducer from "./CommonReducer";
import companyDetailReducer from "./CompanyDetailReducer";

// IMPORT REDUCERS
import { FetchZipCodesReducer } from './FetchZipCodesReducer';
import LoginReducer  from './LoginReducer';

// EXPORT APP REDUCER
const AppReducer = combineReducers({
	common: commonReducer,
    storeSession:storeSession,
    storeState:storeState,
    companyDetailReducer:companyDetailReducer,
    zipCodes: FetchZipCodesReducer,
    LoginReducer: LoginReducer
});

export default AppReducer
