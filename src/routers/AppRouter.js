// IMPORT PACKAGE REFERENCES
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


// IMPORT PROJECT REFERENCES
import * as commonActions from "../actions/LoginActions";
import * as CommonApi  from '../common/CommonApi/commonApi';


import Header  from '../components/Header/Header';
import Footer  from '../components/Footer/Footer.js';
import FilterList  from '../components/FilterList/FilterList.js';
import LeftPanel  from '../components/LeftPanel/Left-Panel';
import HomePage  from '../containers/HomePage';
import LoginPage2  from '../containers/LoginPage2';
import CreateNewPassword from '../containers/CreateNewPassword';
import LoginPage  from '../containers/LoginPage';

import ViewPO from "../containers/ViewPo";
import PODetail from "../containers/PODetail";

import EnterOtp from "../containers/EnterOtp"
import ScanQr from "../containers/ScanQr"
import ViewEnquiry from "../containers/ViewEnquiry";
import EnquiryDetails from "../containers/EnquiryDetails";
import SelectSupplier from '../containers/SelectSupplier';

// COMPONENT

 class AppRouter extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        // if(window.localStorage._isL)this.props.storeSession(true,'');
        
        CommonApi.getSession()
          .then((res)=>{
              window.localStorage._isL=true;
              this.props.storeSession(true,res);
              return res
        })
        .then(()=>{
            return CommonApi.getEnterpriseList()
        }).then((res)=>{
                this.enterpriseDetail['enterpriseLIst']=res
        }).then(()=>{
            return CommonApi.getCompanyList(window.location.pathname.split('/')[2])
        }).then((res)=>{
            let _e=this.enterpriseDetail.enterpriseLIst.message.map(o=>{
                return {label:o.enterpriseName,value:o.id}
             })
             let _c=res.message.map(o=>{
                return {label:o.companyName,value:o.id}
             })
            let  _selectedEnterpriseId=window.location.pathname.split('/')[2];
            let  _selectedCompanyId=window.location.pathname.split('/')[3]
            console.log('enterpriseDetail-->',_e,_c);
            this.props.storeEnterpriseAndCompany(_e,_c,_selectedEnterpriseId,_selectedCompanyId)
        })
        .catch(res=>{
            
    
        })
    
        }

    render(){
        // console.log('dddd',this.props.isLogin);
        return (
        <Router>
        <Fragment> 

            
            {this.props.isLogin?<LeftPanel /> :null}

                <div className="mainContent">
                <Header />
           <FilterList />
                    <Switch>
                        {/* <Route exact strict path='/' component={HomePage} /> */}
                        <Route path='/enterOtp' component={EnterOtp}/>
                        <Route path='/login' component={LoginPage} />
                        <Route exact path='/' component={LoginPage2} />
                        <Route path="/scanQr" component={ScanQr}/> 
                        <Route path="/view-enquiries/:enterpriseId?/:companyId?" component={ViewEnquiry}/> 
                        <Route path="/detail-enquiries/:enterpriseId/:companyId/:projectId/:enquiryId" component={EnquiryDetails} />
                        <Route path = '/select-supplier/:enterpriseID?/:companyId?/:projectId?/:enquiryId?/' component={SelectSupplier} />
                        <Route path="/createNewPassword" component={CreateNewPassword}/>
                        
                        <Route path = '/list-po/:enterpriseID?/:companyId?' component={ViewPO} />
                        
                        <Route path = '/view-po/:enterpriseID?/:companyId?/:projectId/:poId/:amendmentNumber' component={PODetail} />
                        <Route component={HomePage} />
                    </Switch>
                </div>
           <Footer />
        </Fragment>
    </Router>
        )
    }
    
    }

    const mapStateToProps = state => {
	
        return {
            isLogin:state.storeSession.isLogin,
            loginDetail:state.storeSession.loginDetail,
            breadCrumbs:state.storeState.breadCrumbs,
            selectedInfo:state.companyDetailReducer
    
         }
    }
    
    const mapDispatchToProps = (dispatch) => {
        
      return {
         storeSession: (isLogin,loginDetail) => dispatch(commonActions.storeSession(isLogin,loginDetail)),
         storeEnterpriseAndCompany: (enterpriseList,companyList,selectedEnterpriseId,selectedCompanyId) => dispatch(commonActions.storeEnterpriseAndCompany(enterpriseList,companyList,selectedEnterpriseId,selectedCompanyId)),
        }
    }
    export default connect(mapStateToProps,mapDispatchToProps)(AppRouter);



	  

