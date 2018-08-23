import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ENV_VARIABLE from "../../utils/Environment";
import $http from "../../utils/Http";
import { Dropdown, Checkbox } from "../../common/FormElements/FormElements";

function newState() {
  this.selectProject = false;
  this.projectInfo = "";
  this.projectArray = [];
  this.roles = [];
  this.countProject = 0;
}
class AssignRoles extends Component {
  constructor(props) {
    super(props);
    this.state = new newState();
    this.selectId = this.selectId.bind(this);
  }
  gotoUserList(gotoList) {
    this.props.history.push("/pr2pay/" + this.props.companyID + "/" + gotoList);
  }
  gotoCreateUser() {
    debugger;
    this.props.history.push(
      "/pr2pay/" +
        this.props.companyID +
        "/" +
        this.props.match.params.userType +
        "/" +
        "add-users" +
        "/" +
        this.props.match.params.userID
    );
    this.props.tabUpdate("add-users");
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    $http.getWithUrl(
      ENV_VARIABLE.HOST_NAME +
        "census/company/" +
        this.props.companyID +
        "/project",
      res => {
        if (res.http_code == 200) {
          this.setState({
            projectInfo: res.message,
            isLoading: false
          });
        } else {
        }
      }
    );
    if (this.props.match.params.userID !== "") {
      $http.getWithUrl(
        ENV_VARIABLE.HOST_NAME +
          "census/user/" +
          this.props.match.params.userID,
        res => {
          this.setState({ isLoading: false });
          if (res.http_code == 403) {
          }
          if (res.http_code == 401) {
            return;
          }
          if (res.http_code == 200) {
            console.log(res.message.authorizations);
          }
        }
      );
    }
    $http.getWithUrl(
      ENV_VARIABLE.HOST_NAME +
        "census/company/" +
        this.props.companyID +
        "/role",
      res => {
        this.setState({ isLoading: false });
        if (res.http_code == 403) {
        }
        if (res.http_code == 401) {
          return;
        }
        if (res.http_code == 200) {
          console.log(res.message);
          this.setState({
            roles: res.message
          });
          debugger;
        }
      }
    );
  }
  selectRoles(e, d) {
    debugger;
    for (let i = 0; i < this.value.length; i++) {
      if (this.value[i].id === d.data) {
        var selectedRolesData = this.value[i];
        console.log("selected id=====>", selectedRolesData);
      }
    }
  }
  selectId(event, projectId) {
    if (event.target.checked === true) {
      this.state.projectArray.push(projectId);
      this.setState({
        countProject: this.state.projectArray.length
      });
    } else {
      for (var i = 0; i < this.state.projectArray.length; i++) {
        if (this.state.projectArray[i] == projectId) {
          this.state.projectArray.splice(i, 1);
          this.setState({
            countProject: this.state.projectArray.length
          });
        }
      }
    }
    console.log(this.state.projectArray.length);
  }
  getProjectNameAndId(projectInfo) {
    return Object.keys(projectInfo).map(info => (
      <div key={info} className="selectproject">
        <Checkbox
          id={info}
          name="selectProject"
          onChange={event => this.selectId(event, projectInfo[info].id)}
        />
        <p className="mar-left-30">{projectInfo[info].projectName}</p>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <div className="myAccounts">
          <div className="projectdiv">
            <div className="prohead">
              <p className="pad-10">
                Select Projects <span className="star">*</span>
              </p>
              {this.state.countProject !== 0 ? (
                <p className="pad-10">
                  {this.state.countProject} Selected
                </p>
              ) : null}
            </div>
            {this.props.companyID !== "" && this.state.projectInfo !== "" ? (
              <div>{this.getProjectNameAndId(this.state.projectInfo)}</div>
            ) : null}
          </div>
          <div className="projectdiv mar-left-20">
            <div className="prohead">
              <p className="pad-10">
                <Dropdown
                  placeholder="Roles *"
                  mand="true"
                  name="state"
                  value={this.state.roles}
                  options={this.state.roles.map(obj => {
                    return { label: obj.displayName, value: obj.id };
                  })}
                  change={this.selectRoles}
                />
              </p>
              <button className="commonbtnCss">Add New Role</button>
            </div>
          </div>
        </div>
        <div className="btndiv">
          <button
            className="allbtn"
            onClick={() => this.gotoCreateUser()}
          >
            Back
          </button>
          <button
            className="allbtn"
            onClick={() => this.gotoUserList("view-users")}
          >
            Cancel
          </button>
          <button
            className="allbtn"
            onClick={() => this.gotoUserList("view-users")}
          >
            Assign Role
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loginDetail: state.storeSession.loginDetail,
    companyInfo: state.companyDetailReducer,
    companyID: state.companyDetailReducer.companyId
  };
};
export default withRouter(connect(mapStateToProps)(AssignRoles));