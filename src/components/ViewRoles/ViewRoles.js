import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import "../../assets/styles/components/viewroles.css";
import $http from '../../utils/Http';
import Loading from '../../common/Loading/Loading';
import ENV_VARIABLE from '../../utils/Environment';
import { Button,Text,Dropdown,TextArea,File } from '../../common/FormElements/FormElements';
import editImg from '../../assets/images/edit.png';
import CreateEditRole from "./CreateEditRole";
import * as commonActions from "../../actions/LoginActions";
class ViewRoles extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
      companyid:this.props.match.params.companyId == 'ero'?this.props.match.params.eroCid:this.props.match.params.companyId,
     

    };
	debugger;
	let _breadCrumb=[{displayName:'PR2Pay',navigation:''}]
	const { dispatch } = this.props;
    dispatch(commonActions.setBreadCrumb(_breadCrumb,true));
    
    this.routeParam =this.props.match.params; 
    this.getRoles =this.getRoles.bind(this);
	this.getPrivileges = this.getPrivileges.bind(this);
	this.openAddRole = this.openAddRole.bind(this);
	this.getModulesAndActions = this.getModulesAndActions.bind(this);
    

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
		 this.setState({selectedRole:""})
	 }
	 this.setState({addRoleModal : true})
 }
 
  getRoles(){
	  if(this.props.match.params.companyId != undefined && this.props.match.params.companyId != ''){
		  this.setState({ isLoading: true });
   $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/'+this.props.match.params.enterpriseId+'/company/'+this.props.match.params.companyId+'/role',(res)=>{
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
    
  }
  getModulesAndActions(){
	  this.setState({ isLoading: true });
   $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/privilege',(res)=>{
     if(res.http_code ==200){
       this.setState({modules : Object.values(res.message[0])});
	   var stateData = this.state;
	   stateData.modules.map((module) => {
		   var sortedAssociatedPrivileges = module.associatedPrivileges.sort(function(a,b) {return a.displayOrder - b.displayOrder});
			module.associatedPrivileges = sortedAssociatedPrivileges;
	   });
	   this.setState(stateData);
	 
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
		{
		this.props.filterReducer.selectedEnterprise != '' && this.props.filterReducer.selectedEnterprise != undefined&&this.props.filterReducer.selectedCompany != ''&&this.props.filterReducer.selectedCompany != undefined?
       <div>
	   {this.state.isLoading?<Loading />:null}
	   
		   {this.state.predefinedRoles!=undefined?<div>
		   <p className= "custom-roles-header"><b>Predefined User Roles ({this.state.predefinedRoles.length})</b></p>
		   {this.state.predefinedRoles.map((item) =>{
			   return <div className = "projectdetails">
			   <p className="privilegeDetail" style={{background:"#f0f0f0", textAlign:"center"}}>{item.displayName}<img src={editImg} alt="BizLogo" onClick={()=>{this.openAddRole("edit", item)}}className="edit-role-img" /></p>
			   {Object.keys(item.privilegesUI).map((uiPrivilege) => {
				   return <p className="privilegeDetail"><b className="privilegeName">{item.privilegesUI[uiPrivilege].displayName} </b>:<span className="associatedPrivileges">{this.getPrivileges(item.privilegesUI[uiPrivilege].associatedPrivileges)} </span></p>
			   })}</div>
		   }) }
		   
		   
		   </div>: null}
		   <hr/>
		    {this.state.customRoles!=undefined?<div>
			<p className= "custom-roles-header"><b>Custom Created Roles ({this.state.customRoles.length})</b>
		   
		   <Button type="button"display="1"click={()=>{this.openAddRole("create")}} style= {{ marginTop:"10px", marginLeft:"75%"}}value="Add Role" /> </p>
		   {this.state.customRoles.map((item) =>{
			   return <div className = "projectdetails">
			   <p className="privilegeDetail"style={{background:"#f0f0f0", textAlign:"center"}}>{item.displayName}<img src={editImg} alt="BizLogo" onClick={()=>{this.openAddRole("edit", item)}}className="edit-role-img" /> </p>
			   {Object.keys(item.privilegesUI).map((uiPrivilege) => {
				   return <p className="privilegeDetail"><b className="privilegeName">{item.privilegesUI[uiPrivilege].displayName} </b>:<span className="associatedPrivileges">{this.getPrivileges(item.privilegesUI[uiPrivilege].associatedPrivileges)} </span></p>
			   })}</div>
		   }) }
		   </div>
		   : null}
		   {this.state.addRoleModal==true ? <CreateEditRole enterpriseId = {this.props.match.params.enterpriseId}selectedRole = {this.state.selectedRole} action = {this.state.createEditRoleAction}closeAddRole = {()=>{this.setState({addRoleModal:false});this.getRoles()}} companyId = {this.state.companyid} modules = {this.state.modules}/>:null}
		   
		</div>:<p>Please Select Enterprise and Company to view roles</p>}
		</div>);
  }
}
const mapStateToProps = state => {
  
  return {
    isLogin: state.storeSession.isLogin,
    loginDetail: state.storeSession.loginDetail,
    
   filterReducer:state.FilterReducer
  };
};
export default withRouter(connect(mapStateToProps)(ViewRoles));
