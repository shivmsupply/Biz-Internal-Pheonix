
import * as types from '../constants/index'


// INITIALIZE STATE
const initialState = {
    loginInfo: {},
    fetching: false,
    fetched: false,
    failed: false
};


// REDUCER
export const LoginReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.TRY_LOGIN_PENDING:
            return {
                ...state,
                loginInfo: {},
                fetching: true,
                fetched: false,
                failed: false
            };
        case types.TRY_LOGIN_FULFILLED:
            return {
                ...state,
                loginInfo: action.payload,
                fetching: false,
                fetched: true,
                failed: false
            };
        case types.TRY_LOGIN_REJECTED:
            return {
                ...state,
                loginInfo: {},
                fetching: false,
                fetched: false,
                failed: true
            };
        default:
            return state;
    }
};