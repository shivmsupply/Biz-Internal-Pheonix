import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ENV_VARIABLE from "../../utils/Environment";
import $http from "../../utils/Http";
import { Dropdown } from "../../common/FormElements/FormElements";


import  "../../assets/styles/components/main.css";
import Pagination from "./Pagination.js";
import Loading from "../../common/Loading/Loading";

class AssignedUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsPerPage: 10,
      pageNumber: 0,
      viewPerPage: [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 30, value: 30 }
      ],
      userCount: 0,
      assigneUserDetails: "",
      userLists: [],
      roles: [],
      isLoading: false
    };
    this.getassignedUserList();
    this.clickOnPage = this.clickOnPage.bind(this);
    this.viewPageChange = this.viewPageChange.bind(this);
  }

  editRoles(edituser, userID,roleType) {
    this.props.history.push(
      "/pr2pay/" +
        this.props.companyID +
        "/" +
        edituser +
        "/" +
        "add-users/" +
        userID+'/'+roleType
    );
  }

  clickOnPage(page) {
    let t = this.state;
    t["pageNumber"] = page - 1;
    this.setState(t);
    this.getassignedUserList();
  }
  
  viewPageChange(e, data) {
    this.setState({ itemsPerPage: data.data });
    this.getassignedUserList();
  }
  
  getassignedUserList() {
    if (this.props.match.params.companyId === "ero") {
      this.props.match.params.companyId = this.props.match.params.projectID;
      this.props.match.params.projectID = "";
    }
    if (this.props.match.params.projectID === undefined) {
      this.props.match.params.projectID = "";
    }
    this.setState({ isLoading: true });

    $http.getWithUrl(
      ENV_VARIABLE.HOST_NAME +
        "census/phoenix/user/?enterpriseID="+this.props.match.params.enterpriseID +"&companyId="+ this.props.match.params.companyId +"&projectId="+ 
        this.props.match.params.projectId  + "&itemsPerPage=" + this.state.itemsPerPage +"&pageNumber=" + this.state.pageNumber,
      res => {
        if (res.http_code == 200) {
          this.setState({
            isLoading: false,
            assigneUserDetails: res.message,
            userCount: res.message.count
          });
          this.setState({
            totalPages: Math.ceil(res.message.count / this.state.itemsPerPage)
          });
        } else {
          this.setState({ isLoading: false });
          // this.props.history.push(
          //   "/pr2pay/" + this.props.match.params.companyId + "/" + "my-actions"
          // );
        }
      }
    );
  }
  userActivity(event,data){
    console.log(event.target.checked);
    debugger;
    if(event.target.checked===true){
      $http.putWithUrl(
        ENV_VARIABLE.HOST_NAME + "census/phoenix/enterprise/"+this.props.match.params.enterpriseID+"/user/"
        +data.id +'/deactivate',JSON.stringify({}),
        res => {
			 var stateData = this.state;
          if (res.http_code == 200) {
			stateData.assigneUserDetails.data[stateData.assigneUserDetails.data.indexOf(data)].isActive = false;
			this.setState(stateData);
          } else {
            
          }
        }
      );
    }
    if(event.target.checked===false){
      $http.putWithUrl(
        ENV_VARIABLE.HOST_NAME + "census/phoenix/enterprise/"+this.props.match.params.enterpriseID+"/user/"
          +data.id +"/activate",JSON.stringify({}),
        res => {
          var stateData = this.state;
          if (res.http_code == 200) {
            stateData.assigneUserDetails.data[stateData.assigneUserDetails.data.indexOf(data)].isActive = true;
            this.setState(stateData);
          } else {
            
          }
        }
      );
    }
    

  }
  printUserList(assigneUserDetails) {
    debugger;
    return Object.keys(assigneUserDetails.data).map(list => {
      return (
        <tr key={list}>
          <td className="text-left">
            {assigneUserDetails.data[list].firstName +
              " " +
              assigneUserDetails.data[list].lastName}
          </td>
          <td className="text-left">
            {assigneUserDetails.data[list].email}
          </td>
          <td className="text-left">
            {assigneUserDetails.data[list].mobile}
          </td>
          <td className="text-left">
            {Object.keys(assigneUserDetails.data[list].authorizations).map(
              (k, l) => (
                <p>
                  {this.props.match.params.companyId === k ? (
                    <span>
                      {
                        Object.keys(
                          assigneUserDetails.data[list].authorizations[k]
                            .projectDetails
                        ).length
                      }{" "}
                      Project
                    </span>
                  ) : null}
                </p>
              )
            )}
          </td>
          <td className="text-left">
            {Object.keys(assigneUserDetails.data[list].authorizations).map(
              (k, l) => (
                <p>
                  {this.props.match.params.companyId === k ? (
                    <span>
                      {
                        assigneUserDetails.data[list].authorizations[k]
                          .displayName
                      }
                    </span>
                  ) : null}
                </p>
              )
            )}
          </td>
          {this.props.accessRole!==''&&this.props.accessRole.privileges['user-create']===true? <td
            className="text-left"
            onClick={() =>
              this.editRoles("edit-users", assigneUserDetails.data[list].id,'assigend-users')
            }
          >
            <a>View/Edit</a>
          </td>:null} 
          <td>
            <label className='switch tooltip'>
              <input 
                  name="assignUsers" 
                  type="checkbox" 
                  checked = {!assigneUserDetails.data[list].isActive} 
                  onChange={(event)=>this.userActivity(event,assigneUserDetails.data[list])} 
              />
              <span className="slider round" />
              {assigneUserDetails.data[list].isActive===true?<span className="tooltiptext">Deactivate this user</span>:<span className="tooltiptext">Activate this user</span>}
            </label>
          </td>
        </tr>
      );
    });
  }
  render() {
    return (
      <div>
        <Loading isLoader={this.state.isLoading} />
        <div className="pageBar paginations">
          <span className="heading">
            Total Number of Users: <span>{this.state.userCount}</span>
          </span>
          {this.state.totalPages != undefined ? (
            <Pagination
              activePage={this.state.pageNumber + 1}
              totalPages={this.state.totalPages}
              clickOnPage={this.clickOnPage}
            />
          ) : null}
          <div
            className={'center  viewPerPage flex' +
              (this.state.userCount < 11 ? 'hide' : "")
            }
          >
            <span className="heading">View</span>
            <Dropdown
              name="viewPerPage"
              options={this.state.viewPerPage}
              style={{ margin: "0px 5px" }}
              value={this.state.itemsPerPage}
              change={this.viewPageChange}
            />
            <span className="heading">Per Page</span>
          </div>
        </div>
      
        <div className="tableDiv">
          <table className="tableLayout">
            <thead>
              <tr className="text-left">
                <th>Name</th>
                <th>Email Id</th>
                <th>Phone No.</th>
                <th>Projects</th>
                <th>Role</th>
                {this.props.accessRole!==''&&this.props.accessRole.privileges['company-edit']===true?<th>Access Right(S)</th>:null}
                <th />
              </tr>
              {this.state.userCount === 0 ? (
                <tr className="white">
                  <td colSpan="4">
                    {" "}
                    <p className="textCenter"> Data not found</p>
                  </td>
                </tr>
              ) : null}
            </thead>

            {this.props.companyID !== "" &&
            this.state.assigneUserDetails !== "" &&
            this.state.assigneUserDetails !== undefined ? (
              <tbody>{this.printUserList(this.state.assigneUserDetails)}</tbody>
            ) : null}
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    companyID: state.companyDetailReducer.companyId,
    accessRole:state.companyDetailReducer.currentCompanyDetail,
  };
};
export default withRouter(connect(mapStateToProps)(AssignedUserList));
