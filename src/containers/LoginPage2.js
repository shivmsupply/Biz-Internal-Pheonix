import React,{Component} from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import $http from '../utils/Http';
import Loading from '../common/Loading/Loading';
import ENV_VARIABLE from '../utils/Environment';
import { Button,Text } from '../common/FormElements/FormElements';
import Modal from '../common/Modal/Modal';
import { loginInfo } from '../actions/LoginActions'
import '../assets/styles/style.css';

function newState(){
	this.data = {
      userName:'',
      password:''
   };

	  this.errors ={
       userName:'required',
       password:'required'
    };
    this.userData = {
        user:''
    }
    this.forgoteErrors={
        user:'required'
    }
    this.formSubmitted = false;
    this.otpPop=false;
    this.forgotPass=false;
    this.forgotPassWd = false;
    this.invalidPassword=false;
    this.forgoteSubmitted=false;
    this.invalidUser=false;
}
class Login extends Component{
    constructor(props){
       super(props);
       this.state = new newState();	 
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit=this.handleSubmit.bind(this);
       this.forgotPassWrd = this.forgotPassWrd.bind(this);
       this.handleforgotePass=this.handleforgotePass.bind(this);
    }
    
    handleChange(e,data){
        
        var submitData = this.state.data;
		    submitData[e.target.name] = data.data;
        this.setState({data:submitData});
        
		    var submitErrors = this.state.errors;
		    submitErrors[e.target.name] = data.error;
        this.setState({errors:submitErrors});
        // 
        // var userDataFrg = this.state.userData;
		// userDataFrg[e.target.name] = data.userData;
        // this.setState({data:forgotPassData})
        
    }
    handleforgotePass(e,userData){

        var submitData = this.state.userData;
		submitData[e.target.name] = userData.data;
        this.setState({data:submitData});
        
		var submitErrors = this.state.forgoteErrors;
		submitErrors[e.target.name] = userData.error;
        this.setState({errors:submitErrors});
        
    }
    // redirectionForEro(){
    //     debugger;
    //     this.props.history.push('ero/my-actions');
    // }
    handleSubmit(e){
        debugger;
        if(e !== undefined)e.preventDefault();
       // this.getInterprise()
         this.setState({formSubmitted:true});
             if(Object.keys(this.state.errors).filter((key)=>{if(this.state.errors[key]!=''&&(key === 'mobileNo'||key === 'password'))return 1;else return 0;}).length !==0 )
             return;
             this.setState({isLoading : true});
             $http.postWithUrl(ENV_VARIABLE.HOST_NAME+'phoenix/user/login',JSON.stringify({
                 userName:this.state.data.userName,
                 password:this.state.data.password
            }),(res)=>{
                //console.log("code 2 ================>",res.http_code);
                 this.setState({isLoading : false});
                 if(res.http_code === 401){
                    //console.log("code 3==============>",res.http_code);
                    this.setState({invalidPassword:true}); 
                    this.setState({userNotActive:false});
                    this.props.history.push('/');
                    
                   return
                 }
                 if(res.http_code == 403){
                    this.setState({userNotActive:true});
                    this.setState({invalidPassword:false}); 
                 }
                 if(res.message.firstLogin){

                    this.setState({
                        userResponse: res
                    })


                    if(this.state.userResponse.message){
                        this.props.loginInfo(this.state.userResponse)
                        this.props.history.push('/CreateNewPassword')
                     }
                }
                else{
                    this.setState({
                        userResponse: res
                    })
                    
                    this.props.loginInfo(this.state.userResponse)
                    
                    this.props.history.push('/enterOtp')

                }
            }	
               
            )
        }
   
    forgotPassword(){        
        this.setState({loginModal: false}); 
        this.setState({forgotPassWd:true});       
      }
      forgotPassWrd(e){
          
          if(e !== undefined)e.preventDefault();
          this.setState({isLoading : true,forgoteSubmitted:true});
          var errordata = Object.keys(this.state.forgoteErrors).filter(k => {
            return this.state.forgoteErrors[k].length > 0;
          });
          if (errordata.length > 0) return true;
          if(this.state.userData.length==0)return;
          $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'census/user/forgotpassword/'+this.state.userData.user,JSON.stringify({
                }),(res)=>{
                     this.setState({isLoading : false});
                     if(res.http_code == 401){
                       return;
                     }
                 if(res.http_code == 200){
                   this.setState({forgotPass:true});
                   this.setState({forgotPassWd:false});
                   this.setState({invalidUser:false});  
                    }
                    if(res.http_code == 400){
                        this.setState({invalidUser:true});
                    }	
                })
      }
    render(){
        return(
          <div className="loginICont">
           
            <div className="mar-top-20 msLoginBlock">
              <div className="captionLogin">Internal PR2Pay Login</div>
              {this.state.isLoading?<Loading />:null}
                <form onSubmit={this.handleSubmit} noValidate>
	            
	                    <div className="msFormGroup">
	                        <Text 
                            type="email"
	                        	labelWidth="0" 
	                        	placeholder="Login with your User Name or E-mail *"  
	                        	name="userName" 
                            value={this.state.data.userName} 
	                        	change={this.handleChange} 
                            
	                        	errorMessage={this.state.errors.userName}
	                        	className="inputControl"
	                        	submitted={this.state.formSubmitted} 
	                        />
	                    </div>
	                    <div className="msFormGroup">
	                    	<Text 
	                    		type="password" 
	                    		labelWidth="0" 
	                    		placeholder="Password *" 
	                    		name="password" 
	                    		validation="password" 
	                    		value={this.state.data.password} 
	                    		change={this.handleChange} 
	                    		errorMessage={this.state.errors.password}
	                    		className="inputControl"
	                    		submitted={this.state.formSubmitted}
	                    	/>
	                   	</div>
	                     {this.state.invalidPassword===true?<p className="error mar-top-2">Invalid username or password</p>:null}
	                     {this.state.userNotActive===true?<p className="error mar-top-2">User is not active</p>:null}
	                    <div className="msFormGroup msGroupBtn">
	                         <button type="submit" className="msBtn">Login</button>
	                   	</div>
	               </form> 
            </div>
          
            <Modal  height="160px" header="Forgot Password"
              isOpen={this.state.forgotPassWd}
              onClose={()=>{this.setState({forgotPassWd:false});this.props.closeModal();}}
              backDropClose={true}
              crossBtn={true}
            >
              <form onSubmit={this.forgotPassWrd} noValidate>
                  <ul>
                      <li className="companyName">
                          <Text 
                            labelWidth="0" placeholder="Enter User Name or E-mail *"  
                            name="user" 
                            value={this.state.userData.user}
                            handleChange={this.handleforgotePass} 
                            validation="name"
                            errorMessage={this.state.forgoteErrors.user} 
                            submitted={this.state.forgoteSubmitted} 
                          />
                              {this.state.invalidUser===true?<p className="error mar-top-2">Invalid username</p>:null}
                              <button className="login-btn mar-top-10">Submit</button>
                      </li>
                  </ul>
                 
              </form>
            </Modal>

            <Modal  height="135px" header="Success"
              isOpen={this.state.forgotPass}
              onClose={()=>{this.setState({forgotPass:false});this.props.closeModal();}}
              backDropClose={true}
              crossBtn={true}
            >
              <p>Password has been reset</p>
              <p>New Password been sent to registered email</p>              
            </Modal>
          
          </div>
          
        )
    }
}

const mapStateToProps = (state) => {
  return {
    isLogin:state.storeSession.isLogin,
    loginReducer:state.loginReducer
  }
}
  
const mapDispatchToProps = (dispatch) => {
  return {
    loginInfo: (data) =>{
        dispatch(loginInfo(data))
    },
     storeSession: (isLogin,loginDetail) => dispatch(commonActions.storeSession(isLogin,loginDetail)),
     storeCurrentCompanyDetail: (companyId,companyDetail) => dispatch(commonActions.storeCurrentCompanyDetail(companyId,companyDetail)),
   }
}
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
