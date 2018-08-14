import React,{ Component } from 'react';
import  './footer.css'
class Footer extends Component{
    render(){
       
        return(
            <ul className="footer">
            <li>
                <p >mSupply Commerce India Pvt. Ltd.</p>
                <p>The Pearl, 157-160, 5th Main, Sector 7, HSR Layout,</p>
                <p>Bengaluru - 560102</p>
                {/* <p>2018-19 mSupply.com. All rights reserved.    </p> */}
             </li>   
            </ul>
        )
    }
}
export default Footer;
