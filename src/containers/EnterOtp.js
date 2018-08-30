import React,{Component} from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import $http from '../utils/Http';
import ENV_VARIABLE from '../utils/Environment';
import { Text } from '../common/FormElements/FormElements';
// import CompaniesSelection from '../components/CompaniesSelection/CompaniesSelection';
import {resetFirstLogin, storeSession, storeEnterpriseAndCompany} from '../actions/LoginActions'
import '../assets/styles/style.css';
import {getEnterprices} from '../actions/FilterActions' 
const errorMsg = {
    color:'red'
  };


class EnterOtp extends Component{
    
    constructor(props){
		debugger;
        super(props);
        this.state={
            otp:'',
            otpError:'required',    
            formSubmitted:false,
            selectEnterprise:false,
            otpWrong:false,
            instructionPupup:false
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.getInterprise=this.getInterprise.bind(this);
        // this.storeEnterprise=this.storeEnterprise.bind(this);
        console.log('works!!!!!!!!!!!!');

  }

  handleChange=(e,d)=>{
      
    this.setState({otpWrong:false});
     let _temp=this.state;
     _temp[e.target.name]=d.data;
     _temp['otpError']=d.error;
     this.setState(_temp);
  }

  handleSubmit=(e)=>{
     
    if(e !== undefined)e.preventDefault();
    let jsonBody;
    let passInfo = this.props.LoginReducer.loginInfo.message.firstLogin;
    let endPoint;
    console.log("login detail", this.props.LoginReducer)
    if(passInfo){
        this.setState({
            instructionPupup: true
        })
        jsonBody ={
            newPassword: this.props.LoginReducer.pwdChangeDetail.newPassword,
            oldPassword: this.props.LoginReducer.pwdChangeDetail.oldPassword,
            otp:this.state.otp

        }
        endPoint = 'phoenix/user/2FA-setup'
    }
    else{
        jsonBody ={
            otp:this.state.otp,

        }
        endPoint = 'phoenix/user/2FA'
    }
    this.setState({formSubmitted:true});
    this.setState({otpWrong:false})
     if(this.state.otpError !='')return;

    $http.postWithUrl(ENV_VARIABLE.HOST_NAME+endPoint,JSON.stringify(jsonBody),(res)=>{
       
          
          if(res.http_code == 200){
            window.localStorage._isL=true;
            this.props.storeSession(true,res.message);
            console.log(this.props.storeSession);
            this.props.getEnterprices();
            this.props.resetFirstLogin()
            debugger
            this.props.history.push('/view-enquiries');
            // if(passInfo){
            //     this.props.history.push('/')
            // }
          }
          if(res.http_code == 403){
            this.setState({otpWrong:true})
          }
    });
  }

  EnterPrise;
  getInterprise(){
      $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/',(res)=>{
          console.log(res.message);
          this.EnterPrise=res.message;
      }) 
  }

//   storeEnterprise=(_eL,_cL,_sE,_sC)=>{
//     //   this.props.storeEnterpriseAndCompany(_eL,_cL,_sE,_sC)
// //    const { dispatch } = this.props;
// //    dispatch(commonActions.storeEnterpriseAndCompany(_eL,_cL,_sE,_sC));    
//    this.setState({selectEnterprise:false});

// //    this.props.history.push('/list-po/'+_sE+'/'+_sC);
//    this.props.history.push('/view-enquiries');

// //    debugger
//   }

   
    render(){
       // console.log("WHAT WE GET IN OTP ==========>", this.props.LoginReducer)
        return(
        <div className="loginICont">
            {/* {this.state.selectEnterprise?<CompaniesSelection allEnterprise={this.EnterPrise} storeEnterprise={this.storeEnterprise}/>:null}  */}
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
                    <div className="captionLogin">Enter OTP</div>
                        <form onSubmit={this.handleSubmit} noValidate>
                            <div className="msFormGroup">
                                <Text 
                                    labelWidth="0" 
                                    placeholder="Enter Otp *"  
                                    name="otp" 
                                    className="inputControl"
                                    value={this.state.otp}
                                    validation="otp"
                                    change={this.handleChange}
                                    errorMessage={this.state.otpError}
                                    submitted={this.state.formSubmitted}
                                />
                            </div>
                            {this.state.otpWrong==true?<p style={errorMsg}>Please enter the correct OTP</p>:null}
                            <div className="msFormGroup msGroupBtn">
                                    <button type="submit"  className="msBtn">Submit</button>
                            </div>
                        </form> 
                    </div>
                    
                    {this.state.instructionPupup?
                        ( 
                        <div className="popPupVideo">
                            <iframe width="250" height="150" src="https://www.youtube.com/embed/tgbNymZ7vqY">
                            </iframe>
                        </div>
                        ):null
                    } 
                
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    return{
        LoginReducer:state.LoginReducer,
        FilterReducer:state.FilterReducer
    }
}

const mapDispatchToProps = (dispatch) =>{
    return{
        resetFirstLogin: () =>{
            dispatch(resetFirstLogin())
        },
        storeSession:(flag,response)=>{
            dispatch(storeSession(flag, response))
        },
        // storeEnterpriseAndCompany:(_eL,_cL,_sE,_sC)=>{
        //     dispatch(storeEnterpriseAndCompany(_eL,_cL,_sE,_sC))
        // },
        getEnterprices:() =>{
            dispatch(getEnterprices())
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EnterOtp));




