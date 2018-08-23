import utils from '../utils/api/FilterServices';
import * as types from '../constants/index'
// ACTION GENERATORS



// GET ENTERPRISE
export const getEnterprices = () => ({
    type: types.GET_ENTERPRICE_LIST,
    payload:  utils.getEnterpriceList().then((res)=>{return res.message})
});

//GET COMPANY
export const getCompany = (_eID) => ({
    type: types.GET_COMPANY_LIST,
    payload: utils.getCompanyList(_eID).then(res=> {return res.message}),
    
})

//GET PROJECT
export const getProject = (_eID,_cID) => ({
    type: types.GET_PROJECT_LIST,
    payload: utils.getProjectList(_eID,_cID).then(res=> {return res.message}),
    
})

// GET UPDATED ENTERPRISE-ID
export const updateEnterpriseId=(_eID)=>{
    return{
        type:types.SELECTED_ENTERPRISE,
        enterpriseId:_eID

    }
}

// GET UPDATED COMPANY-ID
export const updateCompanyId=(_cID)=>{
   
    return{
        type:types.SELECTED_COMPANY,
        companyId:_cID

    }
}


// GET UPDATED COMPANY-ID
export const updateProjectId=(_cID)=>{
    
    return{
        type:types.SELECTED_PROJECT,
        projectId:_cID

    }
}

