import React,{Component} from 'react';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom';
import '../assets/styles/style.css';

import { Button,Text } from '../common/FormElements/FormElements';
import {changePass} from '../actions/LoginActions'


class CreateNewPassword extends Component{
    constructor(props){
       super(props);
       this.state = {
		data:{
			oldPassword: "",
			newPassword: "",
			confirmPassword:""
		},
		errors: {
			oldPassword: "required",
			newPassword: "required",
			confirmPassword: "required"
			
		},
		formSubmitted: false
	   }
       this.handleChange = this.handleChange.bind(this);
       this.handleSubmit=this.handleSubmit.bind(this);
       // this.forgotPassWrd = this.forgotPassWrd.bind(this);
       // this.handleforgotePass=this.handleforgotePass.bind(this);
	}
	
	componentWillReceiveProps(){
		if(this.props.loginReducer.pwdChangeDetail.oldPassword){
			this.props.history.push('/scanqr')
		}
	}
    handleChange(e, data) {
		this.setState({correctData:false});
		var submitData = this.state.data;
		submitData[e.target.name] = data.data;
		this.setState({ data: submitData });
		var submitErrors = this.state.errors;
		submitErrors[e.target.name] = data.error;
		this.setState({ errors: submitErrors });
	}
	
	handleSubmit(e) {
		  debugger;
		if(e !== undefined)e.preventDefault();
		let data = {
			oldPassword: this.state.data.oldPassword,
			newPassword: this.state.data.newPassword,
			confirmPassword: this.state.data.confirmPassword
		}

		this.props.passChangeSubmit(data) 
		this.setState({formSubmitted:true});
		if(this.state.data.newPassword!==this.state.data.confirmPassword){
			this.setState({correctData:true});
		}
	}
	
    render(){
		console.log("Password ==========<>><><<><><", this.props.LoginReducer)
		return(
		<div className="loginICont">
			<div className="msLoginBlock mar-top-20">
				<div className="captionLogin">Create New Password</div>
				
					<form onSubmit={this.handleSubmit} noValidate>
						<div className="msFormGroup">
							<Text 
								type="password"
								labelWidth="0" 
								placeholder="Old Password *"  
								name="oldPassword" 
								className="inputControl"
								value={this.state.data.oldPassword}
								validation="password"
								change={this.handleChange}
								errorMessage={this.state.errors.oldPassword}
								submitted={this.state.formSubmitted}
							/>
						</div>
						<div className="msFormGroup">
							<Text  
								type="password"
								labelWidth="0" 
								change={this.handleChange}
								placeholder="New Password *" 
								name="newPassword"
								className="inputControl"
								value={this.state.data.newPassword}
								validation="password"
								errorMessage={this.state.errors.newPassword}
								submitted={this.state.formSubmitted}
							/>
						</div>
						<div className="msFormGroup">
							<Text type="password"
								labelWidth="0" 
								change={this.handleChange}
								placeholder="Re Enter New Password *" 
								name="confirmPassword" 
								value={this.state.data.confirmPassword}
								validation="password"
								errorMessage={this.state.errors.confirmPassword}
								submitted={this.state.formSubmitted}
								className="inputControl"
							/>
						</div>
						{this.state.correctData===true?<p className="error">New passwords are not matching</p>:null}
						<div className="msFormGroup msGroupBtn">
							{/* <button className={styles.msBtn}>Cancel</button> */}
								<button type="submit" className="msBtn">Next</button>
						</div>
					</form>
				</div>
			</div>
        	)
    	}
}

const mapStateToProps = state =>{
	return{
		LoginReducer: state.LoginReducer
	}
}

const mapDispatchToProps = dispatch =>{
	debugger;
	return{
		passChangeSubmit: (data) => {
			dispatch(changePass(data))
		}
	}
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateNewPassword))






