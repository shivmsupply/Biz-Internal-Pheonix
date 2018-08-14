import React, { Component } from "react";
import styles from "./companiesselction.css";
import Modal from "../../common/Modal/Modal";
import $http from '../../utils/Http';
import ENV_VARIABLE from '../../utils/Environment';
import { connect } from 'react-redux';
import { Dropdown, Button } from "../../common/FormElements/FormElements";
import { Link, withRouter } from "react-router-dom";

function newState() {
  this.companySelection = true;
  this.companyId = "";
  this.slectedCompany = true;
  this.interpriseError='required';
  this.companyError='required';
  this.formSubmitted=false;
}
class CompaniesSelection extends Component {
  constructor(props) {
    super(props);
    this.state = new newState();
    console.log("comp details", this.props);
    this.enterpiseList=this.props.allEnterprise.map(o=>{ return {label:o.enterpriseName,value:o.id}})
    debugger;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmilt=this.handleSubmilt.bind(this);
    this.getAllCompany=this.getAllCompany.bind(this);
  }
  getAllCompany=(_eId)=>{
    $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'census/phoenix/enterprise/'+_eId+'/company',(res)=>{
      console.log(res.message);
      let _t=this.state
      debugger
      this.allComapnyList=res.message;
      this.companyArray=res.message.map(o=>{return {label:o.companyName,value:o.id}})
      this.setState(_t)
      
  }) 
  }
  handleChange(e, d) {
    var temp = this.state;
    temp[e.target.name] = d.data;
    debugger;
    if(e.target.name == "interprise"){
      
      temp['interpriseError']=d.error;
    }
    if(e.target.name == "companyId")temp['companyError']=d.error;
    if(e.target.name == "interprise")this.getAllCompany(e.target.value)
    this.setState(temp);
    
  }
  handleSubmilt(){
    this.props.storeEnterprise(this.enterpiseList,this.companyArray,this.state.interprise,this.state.companyId)
  }

  companyArray=[];
  render() {
    return (
      <Modal
        height={"auto"}
        header="Select Enterprise and Company"
        isOpen={this.state.slectedCompany}
        onClose={() => {
          this.setState({ slectedCompany: false });
          this.props.closeModal();
        }}
        backDropClose={false}
        crossBtn={false}
      >
      
        <ul style={{minHeight: '200px'}}>
          <li className={styles.copmselection}>
            {/* <p className={styles.font}>Select Enterprise</p> */}
           <div>
            <Dropdown 
              name="interprise"
              label="Select Enterprise"
              value={this.state.interprise}
              change={this.handleChange}
              options={this.enterpiseList}
              submitted={this.state.formSubmitted}
              errorMessage={this.state.interpriseError}
            />
            {/* <p className={styles.font}>Select Comapny</p> */}

            {this.companyArray.length>0?<Dropdown 
              name="companyId"
              label="Select Comapny"
              value={this.state.companyId}
              change={this.handleChange}
              options={this.companyArray}
              submitted={this.state.formSubmitted}
              errorMessage={this.state.companyError}
            />:null }
            {this.state.notSelected===true?<p className={styles.errorMsg}>Please Select the company</p>:null}
            </div>
           {this.state.companyId.length>0?<button
              className={styles.proceed}
              onClick={() => this.handleSubmilt()}>
              Proceed
            </button>:null} 
          </li>
        </ul>
      </Modal>
    );
  }
}
const mapStateToProps = state => {
  debugger
  return {
	}
}
export default withRouter(connect(mapStateToProps)(CompaniesSelection));

// export default withRouter(CompaniesSelection);
