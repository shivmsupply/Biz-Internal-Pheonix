import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as LoginActions from "../actions/LoginActions";
import  "../assets/styles/components/userlist.css";

//import UnassignedUserList from "../components/UserList/UnassignedUserList";
import AssignedUserList from "../components/UserList/AssignedUserList";
import combineClass from "classnames";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flagList: "assignedList",
      companyId: location.pathname.split("/")[2]
    };

    this.showList = this.showList.bind(this);
    this.routeParam = this.props.match.params;

    if (this.props.match.params.type === "basedOnProject") {
      let _breadCrumb = [
        { displayName: "PR2Pay", navigation: "" },
        {
          displayName: "Company",
          navigation: "/pr2pay/" + this.routeParam.companyId + "/company-detail"
        },
        {
          displayName: "Project Details",
          navigation:
            "/pr2pay/" + this.routeParam.companyId + "/project-details"
        },
        { displayName: "Users", navigation: "" }
      ];
      const { dispatch } = this.props;
      dispatch(LoginActions.setBreadCrumb(_breadCrumb, true));
    }
    
    if (this.props.match.params.type === "basedOnCompany") {
      let _breadCrumb = [
        { displayName: "PR2Pay", navigation: "" },
        {
          displayName: "Company",
          navigation: "/pr2pay/" + this.routeParam.companyId + "/company-detail"
        },
        { displayName: "Users", navigation: "" }
      ];
      const { dispatch } = this.props;
      dispatch(LoginActions.setBreadCrumb(_breadCrumb, true));
    }
    
    if (this.props.match.params.type === undefined) {
      let _breadCrumb = [
        { displayName: "PR2Pay", navigation: "" },
        { displayName: "Users", navigation: "" }
      ];
      const { dispatch } = this.props;
      dispatch(LoginActions.setBreadCrumb(_breadCrumb, true));
    }
  }

  showList(data) {
    this.setState({ flagList: data });
  }

  addNewUser(userType) {
    debugger
    this.props.history.push(
      "/create-users/" +  this.props.match.params.enterpriseID + "/"+  this.props.match.params.companyId +"/"+  this.props.match.params.projectId +"/" + userType + "/add-users"+ "/"+ this.props.loginDetail.id
    );
  }

  render() {
    console.log("login user ===================>", this.props.loginDetail.id)
    var assigned = combineClass({
     'backTAB': this.state.flagList == "assignedList"
    });
    var unassigned = combineClass({
      'backTAB': this.state.flagList == "unassignedList"
    });
    return (
      <div>
       {/* <div>
           <div className={styles.pullSearch}>
              <input type="search" className={styles.inputSearch} placeholder="Search user by Name, email ID,Phone Number" />
              <img src={ENV_VARIABLE.IMAGE_URL + "if_icon-111-search_314478.svg"} />
            </div> 
        </div>*/}
        {/* <ul className="usertab">
          <li
            className={assigned}
            onClick={() => this.showList("assignedList")}
          >
            Assigned Users
          </li>
          <li
            className={unassigned + "mar-left-6"}
            onClick={() => this.showList("unassignedList")}
          >
            Unassigned Users
          </li>
        </ul> */}
        {/* {this.props.userRole==='Admin' ||(this.props.accessRole!==''&&this.props.accessRole['user-create']===true)? */}
        <ul className="adduser">
          <li>
            <button
              className="addbtn"
              onClick={() => this.addNewUser("create-users")}
            >
              Add New User
            </button>
          </li>
        </ul>
        {/* :null} */}
        <AssignedUserList /> 
      </div>
    );
  }
}

//export default UserList;
const mapStateToProps = state => {
  return {
    loginDetail: state.storeSession.loginDetail,
    companyInfo: state.companyDetailReducer,
    companyID: state.companyDetailReducer.companyId,
    accessRole:state.companyDetailReducer.currentCompanyDetail,
    userRole:state.companyDetailReducer.currentCompanyDetail.displayName,
  };
};

export default withRouter(connect(mapStateToProps)(UserList));
