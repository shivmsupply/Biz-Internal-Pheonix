// IMPORT PACKAGE REFERENCES
import { combineReducers } from 'redux';
import storeSession from "./SessionReducer";
import storeState from "./StateReducer";
import commonReducer from "./CommonReducer";
import companyDetailReducer from "./CompanyDetailReducer";
import FilterReducer from "./FilterReducer";
// IMPORT REDUCERS
import { FetchZipCodesReducer } from './FetchZipCodesReducer';
import LoginReducer  from './LoginReducer';

// EXPORT APP REDUCER
const AppReducer = combineReducers({
	common: commonReducer,
    storeSession:storeSession,
    storeState:storeState,
    FilterReducer:FilterReducer,
    companyDetailReducer:companyDetailReducer,
    zipCodes: FetchZipCodesReducer,
    LoginReducer: LoginReducer
});

export default AppReducer
