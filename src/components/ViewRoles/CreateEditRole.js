import React from "react";
import ENV_VARIABLE from '../../utils/Environment';
import  "../../assets/styles/components/viewroles.css"
import {Button, Text, Checkbox} from "../../common/FormElements/FormElements";
import Modal from '../../common/Modal/Modal'
import $http from '../../utils/Http';

export default class CreateEditRole extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			privileges:this.props.selectedRole.privileges == undefined || this.props.selectedRole.privileges == "" ? {}: this.props.selectedRole.privileges,
			displayName:this.props.selectedRole != undefined && this.props.selectedRole != "" ? this.props.selectedRole.displayName:"",
			createEditRoleModal:true
		}
		
		this.CreateRole = this.CreateRole.bind(this);
		this.handlePrivilegeChange = this.handlePrivilegeChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handlePrivilegeChange(e){
		var privileges = this.state.privileges;
		privileges[e.target.id] = !privileges[e.target.id]
		this.setState({privileges:privileges});	
	}

	CreateRole(){
		var submitData = this.state;
		
		if(this.props.action == "create"){
			$http.postWithUrl(ENV_VARIABLE.HOST_NAME+'census/company/'+this.props.companyId+'/role' ,JSON.stringify(submitData) ,(response)=>{
				if(response.http_code == 200)
				this.setState({"successPopup" : true,"createEditRoleModal":false,"successPopup" : "New Role Created Successfully" })
			})
		}
		else{
			$http.putWithUrl(ENV_VARIABLE.HOST_NAME+'census/company/'+this.props.companyId+'/role/'+this.props.selectedRole.id ,JSON.stringify(submitData) ,(response)=>{
				if(response.http_code == 200)
				this.setState({"successPopup" : true,"createEditRoleModal":false,"successPopup" : "Role Edited Successfully" })
			
			})
		}
	}

	handleChange(e, data){
		var stateData = this.state;
		stateData[e.target.name] = data.data;
		this.setState(stateData);
	}
	
	render(){
	return(
		<div>
		<Modal 
			isOpen={this.state.createEditRoleModal} 
			header={this.props.action == "create" ? "Add New Role" : "Edit Role"} 
			height="600px"
			width="750px" 
		>
			<div className="roles-name-container">
				<Text  
					validation="alphanumeric"
					placeholder="Enter Role Name"
					change = {this.handleChange} 
					value = {this.state.displayName} 
					name="displayName"  
				/>
			</div>

			<div className = "modulesContainer">
				<table className="modulesTable">
				<tbody>
				{this.props.modules.map((module) => {
					return(
					<tr>
					<td className="fix">{module.displayName}</td>
					</tr>) 
				})}
				</tbody>
				</table>

				<div className="privilegesTableContainer">
					<table className="privilegesTable">
						<tbody>
							{this.props.modules.map((module) => {
								return(
								<tr>
								{module.associatedPrivileges.map((privilege) => {
										return (
											<td > <Checkbox 
													id={privilege.name} 
													name={privilege.name} 
													checked={this.state.privileges[privilege.name] == true} 
													onChange={this.handlePrivilegeChange}
													disabled = {this.props.selectedRole != undefined && this.props.selectedRole.predefined == true} 
													label={privilege.displayName} />
											</td>
										)
									})
								}
								{[...Array(5 - module.associatedPrivileges.length)].map((e, i) => <td ></td>)}
								</tr>) 
							})}
						</tbody>
					</table>
				</div>
				<Button 
					type="button"
					display="1"
					click = {()=>{this.props.closeAddRole()}}  
					style= {{marginTop:"5px", marginRight:"10px"}}
					value="Cancel" 
				/> 
				<Button 
					type="button"
					display="1"
					click = {this.CreateRole} 
					style= {{ marginTop:"5px", marginLeft:"10px"}}
					value={this.props.action == "create" ? "Create Role" : "Edit Role"} 
				/> 
			</div>
		</Modal>

		<Modal isOpen={this.state.successPopup} header="Sucess" height="200px"width="400px" >
			<p>{this.state.successPopup}</p>
			<Button type="button"display="1"click = {()=>{this.props.closeAddRole()}}  style= {{marginTop:"5px", marginRight:"10px"}}value="Ok" /> 
		</Modal>
	</div>
	)}
}


