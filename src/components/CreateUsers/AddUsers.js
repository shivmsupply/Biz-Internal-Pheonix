import React, { Component } from "react";
import { connect } from "react-redux";
import {  withRouter } from "react-router-dom";
import ENV_VARIABLE from "../../utils/Environment";
import $http from "../../utils/Http";
import { Text } from "../../common/FormElements/FormElements";


class AddUsers extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:{
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        designation: ""
      },
      errors:{
        firstName: "required",
        email: "required",
        lastName: "required",
        mobile: "required",
        designation: ""
      },
      formSubmitted : false,
      emailVerified : false,
      userExixt : false,

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  gotoUserList(gotoList) {
    let filterUrl = ((this.props.match.params.enterpriseID)?this.props.match.params.enterpriseID+"/":"")+((this.props.match.params.companyID)?this.props.match.params.companyID+"/":"")+((this.props.match.params.projectId)?this.props.match.params.projectId+"/":"")

    this.props.history.push("/view-users/" + filterUrl);
  }
  handleChange(e, data) {
    this.userExixt = false;
    var submitData = this.state.data;
    submitData[e.target.name] = data.data;
    this.setState({ data: submitData });
    var submitErrors = this.state.errors;
    submitErrors[e.target.name] = data.error;
    this.setState({ errors: submitErrors });
  }

  componentDidMount() {
    ///console.log("params:        ============",this.props.match.params)
    if (this.props.match.params.userID !== "") {
      $http.getWithUrl(
        ENV_VARIABLE.HOST_NAME +
          "census/phoenix/user/" +
          this.props.match.params.userID,
        res => {
          this.setState({ isLoading: false });
          debugger
          if (res.http_code == 403) {
          }
          if (res.http_code == 401) {
            return;
          }
          if (res.http_code == 200) {
            debugger;
            this.setState(prevState => {
              return {
                ...prevState.data,
                data: {
                  firstName: res.message.firstName,
                  lastName:  res.message.lastName,
                  email: res.message.email, 
                  mobile: res.message.mobile,
                  designation: res.message.designation,
                  enterpriseId: res.message.enterpriseId
                }
              };
            });
            this.setState({ emailVerified: res.message.emailVerified });
            console.log(res.message.emailVerified);
            var e = this.state.errors;
            var d = this.state.data;
            Object.keys(this.state.data).map(key => {
              if (key !== "designation") {
                d[key] = this.state.data[key];
                e[key] = this.state.errors[key].length > 0 ? "" : "required";
              }
            });
            console.log(res.message);
          }
        }
      );
    }
  }

  handleSubmit(e) {

    debugger
    if (e !== undefined) e.preventDefault();
    this.setState({ formSubmitted: true });


    if (this.props.match.params.userID === undefined) {
      if (
        Object.keys(this.state.errors).filter(key => {
          if (this.state.errors[key] != "") return 1;
          else return 0;
        }).length !== 0
      )
        return;
      $http.postWithUrl(
        ENV_VARIABLE.HOST_NAME + "census/phoenix/enterprise/"+this.props.match.params.enterpriseId+"/user",
        JSON.stringify({
          firstName: this.state.data.firstName,
          middleName: "",
          lastName: this.state.data.lastName,
          email: this.state.data.email,
          mobile: this.state.data.mobile,
          designation: this.state.data.designation,
          logo: "",

        }),
        res => {
          this.setState({ isLoading: false });
          if (res.http_code == 400) {
            this.setState({
              userExixt: true
            });
          }
          if (res.http_code == 403) {
          }
          if (res.http_code == 401) {
            return;
          }
          if (res.http_code == 200) {
            debugger;
            this.props.history.push(
              "/users/" +this.props.filterReducer.selectedCompany?
                this.props.filterReducer.selectedCompany +
                "/":'' +
                "add-users/" +
                "assign-roles/" +
                res.message.id
            );
            //console.log(this.props.match.params.userAdditionStep);
            this.props.tabUpdate("assign-roles");
          }
        }
      ) ;
    }
    if (this.props.match.params.userID !== undefined) {
      //console.log("update working");
    
      if (
        this.state.data.designation === null ||
        this.state.data.designation == undefined
      ) {
        this.state.data.designation = "";
      }
      //console.log()
      $http.putWithUrl(
        ENV_VARIABLE.HOST_NAME +
          "census/phoenix/enterprise/"+this.state.data.enterpriseId+"/user/" +
          this.props.match.params.userID,
        JSON.stringify({
          firstName: this.state.data.firstName,
          middleName: "",
          lastName: this.state.data.lastName,
          email: this.state.data.email,
          mobile: this.state.data.mobile,
          designation: this.state.data.designation,
          logo: ""
        }),
        res => {
          debugger;
          this.setState({ isLoading: false });
          if (res.http_code == 403) {
          }
          if (res.http_code == 401) {
            return;
          }
          if (res.http_code == 200) {
            console.log("update Successfully");
            this.props.history.push(
              "/users/" + this.props.match.params.enterpriseID + "/" + this.props.match.params.companyId + "/" + this.props.match.params.projectId + "/" 
                +
                "edit-users/" +
                "assign-roles/" +
                res.message.id/+'/assigned-users'
            );
          }
          console.log(this.props.match.params.userAdditionStep);
          this.props.tabUpdate("assign-roles");
        }
      );
    }
  }
  render() {
    console.log("state heww============>", this.props.match.params)
    return (
      <div>
        <form onSubmit={this.handleSubmit} noValidate>
          <ul className="myAccounts">
            <li className="profileImg">
              <img
                className="profilelogo"
                src={require('../../assets/images/No_Image_02.png')}
                alt="profile_logo"
              />
            </li>
            <li className="margin-li wid-200">
              <div>
                <Text
                  className="wid-200 pad-top-10"
                  name="firstName"
                  label="First Name"
                  value={this.state.data.firstName}
                  change={this.handleChange}
                  submitted={this.state.formSubmitted}
                  validation="name"
                  mand="true"
                  errorMessage={this.state.errors.firstName}
                />
              </div>
              <div className="mar-top-15">
                <Text
                  name="email"
                  label="Email Id"
                  value={this.state.data.email}
                  change={this.handleChange}
                  validation="email"
                  errorMessage={this.state.errors.email}
                  submitted={this.state.formSubmitted}
                  mand="true"
                  readOnly={this.state.emailVerified === true}
                  disabled={this.state.emailVerified === true}
                />
              </div>
            </li>
            <li className="mar-10 wid-200">
              <div>
                <Text
                  name="lastName"
                  label="Last Name"
                  value={this.state.data.lastName}
                  change={this.handleChange}
                  submitted={this.state.formSubmitted}
                  validation="name"
                  errorMessage={this.state.errors.lastName}
                  mand="true"
                />
              </div>
              <div className="mar-top-15">
                <Text
                  name="mobile"
                  label="Phone Number"
                  value={this.state.data.mobile}
                  change={this.handleChange}
                  validation="mobile"
                  submitted={this.state.formSubmitted}
                  errorMessage={this.state.errors.mobile}
                  mand="true"
                />
              </div>
            </li>
            <li className="designali wid-200">
              <div className="mar-top-15">
                <Text
                  name="designation"
                  label="Designation"
                  value={this.state.data.designation}
                  change={this.handleChange}
                />
              </div>
            </li>
          </ul>
          
              {this.state.userExixt === true ? (
              <ul className="crtbtn">
                <li>
                  <p className="red">
                    USer is already exists with email/userName/mobile
                  </p>
                </li>
              </ul>
              ) : null}
            
          <ul className="crtbtn">
            <li>
              <button
                className="commonbtnCss"
                onClick={() => this.gotoUserList("view-users")}
              >
                Cancel
              </button>
            </li>
            <li>
              {this.props.match.params.userID === undefined ? (
                <button className="commonbtnCss">Create New User</button>
              ) : null}
              {this.props.match.params.userID !== undefined ? (
                <button className="commonbtnCss">Update User</button>
              ) : null}
            </li>
          </ul>
        </form>
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
export default withRouter(connect(mapStateToProps)(AddUsers));