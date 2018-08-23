import * as types from "../constants/";

const initialState={
    EnterpriseDetail:[],
    companyDeatil:[],
    selectedEnterprise:'',
    selectedCompany:''
}
const storeCurrentCompanyDetail=(state= initialState,action)=>{
  switch (action.type) {
    
   case types.ENTERPRISE_COMPANY:
     return {
       ...state,
       EnterpriseDetail:action.EnterpriseDetail,
       companyDeatil:action.companyDeatil,
       selectedEnterprise:action.selectedEnterprise,
       selectedCompany:action.selectedCompany

      }

    case types.GET_COMPANY_DETAIL:
     return {
       ...state,
       companyId:action.companyId,
       currentCompanyDetail:action.companyDetail,
       loginPrivileges:action.privileges
      }

   default:
     return state
 }
}
export default storeCurrentCompanyDetail;