/**
 * Created by Msupply on 13 Aug 2018
 */
import axios from 'axios'
import Auth from '../Auth'
import { SERVER_ADDRESS } from '../../constants'

let configHeader= ()=> {
    let token = Auth.getToken();
    let authString = 'bearer ' + token;
    return  {
        headers: {
            'Authorization': authString
        }
    }
}


const utils={
    tryLogin: (authData)=>{
        let url= SERVER_ADDRESS + '/api/student/addBulkStudent'
        let config=configHeader()
        return axios.post(url,authData,config)
    },
    
}
export default utils
