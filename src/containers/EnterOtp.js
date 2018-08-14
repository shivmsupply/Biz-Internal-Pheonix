
import React,{Component} from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import $http from '../utils/Http';
import ENV_VARIABLE from '../utils/Environment';
import { Text } from '../common/FormElements/FormElements';
import CompaniesSelection from '../components/CompaniesSelection/CompaniesSelection';
import {resetFirstLogin} from '../actions/LoginActions'

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
            otpWrong:false
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.getInterprise=this.getInterprise.bind(this);
        this.storeEnterprise=this.storeEnterprise.bind(this);

  }

  handleChange=(e,d)=>{
      debugger;
    this.setState({otpWrong:false});
     let _temp=this.state;
     _temp[e.target.name]=d.data;
     _temp['otpError']=d.error;
     this.setState(_temp);
  }

  handleSubmit=(e)=>{
      debugger;
    if(e !== undefined)e.preventDefault();
    let jsonBody;
    let passInfo = this.props.loginReducer.loginInfo.message.firstLogin;
    let endPoint;
    console.log("login detail", this.props.loginReducer)
    if(passInfo){

        jsonBody ={
            newPassword: this.props.loginReducer.pwdChangeDetail.newPassword,
            oldPassword: this.props.loginReducer.pwdChangeDetail.oldPassword,
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
       
          debugger
          if(res.http_code == 200){
            window.localStorage._isL=true;
            // const {dispatch}=this.props;
            // dispatch();
            this.props.storeSession(true,res.message);
            console.log(this.props.storeSession);
            this.getInterprise();
            this.props.resetFirstLogin()
            
            if(passInfo){
                //For First time login REDIRECT here
                this.props.history.push('/')
            }
            
            else{
                //for rest of time login REDIRECT here
            }
            
            
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
          this.setState({selectEnterprise:true});
          
      }) 
  }

  storeEnterprise=(_eL,_cL,_sE,_sC)=>{
      this.props.storeEnterpriseAndCompany(_eL,_cL,_sE,_sC)
//    const { dispatch } = this.props;
//    dispatch(commonActions.storeEnterpriseAndCompany(_eL,_cL,_sE,_sC));    
   this.setState({selectEnterprise:false});
   this.props.history.push('/view-enquiries/'+_sE+'/'+_sC);
   debugger
  }

   
    render(){

        return(
            <div className="loginICont">
              {this.state.selectEnterprise?<CompaniesSelection allEnterprise={this.EnterPrise} storeEnterprise={this.storeEnterprise}/>:null} 
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
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    return{
        loginReducer:state.loginReducer
    }
}


const mapDispatchToProps = (dispatch) =>{
    return{
        resetFirstLogin: () =>{
            dispatch(resetFirstLogin())
        },
        storeSession:(flag,response)=>{
            dispatch(commonActions.storeSession(flag, response))
        },
        storeEnterpriseAndCompany:(_eL,_cL,_sE,_sC)=>{
            dispatch(commonActions.storeEnterpriseAndCompany(_eL,_cL,_sE,_sC))
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EnterOtp));



