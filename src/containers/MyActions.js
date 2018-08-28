import React, { Component } from "react";
// import Loading from '../Loading/Loading';
// import * as commonActions from "../../actions/commonActions";
import ENV_VARIABLE from "../utils/Environment";
import $http from '../utils/Http';
import { Text, Checkbox } from "../common/FormElements/FormElements";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Modal from '../common/Modal/Modal';
import  "../assets/styles/components/myactions.css";
function newState() {
  this.data = {
    firstName: "",
    lastName: "",
    email:"",
    phoneNumber:""
  }
  this.errors = {
    firstName: "required",
    lastName: "required",
    email: "required",
    phoneNumber:"required"
    
  };
  this.formSubmitted = false;
  this.usercreate=false;
  this.userExit=false;
}

class MyActions extends Component {
  constructor(props) {
    super(props);
    this.state = new newState();
    // let _breadCrumb=[{displayName:''},
    // {displayName:'View Purchase Orders',navigation:'list-po'},
    // ]
    //  const { dispatch } = this.props;
    // dispatch(commonActions.setBreadCrumb([],false));
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeUser=this.closeUser.bind(this);
    
  }
 
  handleChange(e, data) {
    var submitData = this.state.data;
    submitData[e.target.name] = data.data;
    this.setState({ data: submitData });
    var submitErrors = this.state.errors;
    submitErrors[e.target.name] = data.error;
    this.setState({ errors: submitErrors });
  }
  closeUser(){
    this.setState({usercreate:false});
    window.location.reload();
  }
  handleSubmit(e) {
    if(e !== undefined)e.preventDefault();
         this.setState({formSubmitted:true});
             if(Object.keys(this.state.errors).filter((key)=>{if(this.state.errors[key]!='')return 1;else return 0;}).length !==0 )
             return;
             this.setState({isLoading : true});
             $http.postWithUrl(ENV_VARIABLE.HOST_NAME+'phoenix/user',JSON.stringify({
              firstName:this.state.data.firstName,
              lastName:this.state.data.lastName,
              email:this.state.data.email,
              mobile:this.state.data.phoneNumber,
              phoenixAdmin: false,
              userRoles: ["2"],
              isSmartPhoneUser: true
            }),(res)=>{
                 this.setState({isLoading : false});
                 if(res.http_code==403){
                 }
                 if(res.http_code==400){
                   this.setState({userExit:true});
                }
                 if(res.http_code == 401){
                   return
                 }
             if(res.http_code == 200){
               this.setState({usercreate:true});
                }	
            })
  }
  render() {
    return (
      <div className={styles.myActions}>
      <form onSubmit={this.handleSubmit} noValidate>
          <ul className={styles.myAccounts}>
            <li className={styles.profileImg}>
              <img className={styles.profilelogo} src={ENV_VARIABLE.IMAGE_URL+"No_Image_02.png"} alt="profile_logo"/>
            </li>
            <li className={styles["margin-li"] + " " + styles["wid-265"]}>
             <div>
                <Text
                  className={styles["wid-240"] + " " + styles["pad-top-10"]}
                  name="firstName"
                  label="First Name"
                  value={this.state.data.firstName}
                  change={this.handleChange}
                  submitted={this.state.formSubmitted}
                  validation="name"
                  errorMessage={this.state.errors.firstName}
                />
              </div>
              
                <div>
                  <div className={styles["mar-top-15"]}>
                    <Text
                      name="email"
                      label="Email Id"
                      value={this.state.data.email}
                      change={this.handleChange}
                      validation="email"
                      errorMessage={this.state.errors.email}
                      submitted={this.state.formSubmitted}
                    />
                  </div>
                </div>
              
     
            </li>
            <li className={styles["mar-10"]}>
             <div>
                <Text
                  name="lastName"
                  label="Last Name"
                  value={this.state.data.lastName}
                  change={this.handleChange}
                  submitted={this.state.formSubmitted}
                  validation="name"
                  errorMessage={this.state.errors.lastName}
                />
              </div>
             
                <div className={styles["mar-top-15"]}>
                  <Text
                    name="phoneNumber"
                    label="Phone Number"
                    value={this.state.data.phoneNumber}
                    change={this.handleChange}
                    validation="mobile"
                    submitted={this.state.formSubmitted}
                    errorMessage={this.state.errors.phoneNumber}
                  />
                </div>
            
            </li>
           
          </ul>
          <div className={styles.errorexist+' '+styles['margin-top-30']}>
          {this.state.userExit===true?<p className={styles.existerror}>A user already exist with the provided email id or contact details </p>:null}
            <button className={styles.saveChange} type="submit">
              Create User
            </button>
          </div>
         
          </form>
          <Modal  height="135px" header="Success"
               isOpen={this.state.usercreate}
                 onClose={()=>{this.setState({usercreate:false});this.props.closeModal();}}
                 backDropClose={true}
                 crossBtn={true}>
                 <p>User created successfully</p>
                 <button
            className={styles.okbtn}
            onClick={() => this.closeUser()}
          >
            OK
          </button>              
          </Modal>
      </div>
    );
  }
}
const mapStateToProps = state => {
  
  return {
    isLogin: state.storeSession.isLogin,
    loginDetail: state.storeSession.loginDetail,
    allState: state.storeState.stateInfo,
    currentCompanyDetails:state.companyDetailReducer,
    companyID: state.companyDetailReducer.companyId
  };
};

export default withRouter(connect(mapStateToProps)(MyActions));
