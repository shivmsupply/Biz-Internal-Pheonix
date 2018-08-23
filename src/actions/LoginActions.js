import { tryLogin } from '../utils/api/LoginServices';
import * as types from '../constants/index'
// ACTION GENERATORS

export const authLogin = () => ({
    type: types.TRY_LOGIN,
    payload: tryLogin()
});




export function storeEnterpriseAndCompany(_eList,_cList,_sE,_sC) {
    return {
        type: types.ENTERPRISE_COMPANY,
        EnterpriseDetail: _eList,
        companyDeatil:_cList,
        selectedEnterprise:_sE,
        selectedCompany:_sC
    }
}
export function storeSession(isLogin,loginDetail) {
    return {
        type: types.SESSION_INFO,
        isLogin: isLogin,
        loginDetail:loginDetail
    }
}
export function storeState(stateInfo) {
    return {
        type: types.GET_State,
        stateInfo:stateInfo
    }
}

export function storeCurrentCompanyDetail(companyId,companyDetail,privileges) {
    return {
        type: types.GET_COMPANY_DETAIL,
        companyId:companyId,
        companyDetail:companyDetail,
        privileges:privileges
    }
}

export function setBreadCrumb(_breadCrumb,_isDetail){
    return {
        type:types.BREADCRUMB,
        breadCrumbs:_breadCrumb,
        isDetail:_isDetail
    }
}



export function saveInputValue(value) {
    return {
        type: types.SAVE_INPUT_DATA,
        data: value
    }
}



export const  changePass = dataChange => {
    return {
        type: types.CREATE_NEW_PASS,
        dataChange: dataChange
    }
}

export const  loginInfo = loginData => {
    console.log("submitted in action", loginData)
    return {
        type: types.LOGIN_SUCCESS,
        loginData: loginData
    }

}

export const resetFirstLogin = () =>{
    return{
        type: types.LOGIN_DATA_RESET,
    }
}

export const handleUrl = (data) =>{
    return{
        type:types.TAB_URL,
        url: data
    }
}