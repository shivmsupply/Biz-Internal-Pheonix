import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import ENV_VARIABLE from "../../utils/Environment";
import $http from "../../utils/Http";
import { Dropdown, Checkbox } from "../../common/FormElements/FormElements";


class AssignRoles extends Component {

  constructor(props) {
    super(props);
    this.state ={
      selectProject:false,
      projectInfo : "",
      projectArray: [],
      roles:[],
      viewRoles:"",
      selectedRoles:'',
      countProject:0,
      selectedAllInfo:'',
    
    }
    this.selectId = this.selectId.bind(this);
   // console.log("assignrole---->", this.props.match.params);
  }

  gotoUserList(gotoList) {
    this.props.history.push("/pr2pay/" + this.props.companyID + "/" + gotoList);
  }
  
  gotoCreateUser() {
   
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
            this.isFirst=Object.keys(res.message.authorizations).length;
            if(this.isFirst>0){
            this.setState({selectedRoles:res.message.authorizations[this.props.match.params.companyId]?res.message.authorizations[this.props.match.params.companyId].role:[]})
           
          }
          debugger
            this.setState({selectedAllInfo:res.message});
             
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
          if(this.isFirst>0){
            this.selectRoles("notFirst",this.state.selectedRoles);
          }
        }
      }
    );
  }


  selectRoles = (e, d) =>{
   
    let _temp=this.state
    if(e=='notFirst')_temp["selectedRoles"]=d;
    else _temp["selectedRoles"]=d.data;
    var selectedRolesData, sortedAssociatedPrivileges;
    for (let i = 0; i < this.state.roles.length; i++) {
      if (this.state.roles[i].id === _temp["selectedRoles"]) {
        //selectedRolesData = this.state.roles[i];
        var displayData=Object.values(this.state.roles[i].privilegesUI);

        if(displayData.length>0){
          sortedAssociatedPrivileges = displayData.sort(function(a,b) {return a.displayOrder - b.displayOrder});
        }
      }
    } 
    
    _temp["viewRoles"]=sortedAssociatedPrivileges;
     this.setState(_temp);
  }

  selectId(event, projectId) {
    debugger
    let _temp=this.state;
    if(!_temp.selectedAllInfo.authorizations[this.props.match.params.companyId])
    _temp.selectedAllInfo.authorizations[this.props.match.params.companyId]={
      projects:[]
    };
    debugger
    if (event.target.checked === true) {
      _temp.selectedAllInfo.authorizations[this.props.match.params.companyId].projects.push(projectId)
      // this.state.projectArray.push(projectId);
      this.setState({
        // countProject: this.state.projectArray.length
        countProject:_temp.selectedAllInfo.authorizations[this.props.match.params.companyId].projects.length
      });
    } else {
      let ind=_temp.selectedAllInfo.authorizations[this.props.match.params.companyId].projects.indexOf(projectId)
      _temp.selectedAllInfo.authorizations[this.props.match.params.companyId].projects.splice(ind,1);
    }
    this.setState(_temp);
  }
  
  getProjectNameAndId(projectInfo) {
    return Object.keys(projectInfo).map(info => (
      <div key={info} className="selectproject">
        <Checkbox
          id={info}
          name="selectProject"
          onChange={event => this.selectId(event, projectInfo[info].id)}
           checked={this.state.selectedAllInfo!=''&&this.state.selectedAllInfo.authorizations[this.props.match.params.companyId]&&this.state.selectedAllInfo.authorizations[this.props.match.params.companyId].projects.indexOf(projectInfo[info].id)>-1}
        />
        <p className="mar-left-30">{projectInfo[info].projectName}</p>
      </div>
    ));
  }

  assignRole=()=>{
    console.log(this.state);
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
                  value={this.state.selectedRoles}
                  options={this.state.roles.map(obj => {
                    return { label: obj.displayName, value: obj.id };
                  })}
                  change={(e, d) => this.selectRoles(e, d)}
                />
              </p>
              <button className="commonbtnCss">Add New Role</button>
            </div>
            {this.state.viewRoles!==''?
            <div> 
           {this.state.viewRoles&&Object.keys(this.state.viewRoles).map((keyValue)=>
            <div className="rolesdata" key={keyValue}>
              <div>{this.state.viewRoles[keyValue].displayName}
            </div>
              {Object.keys(this.state.viewRoles[keyValue].associatedPrivileges).map((obj, authorizationKey)=>
            <div key={authorizationKey} className='mar-left-20'>
              <p>{this.state.viewRoles[keyValue].associatedPrivileges[authorizationKey].displayName}</p>
            </div>)}
           {this.state.viewRoles[keyValue].associatedPrivileges.length>0?null:<p>--</p>}
            </div>
            )}
          </div>:null}
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
            onClick={this.assignRole}
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