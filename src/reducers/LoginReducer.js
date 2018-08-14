import * as types from '../constants/'

// INITIALIZE STATE
const initialState = {
    loginInfo: {},
    pwdChangeDetail:{},
    qr:"",
    fetching: false,
    fetched: false,
    failed: false
};


// REDUCER
const LoginReducer = (state = initialState, action) => {
    switch(action.type) {
        case types.CREATE_NEW_PASS:
            return {
                ...state,
                pwdChangeDetail:action.dataChange,
                qr:''
            }
        break
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loginInfo: action.loginData
            }
        break
        case types.LOGIN_DATA_RESET:
            return {
                ...state,
                pwdChangeDetail:{},
                qr:"",
                loginInfo: {}
            }
        break
        case types.TRY_LOGIN_PENDING:
            return {
                ...state,
                loginInfo: {},
                fetching: true,
                fetched: false,
                failed: false
            };
        break
        case types.TRY_LOGIN_FULFILLED:
            return {
                ...state,
                loginInfo: action.payload,
                fetching: false,
                fetched: true,
                failed: false
            };
        break
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
}

export default LoginReducer