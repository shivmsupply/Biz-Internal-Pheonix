import * as types from "../constants/";
const initialState={
    stateInfo:'',
    breadCrumbs:[],
    isDetail:''
}
const storeInfo=(state= initialState,action)=>{
  
  switch (action.type) {
   case types.GET_State:
     return {
       ...state,
       stateInfo:action.stateInfo
      }
   case types.BREADCRUMB:
      return {
        ...state,
        breadCrumbs:action.breadCrumbs,
        isDetail:action.isDetail
       }   
   default:
     return state
 }
}
export default storeInfo;