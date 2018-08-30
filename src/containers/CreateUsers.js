import React, { Component } from "react";
import { connect } from "react-redux";
import {  withRouter } from "react-router-dom";
import '../assets/styles/components/createUser.css';
import combineClass from "classnames";
import * as LoginActions from "../actions/LoginActions";
import AddUsers from '../components/CreateUsers/AddUsers';
import AssignRoles from '../components/CreateUsers/AssignRoles';


class CreateUsers extends Component {

    constructor(props){
        super(props);
        this.state={
            tabValue:'add-users'
        }

        //console.log("props checking===>",this.props.match.params.userID);
        this.routeParam =this.props.match.params; 
        let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Users',navigation:'/create-users/'+this.routeParam.companyId+'/view-users'},
        {displayName:'Add New User',navigation:''}]
        const { dispatch } = this.props;
        dispatch(LoginActions.setBreadCrumb(_breadCrumb,true));
    }
    
    changeTab(userAdditionStep){
      debugger;
      if(this.props.match.params.userID !==''){
        this.props.history.push("/users/"+ this.props.match.params.enterpriseId+"/"+this.props.match.params.companyId+"/"+this.props.match.params.projectId +'/'+'edit-users/'+userAdditionStep+"/"+this.props.match.params.userID+"/assigend-users");
      }else{
        this.props.history.push("/users/" + this.props.match.params.enterpriseId+"/"+this.props.match.params.companyId+"/"+this.props.match.params.projectId+'/'+'add-users/'+userAdditionStep);
      }
        this.setState({
            tabValue:userAdditionStep
        })
    }

  render() {
    var addUsers=combineClass({['backTAB']:this.state.tabValue=='add-users'});
    var assignRoles=combineClass({['backTAB']:this.state.tabValue=='assign-roles'}); 
  
    return (
      <div>
      
        <ul className="usertab">
          <li className="addUsers" onClick={()=>this.changeTab('add-users')}>
            Create Users
          </li>
       
          {this.props.match.params.userType==='edit-users' ?
          <li className='assignRoles mar-left-6' onClick={()=>this.changeTab('assign-roles')}>
           Assign Project & Roles
          </li>:null}
        </ul>
    
        {this.state.tabValue==='add-users'?<AddUsers tabUpdate={()=>this.changeTab(this.props.match.params.userAdditionStep)}/>:null}
        {this.state.tabValue==='assign-roles'?<AssignRoles tabUpdate={()=>this.changeTab('add-users')}/>:null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    filterReducer:state.FilterReducer,
    loginDetail: state.storeSession.loginDetail,
    companyInfo: state.companyDetailReducer,
    companyID: state.companyDetailReducer.companyId
  };
};
export default withRouter(connect(mapStateToProps)(CreateUsers));