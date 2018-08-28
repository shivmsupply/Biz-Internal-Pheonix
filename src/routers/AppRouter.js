// IMPORT PACKAGE REFERENCES
import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {getEnterprices,updateEnterpriseId,updateCompanyId,updateProjectId,getCompany,getProject} from '../actions/FilterActions' 

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
import ViewShipmentDetail from '../components/Shipment/ViewShipmentDetail'
import ViewShipment from '../components/Shipment/ViewShipment';
import Grn from '../components/Shipment/Grn';
import MyAction from '../containers/MyActions'

// COMPONENT

 class AppRouter extends Component {
    constructor(props){
        super(props);
        var _ur=window.location.pathname.split('/');
        this.urlEnterpriseId=_ur[2]?_ur[2]:'';
        this.urlCompanyId=_ur[3]?_ur[3]:'';
        this.urlProjectId=_ur[4]?_ur[4]:'';
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
            if(this.urlEnterpriseId){
            this.props.updateEnterpriseId(this.urlEnterpriseId);
            this.props.getCompany(this.urlEnterpriseId)
        }
            this.props.getEnterprices();
        }).then(()=>{
            if(this.urlCompanyId){
              this.props.updateCompanyId(this.urlCompanyId)
              this.props.getProject(this.urlEnterpriseId,this.urlCompanyId)
            }
        }).then(()=>{
            if(this.urlProjectId){
                this.props.updateProjectId(this.urlProjectId)
            }
        }).catch(err=>{
            console.log(err,">>>>>>>>>>>>>error")
    
        })
    
        }
  
    render(){
       
        return (
            <Router>
            <Fragment> 

            
              {this.props.isLogin?<LeftPanel /> :null}

                <div className="mainContent">
                <Header />
                {this.props.isLogin&&this.props.showHeaderFilter?<FilterList  />:null}
                    <Switch>
                        {/* <Route exact strict path='/' component={HomePage} /> */}
                        <Route path='/enterOtp' component={EnterOtp}/>
                        <Route path='/login' component={LoginPage} />
                        <Route exact path='/' component={LoginPage2} />
                        <Route path="/scanQr" component={ScanQr}/> 
                        <Route path="/view-enquiries/:enterpriseId?/:companyId?/:projectId?" component={ViewEnquiry}/> 
                        <Route path="/detail-enquiries/:enterpriseId/:companyId/:projectId/:enquiryId" component={EnquiryDetails} />
                        <Route path = '/select-supplier/:enterpriseID?/:companyId?/:projectId?/:enquiryId?/' component={SelectSupplier} />
                        <Route path="/createNewPassword" component={CreateNewPassword}/>
                        
                        <Route path = '/list-po/:enterpriseID?/:companyId?/:projectId?/' component={ViewPO} />
                        <Route path = '/shipment/:enterpriseId?/:companyId?/:projectId?/' component={ViewShipment} />
                        <Route path = '/view-po/:enterpriseID?/:companyId?/:projectId?/:poId/:amendmentNumber' component={PODetail} />
                        <Route path = '/shipment-detail/:enterpriseId?/:companyId?/:projectId?/:ShipmentCompanyId?/:shipmentId?' component={ViewShipmentDetail} />
                        <Route path = '/view-grn/:enterpriseId?/:companyId?/:projectId?/:ShipmentCompanyId?/:shipmentId?' component={Grn} />
                        <Route path = '/create-grn/:enterpriseId?/:companyId?/:projectId?/:ShipmentCompanyId?/:shipmentId?' component={Grn} />

                        <Route path="/myaction/:enterpriseId?/:companyId?/:projectId?" component={MyAction}/>
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
            showHeaderFilter:state.storeState.isDetail,
            selectedInfo:state.companyDetailReducer,
            FilterReducer:state.FilterReducer
    
         }
    }
    
    const mapDispatchToProps = (dispatch) => {
        
      return {
         storeSession: (isLogin,loginDetail) => dispatch(commonActions.storeSession(isLogin,loginDetail)),
         getEnterprices:() =>{
                dispatch(getEnterprices())
         },
        updateEnterpriseId  :(_eId)=>{
            dispatch(updateEnterpriseId(_eId))
        },
        updateCompanyId  :(_cId)=>{
            dispatch(updateCompanyId(_cId))
        },
        updateProjectId  :(_pId)=>{
            dispatch(updateProjectId(_pId))
        },
        getCompany  :(_eId)=>{
            dispatch(getCompany(_eId))
        },
        getProject  :(_eId,_cId)=>{
            dispatch(getProject(_eId,_cId))
        }
          
     }
    }

    
    export default connect(mapStateToProps,mapDispatchToProps)(AppRouter);



	  

