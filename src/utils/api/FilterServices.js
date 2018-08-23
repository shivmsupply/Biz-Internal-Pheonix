/**
 * Created by Msupply on 21st Aug 2018
 */
import http from '../Http';
import ENV_VARIABLE from '../Environment';

// let configHeader= ()=> {
//     let token = Auth.getToken();
//     let authString = 'bearer ' + token;
//     return  {
//         headers: {
//             'Authorization': authString
//         }
//     }
// }


const utils={
    getEnterpriceList: (data)=>{
        let url= ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/';
        return new Promise(function(resolve, reject) {http.getWithUrl(url,res=>{
            resolve(res);
        })})
    },
    getCompanyList: (_eID)=>{
        let url= ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/'+_eID+'/company'
        return new Promise(function(resolve, reject) {
            http.getWithUrl(url,res=>{
            resolve(res);
        })})
    },
    getProjectList: (_eID,_cID)=>{
        let url= ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/'+_eID+'/company/'+_cID+'/project'
        return new Promise(function(resolve, reject) {
            http.getWithUrl(url,res=>{
            resolve(res);
        })})
    },
    
}

export default utils
