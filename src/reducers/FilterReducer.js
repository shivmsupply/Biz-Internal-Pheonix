import * as types from '../constants/'

// INITIALIZE STATE
const initialState = {
    enterpriseOptions: [],
    companyOptions:[],
    projectOptions:[],
    selectedEnterprise:"",
    selectedCompany:"",
    selectedProject:"",
    fetching: false,
    fetched: false,
    failed: false
};


// REDUCER
const FilterReducer = (state = initialState, action) => {
    
    switch(action.type) {
        
        case types.GET_ENTERPRICE_LIST+'_PENDING':
            return {
                ...state,
                companyOptions:[],
                projectOptions:[],
                enterpriseOptions: [],
                fetching: true,
                fetched: false,
                failed: false
            }
        break
        
        case types.GET_ENTERPRICE_LIST+'_FULFILLED':
            return {
                ...state,
                companyOptions:[],
                projectOptions:[],
                enterpriseOptions: action.payload,
                fetching: false,
                fetched: true,
                failed: false
            }
        break

        case types.GET_ENTERPRICE_LIST+'_REJECTED':
            return {
                ...state,
                companyOptions:[],
                projectOptions:[],
                enterpriseOptions: action.payload,
                zipCodes: [],
                fetching: false,
                fetched: false,
                failed: true
            }
        break

        //GET Company Details
        case types.GET_COMPANY_LIST+'_PENDING':
            return {
                ...state,
                companyOptions: [],
                projectOptions:[],
                fetching: true,
                fetched: false,
                failed: false
            }
        break
        
        case types.GET_COMPANY_LIST+'_FULFILLED':
        console.log("action for company==========>", action)
            return {
                ...state,
                companyOptions: action.payload,
                projectOptions:[],
                fetching: false,
                fetched: true,
                failed: false
            }
        break

        case types.GET_COMPANY_LIST+'_REJECTED':
            return {
                ...state,
                companyOptions: action.payload,
                projectOptions:[],
                zipCodes: [],
                fetching: false,
                fetched: false,
                failed: true
            }
        break


        //GET PROJECT Details
        case types.GET_PROJECT_LIST+'_PENDING':
            return {
                ...state,
                projectOptions:[],
                fetching: true,
                fetched: false,
                failed: false
            }
        break
        
        case types.GET_PROJECT_LIST+'_FULFILLED':
        console.log("action for company==========>", action)
            return {
                ...state,
                
                projectOptions:action.payload,
                fetching: false,
                fetched: true,
                failed: false
            }
        break

        case types.GET_PROJECT_LIST+'_REJECTED':
            return {
                ...state,
                 
                projectOptions:action.payload,
                zipCodes: [],
                fetching: false,
                fetched: false,
                failed: true
            }
        break



        // UPDATE ENTERPRISE-ID
        case types.SELECTED_ENTERPRISE :
            return {
                ...state,
                selectedEnterprise:action.enterpriseId,
                selectedCompany:'',
                selectedProject:''
            }
        break

        // UPDATE COMPANY-ID
        case types.SELECTED_COMPANY :
            return {
                ...state,
                selectedCompany:action.companyId,
                selectedProject:''
            }
        break

        // UPDATE PROJECT-ID
        case types.SELECTED_PROJECT :
            return {
                ...state,
                selectedProject:action.projectId
            }
        break

        default:
            return state;
    }
}

export default FilterReducer