import * as types from '../constants/index'


// INITIALIZE STATE
const initialState = {
    zipCodes: [],
    fetching: false,
    fetched: false,
    failed: false
};


// REDUCER
export const FetchZipCodesReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.FETCH_ZIPCODES_PENDING:
            return {
                ...state,
                zipCodes: [],
                fetching: true,
                fetched: false,
                failed: false
            };

        case types.FETCH_ZIPCODES_FULFILLED:
            return {
                ...state,
                zipCodes: action.payload,
                fetching: false,
                fetched: true,
                failed: false
            };
            
        case types.FETCH_ZIPCODES_REJECTED:
            return {
                ...state,
                zipCodes: [],
                fetching: false,
                fetched: false,
                failed: true
            };
        default:
            return state;
    }
};