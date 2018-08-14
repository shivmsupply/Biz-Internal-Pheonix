import React,{ Component } from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

class ScanQr extends Component{
    constructor(props){
       super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleBack = this.handleBack.bind(this); 
    }
    
    handleSubmit(e){
        if(e !== undefined)e.preventDefault();
        this.props.history.push('/enterOtp')
    }

    handleBack(e){
        if(e !== undefined)e.preventDefault();
        this.props.history.push('/changeNewPassword')
    }

    render(){
        console.log("reducer ==============>", this.props)
        return(
            <div className="loginICont">
                <div className="mar-top-20 msLoginBlock">
	              <div className="captionLogin">Scan QR</div>
	              
	                <form onSubmit={this.handleSubmit} noValidate>
		            
		                    <div className="msFormGroup">
                                <img 
                                    src={this.props.LoginReducer.loginInfo.message.qrURL? this.props.LoginReducer.loginInfo.message.qrURL: null}             	
		                        />
		                    </div>
		                  
		                    <div className="msFormGroup msGroupBtn">
                                 <button 
                                    type="submit" 
                                    className="msBtn"
                                >
                                    Next
                                </button>
		                   	</div>
		            </form> 
	            </div>
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        LoginReducer: state.LoginReducer
    }
}

export default withRouter(connect(mapStateToProps)(ScanQr))