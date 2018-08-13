import { tryLogin } from '../utils/api/LoginServices';
import * as types from '../constants/index'
// ACTION GENERATORS

export const authLogin = () => ({
    type: types.TRY_LOGIN,
    payload: tryLogin()
});
