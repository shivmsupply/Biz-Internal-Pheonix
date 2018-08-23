import React,{ Component } from 'react';
import '../assets/styles/style.css';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';

class ScanQr extends Component{
    constructor(props){
       super(props);
        this.state ={
            qrl: "",
            instructionPupup:false
        }

        if(!(Object.keys(this.props.LoginReducer.loginInfo).length === 0 && this.props.LoginReducer.loginInfo.constructor === Object)){
			this.setState({
                instructionPupup: this.props.LoginReducer.loginInfo.message.firstLogin,
                qrl: this.props.LoginReducer.loginInfo.message.qrURL,
			})
        }
        else{
            this.setState({
                qrl: ""
            })
            this.props.history.push('/')
        }
      

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
        //console.log("reducer ==============>", this.props)
        return(
            <div className="loginICont">
                <div className="wrap-logincontainer">

                    {this.state.instructionPupup?
                        (<div className="Google-Auth-logo">
                            <div className="authG-img">
                                <img src={require('../assets/images/google-authenticator.svg')}/>
                            </div>
                            <div className="gText">
                                <h3>Google Authenticator</h3>
                            </div>
                            <div className="gLoader">
                                <img src={require('../assets/images/loader-three.png')}/>
                            </div>
                        </div>):null
                    } 

                    <div className="mar-top-20 msLoginBlock">
                        <div className="captionLogin">Scan QR</div>
                    
                        <form onSubmit={this.handleSubmit} noValidate>
                        
                                <div className="msFormGroup">
                                    <img src={this.state.qrl? this.state.qrl: null} />
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
                    
                    {this.state.instructionPupup?
                        (<div className="popPupVideo">
                            <iframe width="250" height="150" src="https://www.youtube.com/embed/tgbNymZ7vqY">
                            </iframe>
                        </div>):null
                   	} 

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