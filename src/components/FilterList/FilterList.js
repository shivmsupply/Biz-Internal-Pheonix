import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from '../../common/FormElements/FormElements'

class FilterList extends Component{
    constructor(props){
        super(props);
        this.state={
            companyDetail: [],
            GroupDetail:[],
            plantDetail:[]
        }
       
    }
  
    render(){
        return(
            <div className="filterMenu">
                <div className="filterControls">
                    
                    <div className="filterG">
                        <Dropdown 
                            name="enterprice_name"
                            
                            value=""
                            options={[{label:'check',value:'check'}, {label:'check',value:'check'}]}
                        />
                    </div>

                    <div className="filterG middle_drop">
                        <Dropdown 
                            name="enterprice_name"
                            value=""
                            options={[{label:'check',value:'check'}, {label:'check',value:'check'}]}
                        />
                    </div>

                    <div className="filterG">
                        <Dropdown 
                            name="enterprice_name"
                            
                            value=""
                            options={[{label:'check',value:'check'}, {label:'check',value:'check'}]}
                        />                
                    </div>

                </div>
            </div>    
        );
    }
}

const mapStateToProps = state => {
  return {
    // isLogin:state.storeSession.isLogin,
    // loginDetail:state.storeSession.loginDetail,
    // companyID: state.companyDetailReducer.companyId
  	}
}

const mapDispatchToProps = (dispatch) => {
	
  return {
	//  storeSession: (isLogin,loginDetail) => dispatch(commonActions.storeSession(isLogin,loginDetail)),
	//  storeState:(s)=>dispatch(commonActions.storeState(s)),
  //  storeCurrentCompanyDetail: (companyId,companyDetail,privileges) => dispatch(commonActions.storeCurrentCompanyDetail(companyId,companyDetail,privileges)),

   }
}
export default withRouter(connect(mapStateToProps,mapDispatchToProps)(FilterList));