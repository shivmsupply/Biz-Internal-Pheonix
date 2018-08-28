import React, { Component } from "react";
import * as LoginActions from "../actions/LoginActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import $http from '../utils/Http';
import ENV_VARIABLE from '../utils/Environment';
import "../assets/styles/components/viewroles.css";
import Loading from "../common/Loading/Loading";
import {Button} from "../common/FormElements/FormElements";
import CreateEditRole from "../components/ViewRoles/CreateEditRole";

class ViewRoles extends Component {
		constructor(props) {
			super(props);
			this.state = {
				companyid:this.props.match.params.companyId == 'ero'?this.props.match.params.eroCid:this.props.match.params.companyId,
			};
			
		this.routeParam =this.props.match.params; 
		this.getRoles =this.getRoles.bind(this);
		this.getPrivileges = this.getPrivileges.bind(this);
		this.openAddRole = this.openAddRole.bind(this);
		this.getModulesAndActions = this.getModulesAndActions.bind(this);

    if(this.props.match.params.companyId!==''&&this.props.match.params.eroCid=== undefined){
      let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Company',navigation:'/pr2pay/'+this.routeParam.companyId+'/company-detail'},
        {displayName:'Roles',navigation:''}]
        const { dispatch } = this.props;
        dispatch(LoginActions.setBreadCrumb(_breadCrumb,true));
    }else{
      let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Roles',navigation:''}]
        const { dispatch } = this.props;
        dispatch(LoginActions.setBreadCrumb(_breadCrumb,true));
    }
  }
 
 componentDidMount(){
	 this.getRoles();
	 this.getModulesAndActions();
 }
 openAddRole(action, role){
	 
	 this.setState({createEditRoleAction : action});
	 if(action == "edit"){
		 this.setState({selectedRole:role})
	 }
	 else{
		 this.setState({selectedRolePrivileges:""})
	 }
	 this.setState({addRoleModal : true})
 }
 
  getRoles(){

		debugger;
    this.setState({ isLoading: true });
   $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/company/'+ this.state.companyid +'/role',(res)=>{
     if(res.http_code ==200){
       this.setState({roles : res.message,isLoading: false }) ;
	   var predefinedRoles = [];
	   var customRoles = [];
	   this.state.roles.map((item) => {
		   if(item.predefined){
			   predefinedRoles.push(item);
		   }
		   else{
			   customRoles.push(item);
		   }
		   this.setState({"predefinedRoles":predefinedRoles,"customRoles":customRoles})
	   });
	   
     } else {
     }
    })
  }
  getModulesAndActions(){
		debugger;
	  this.setState({ isLoading: true });
   $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/privilege',(res)=>{
     if(res.http_code ==200){
       this.setState({modules : Object.values(res.message[0])});
	 
     } else {
     }
    })
  }
	getPrivileges(associatedPrivileges){
	if(associatedPrivileges.length > 0){
		var sortedAssociatedPrivileges = associatedPrivileges.sort(function(a,b) {return a.displayOrder - b.displayOrder});
	var displayPrivileges =  sortedAssociatedPrivileges.map((item, index) => {
		return item.displayName;
	})
	return displayPrivileges.join(", ");
	}
	else{
		return "---"
	}
	
}

  render() {
    return (
      <div className="viwProDiv">
       {this.state.isLoading?<Loading />:null}
		   {this.state.predefinedRoles!=undefined?<div>
		   <p className= "custom-roles-header">Predefined Roles</p>
		   {this.state.predefinedRoles.map((item) =>{
			   return <div className = "projectdetails">
			   <p className="privilegeDetail" style={{background:"#f0f0f0", textAlign:"center"}}>{item.displayName}<img src={ENV_VARIABLE.IMAGE_URL + "edit.png"} alt="BizLogo" onClick={()=>{this.openAddRole("edit", item)}}className="edit-role-img" /></p>
			   {Object.keys(item.privilegesUI).map((uiPrivilege) => {
				   return <p className="privilegeDetail"><b className="privilegeName">{item.privilegesUI[uiPrivilege].displayName} </b>:<span className="associatedPrivileges">{this.getPrivileges(item.privilegesUI[uiPrivilege].associatedPrivileges)} </span></p>
			   })}</div>
		   }) }
		   
		   
		   </div>: null}
		   
		    {this.state.customRoles!=undefined?<div>
			 <p className="custom-roles-header">
				Custom Roles 
			 <Button 
					 type="button" 
					 display="1"
					 click={()=>{this.openAddRole("create")}} 
					 style= {{ marginTop:"10px", marginLeft:"75%"}}
					 value="Add Role" 
				/> 
				</p> {this.state.customRoles.map((item) =>{
			   return 
				 <div className = "projectdetails">
				 		<p 
						 className="privilegeDetail" 
						 style={{background:"#f0f0f0", textAlign:"center"}}>
						 	{item.displayName}
							 <img 
									 src={ENV_VARIABLE.IMAGE_URL + "edit.png"} 
									 alt="BizLogo" 
									 onClick={()=>{this.openAddRole("edit", item)}}
									 className="edit-role-img" 
								/> 
				</p>
			   {Object.keys(item.privilegesUI).map((uiPrivilege) => {
					 return <p className="privilegeDetail">
					 					<b className="privilegeName">
											{item.privilegesUI[uiPrivilege].displayName} </b>:<span className="associatedPrivileges">
											{this.getPrivileges(item.privilegesUI[uiPrivilege].associatedPrivileges)}
									</span>
									</p>
			   })}</div>
		   }) }
		</div>: null}
		  
		{this.state.addRoleModal==true ? <CreateEditRole selectedRole = {this.state.selectedRole} action = {this.state.createEditRoleAction}closeAddRole = {()=>{this.setState({addRoleModal:false});this.getRoles()}} companyId = {this.state.companyid} modules = {this.state.modules}/>:null}
      
      </div>
    );
  }
}
const mapStateToProps = state => {  
  return {
    isLogin: state.storeSession.isLogin,
    loginDetail: state.storeSession.loginDetail,
    userRole:state.companyDetailReducer.currentCompanyDetail.displayName,
    allState: state.storeState.stateInfo,
    individualCompanyDetail: state.companyDetailReducer,
    companyID: state.companyDetailReducer.companyId,
    accessRole:state.companyDetailReducer.currentCompanyDetail
  }
}

export default withRouter(connect(mapStateToProps)(ViewRoles));
