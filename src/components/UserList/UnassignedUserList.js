import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ENV_VARIABLE from "../../utils/Environment";
import $http from "../../utils/Http";
import { Dropdown } from "../../common/FormElements/FormElements";
import  "../../assets/styles/components/userlist.css";
import  "../pagination.css";
import  "../../assets/styles/components/main.css";
import mainStyle from "../../assets/styles/components/main.css";
import Pagination from "./Pagination.js";
import Loading from "../../common/Loading/Loading";

class UnassignedUserList extends Component {
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
      unassigneUserDetails: ""
    };
    this.getUnassignedUserList();
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
    ////
    let t = this.state;
    t["pageNumber"] = page - 1;
    this.setState(t);
    // this.setState({pageNumber:page})
    this.getUnassignedUserList();
  }
  viewPageChange(e, data) {
    ////
    this.setState({ itemsPerPage: data.data });
    this.getUnassignedUserList();
  }
  getUnassignedUserList() {
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
        "census/user/"+this.props.match.params.enterpriseID+"/"
        +this.props.match.params.companyId+"/" +this.props.match.params.projectID+
        "/?itemsPerPage="+this.state.itemsPerPage +"&pageNumber=" +this.state.pageNumber,
      res => {
        this.setState({ isLoading: false });
        if (res.http_code == 200) {
          this.setState({
            unassigneUserDetails: res.message,
            userCount: res.message.count,
            totalPages: Math.ceil(res.message.count / this.state.itemsPerPage)
          });
        } else {
          // this.props.history.push(
          //   "/pr2pay/" + this.props.match.params.companyId + "/" + "my-actions"
          // );
        }
      }
    );
  }
  printUserList(unassignedUserData) {
    return Object.keys(unassignedUserData.data).map(list => {
      return (
        <tr key={list}>
          <td className={styles["text-left"]}>
            {unassignedUserData.data[list].firstName +
              " " +
              unassignedUserData.data[list].lastName}
          </td>
          <td className={styles["text-left"]}>
            {unassignedUserData.data[list].email}
          </td>
          <td className={styles["text-left"]}>
            {unassignedUserData.data[list].mobile}
          </td>
          {this.props.accessRole!==''&&this.props.accessRole.privileges['user-create']===true? <td
            className={styles["text-left"]}
            onClick={() =>
              this.editRoles("edit-users", unassignedUserData.data[list].id,'unassigned-user')
            }
          >
            <a>View/Edit</a>
          </td>:null}
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <Loading isLoader={this.state.isLoading} />
        <div className={style.pageBar + " " + styles.paginations}>
          <span className={style.heading}>
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
            className={
              styles.center +
              " " +
              style.viewPerPage +
              " " +
              mainStyle.flex +
              " " +
              (this.state.userCount < 11 ? mainStyle.hide : "")
            }
          >
            <span className={style.heading}>View</span>
            <Dropdown
              name="viewPerPage"
              options={this.state.viewPerPage}
              style={{ margin: "0px 5px" }}
              value={this.state.itemsPerPage}
              change={this.viewPageChange}
            />
            <span className={style.heading}>Per Page</span>
          </div>
        </div>

        <div className={styles.tableDiv}>
          <table className={styles.tableLayout}>
            <thead>
              <tr className={styles["text-left"]}>
                <th>Name</th>
                <th>Email Id</th>
                <th>Phone No.</th>
                {this.props.accessRole!==''&&this.props.accessRole.privileges['user-create']===true? <th>Access Right(S)</th>:null}
              </tr>
              {this.state.userCount === 0 ? (
                <tr className={styles.white}>
                  <td colSpan="4">
                    {" "}
                    <p className={styles.textCenter}>
                      All users have already been assigned.Please check assigned
                      tab for more information.
                    </p>
                  </td>
                </tr>
              ) : null}
            </thead>

            {this.props.companyID !== "" &&
            this.state.unassigneUserDetails !== "" &&
            this.state.unassigneUserDetails !== null &&
            this.state.unassigneUserDetails !== undefined ? (
              <tbody>
                {this.printUserList(this.state.unassigneUserDetails)}
              </tbody>
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
export default withRouter(connect(mapStateToProps)(UnassignedUserList));
