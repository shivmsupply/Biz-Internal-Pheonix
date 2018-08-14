import * as types from "../constants/";
const initialState={
 isLogin:'',
 loginDetail:''

}
const storeSession=(state= initialState,action)=>{
  
  switch (action.type) {
   case types.SESSION_INFO:
     return {
       ...state,
       isLogin: action.isLogin,
       loginDetail: action.loginDetail
     }
   default:
     return state
 }
}
export default storeSession;