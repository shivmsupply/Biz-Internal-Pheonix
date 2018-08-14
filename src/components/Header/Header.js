import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
// import Scroll from '../../Util/Scroll';
// import styles from './header.css';
import ENV_VARIABLE from '../../utils/Environment';
import logoImg from '../../assets/images/BIZ_logo.png';
// import Login from '../Login/Login';
// import ScheduleADemo from '../ScheduleADemo/ScheduleADemo';
// import * as commonActions from "../../actions/commonActions";
// import CompaniesSelection from '../CompaniesSelection/CompaniesSelection';
// import * as CommonApi  from '../CommonApi/commonApi';

class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            loginModal:false,
            sheduleaDemoModal:false,
            logoutModal: false,
            companyModal:false
        }
        // console.log(ENV_VARIABLE)
       
        // this.logOut=this.logOut.bind(this);
        // this.toPrtoPay = this.toPrtoPay.bind(this);
        // this.getLoginInfo=this.getLoginInfo.bind(this);
        // this.storeCompany=this.storeCompany.bind(this)
     }
   
    // onListClick(e){
    //       if(e.target.value !== 4){
    //     setTimeout(function(){
    //       Scroll.scroll(location.hash.substring(1,location.hash.length));
    //     }, 100);
    //   }
    // }

    // onLogout(e) {
    //   $http.putWithUrl(
    //     ENV_VARIABLE.HOST_NAME + "census/user/logout","",
    //     (response) => {
         
    //       if (response.http_code == 200) {
    //         this.props.storeSession(false, response.message);
    //         this.props.history.push("/");
    //       }
    //     }
    //   );
    // }

  // logOut =()=>{
  //  CommonApi.userLogout().then(res=>{
  //   window.localStorage.removeItem('_isL');
  //     this.props.onLogout();
  //     this.props.history.push('/')
  //     window.location.reload();
  //   }).catch(res=>{
  //     console.log(res);
  //   })
  // }


  //   toPrtoPay(e) {
  //     if(this.props.companyID !== 'ero'){
  //     this.setState({companyModal:true});
  //   }else{
  //     this.props.history.push('pr2pay/ero/my-actions');
  //     this.props.isPr2Pay();
  //   }
  //   }
  //   getLoginInfo(flag,detail){
  //     this.setState({loginModal:false});
  //     this.props.storeSession(true,detail);
  //     if(detail.isEnterpriseUser == true){
  //       this.props.storeCurrentCompanyDetail('ero','ERO User','READ-ONLY');
  //       this.props.history.push('pr2pay/ero');
  //       this.props.isPr2Pay();
  //     }else
  //     this.setState({companyModal:true});
  //   }
  //   storeCompany(companyId,companyDetail){
  //     this.props.storeCurrentCompanyDetail(companyId,this.props.loginDetail.authorizations[companyId],companyDetail)
  //     this.props.history.push('/pr2pay/'+companyId+'/my-actions');
  //     this.props.getAllState()
  //     this.props.isPr2Pay();
  //  }

    render(){
        return(
            <div>
                <ul className='header'>
                    <li><a><img className='bizLogo' src={logoImg} alt="BizLogo"/></a></li>
                    <li className='pr2paytextCenter'>
                    <h2 className="pr2pay mar0">PR<span className='text2 mar0'>2</span>PAY Phoenix</h2>
                    <p className="text2 mar0">Internal Panel</p>
                    </li>
                   <li>&nbsp; </li>
                </ul>              
                {/* {this.state.loginModal?<Login loginSucess={this.getLoginInfo} closeModal={()=>{this.setState({loginModal:false})}}/>:null}
                {this.state.companyModal?<CompaniesSelection storeCompany={this.storeCompany} companyInfo={this.props.loginDetail} closeModal={()=>{this.setState({companyModal:false})}}/>:null}    
                {this.state.sheduleaDemoModal?<ScheduleADemo closeModal={()=>{this.setState({sheduleaDemoModal:false})}}/>:null}     */}
          </div>

           

            
        );
    }
}

const mapStateToProps = state => {
  return {
    // isLogin:state.storeSession.isLogin,
    // loginDetail:state.storeSession.loginDetail,
    // companyID: state.companyDetailReducer.companyId
  	}
}

const mapDispatchToProps = (dispatch) => {
	
  return {
	//  storeSession: (isLogin,loginDetail) => dispatch(commonActions.storeSession(isLogin,loginDetail)),
	//  storeState:(s)=>dispatch(commonActions.storeState(s)),
  //  storeCurrentCompanyDetail: (companyId,companyDetail,privileges) => dispatch(commonActions.storeCurrentCompanyDetail(companyId,companyDetail,privileges)),

   }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Header));