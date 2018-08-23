import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from '../../common/FormElements/FormElements'
import * as allAction from '../../actions/FilterActions' 

class FilterList extends Component{
    constructor(props){
        super(props);
        this.state={
            companyDetail: [],
            GroupDetail:[],
            plantDetail:[]
        }
       
    }
  handleChange=(d,e)=>{
    this.updateUrl('enterprise',e.data)
    const {dispatch}=this.props;
    dispatch(allAction.updateEnterpriseId(e.data));
    dispatch(allAction.getCompany(e.data));
  }

  
  updateUrl=(type,data)=>{
      if(type=='enterprise'){
        let _url=this.props.location.pathname.split('/',3)
          _url[2]=data;
           this.props.history.push(_url.join('/')+this.props.location.search)
      }
      if(type=='company'){
        let _url=this.props.location.pathname.split('/',4)
        _url[3]=data;
        this.props.history.push(_url.join('/')+this.props.location.search)
      }
      if(type=='project'){
        let _url=this.props.location.pathname.split('/',5)
        _url[4]=data;
        this.props.history.push(_url.join('/')+this.props.location.search)
      }
       console.log(this.props);
      
  }
    render(){
        return(
            <div className="filterMenu">
                <div className="filterControls">
                    
                    <div className="filterG">
                        <Dropdown 
                            name="enterprice_name"
                            label="Select Enterprise"
                            value={this.props.filterDetail.selectedEnterprise}
                            options={this.props.filterDetail.enterpriseOptions.map(ob=>{
                                    return  {label:ob.enterpriseName,value:ob.id}
                             })}
                            change={this.handleChange.bind(this)}
                        />
                    </div>

                    <div className="filterG middle_drop">
                        <Dropdown 
                            name="enterprice_name"
                            label="Select Company"
                            value={this.props.filterDetail.selectedCompany}
                            options={this.props.filterDetail.companyOptions.map(ob=>{
                                    return {
                                        label:ob.companyName,
                                        value:ob.id
                                    }
                             })}
                            change={(e,d)=>{
                                const {dispatch}=this.props;
                                dispatch(allAction.updateCompanyId(d.data));
                                dispatch(allAction.getProject(this.props.filterDetail.selectedEnterprise,d.data))
                               this.updateUrl('company',d.data)
                            }}        
                        />
                    </div>

                    <div className="filterG">
                        <Dropdown 
                            name="enterprice_name"
                            label='Select Project'
                            value={this.props.filterDetail.selectedProject}
                            options={this.props.filterDetail.projectOptions.map(ob=>{
                                return {
                                    label:ob.projectName,
                                    value:ob.id
                                    }
                            })}
                            change={(e,d)=>{
                                const {dispatch}=this.props;
                                dispatch(allAction.updateProjectId(d.data));
                                this.updateUrl('project',d.data)
                            }} 
                        />                
                    </div>

                </div>
            </div>    
        );
    }
}

const mapStateToProps = state => {
   
  return {
      filterDetail:state.FilterReducer
    // isLogin:state.storeSession.isLogin,
    // loginDetail:state.storeSession.loginDetail,
    // companyID: state.companyDetailReducer.companyId
  	}
}

export default withRouter(connect(mapStateToProps)(FilterList));