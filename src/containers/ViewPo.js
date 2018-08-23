import React from "react";
import { connect } from "react-redux";
import ListData from "./ListData";
import ENV_VARIABLE from "../utils/Environment";
import { withRouter } from "react-router-dom";
import '../assets/styles/listPo.css' 


class ViewPOs extends React.Component {	
    constructor(props){
        super(props);
        debugger;
        window.scrollTo(0,0);
		this.clickPO = this.clickPO.bind(this);
		 let _breadCrumb=[{displayName:'PR2Pay'},
        {displayName:'View Purchase Orders',navigation:'list-po'},
        ]
		const { dispatch } = this.props;
        var _ur=window.location.pathname.split('/');
		
		this.state = {
		filterServiceName:"",
		tabs:[{"label":"Open Orders", "value":"open"}, {"label":"Past Orders", "value":"closed"}],
		tableKeys :[{
				"headerName" : "PO ID",
				"key" : "poId",
				"onClickFunction" :this.clickPO
			},{
				"headerName" : "Date Created",
				"key" : "date"
			},{
				"headerName" : "PO Ref. No.",
				"key" : "poReferenceNumber"
			},
			{
				"headerName" : "PR Number",
				"key" : "prNumber"
			},
			{
				"headerName" : "Order Status",
				"key" : "status"
			},{
				"headerName" : "Project",
				"key" : "customerInformation.projectName"
			},
			{
				"headerName" : "User",
				"key" : "customerInformation.customerName"
			},
			{
				"headerName" : `Amount (${String.fromCharCode(8377)})`,
				"key" : "amount",
				"classN":"textRight"
			}],
			breadCrumbs :[{"displayName":"PR2Pay"},{"displayName":"POs", "navigation":"/list-po"}]		
		}
		if(this.props.match.params.companyId !== 'ero'){
		  this.serviceName=ENV_VARIABLE.HOST_NAME+"po2grn/phoenix/po/pos/"+(this.props.match.params.enterpriseID != undefined ? this.props.match.params.enterpriseID +"/"  : "")+(this.props.match.params.companyId != undefined ? this.props.match.params.companyId +"/"  : "")+(this.props.match.params.projectId != undefined ? this.props.match.params.projectId +"/"  : "")
		  this.filterServiceName=ENV_VARIABLE.HOST_NAME+"po2grn/phoenix/po/filters/"+(this.props.match.params.enterpriseID != undefined ? this.props.match.params.enterpriseID +"/"  : "")+(this.props.match.params.companyId != undefined ? this.props.match.params.companyId +"/"  : "")+(this.props.match.params.projectId != undefined ? this.props.match.params.projectId +"/"  : "")
		
		}
		    
    }   

    clickPO(item){
		this.props.history.push("/view-po/"+item.customerInformation.enterpriseId+"/"+item.customerInformation.companyId+"/"+item.customerInformation.projectId+"/"+item.poId+"/"+item.amendmentNumber);
	}

    componentWillReceiveProps(nextProps){
			
		if(this.props.sessionInfo!=undefined && this.props.sessionInfo.loginDetail!=undefined&& this.props.sessionInfo.loginDetail != ''){
			this.setState({loginInfo :this.props.userSelectedCompany});
		}
		
		this.serviceName=ENV_VARIABLE.HOST_NAME+"po2grn/phoenix/po/pos/"+(this.props.match.params.enterpriseID != undefined ? this.props.match.params.enterpriseID +"/"  : "")+(this.props.match.params.companyId != undefined ? this.props.match.params.companyId +"/"  : "")+(nextProps.match.params.projectId != undefined ? nextProps.match.params.projectId +"/"  : "")
		this.filterServiceName = ENV_VARIABLE.HOST_NAME+"po2grn/phoenix/po/filters/"+(this.props.match.params.enterpriseID != undefined ? this.props.match.params.enterpriseID +"/"  : "")+(this.props.match.params.companyId != undefined ? this.props.match.params.companyId +"/"  : "")+(nextProps.match.params.projectId != undefined ? nextProps.match.params.projectId +"/"  : "")
		
		
		
		
		
	}

    

    render()
    {
		
		return(
		
			<div>
				{(this.props.userSelectedCompany.companyId!= ''||this.props.match.params.companyId == 'ero') && this.props.sessionInfo!=undefined?
				<ListData breadCrumbs= {this.state.breadCrumbs} userSelectedCompany = {this.props.userSelectedCompany} sessionInfo = {this.props.sessionInfo}
				responseName = "pos" tabs={this.state.tabs}  tableDataType = "Orders" tableKeys = {this.state.tableKeys} serviceName = {this.serviceName} 
				filterService = {this.filterServiceName}/>
				:null}  
		  </div>
		   
        )
    }
	

    
}
const mapStateToProps = state => {
	
  return {
    userSelectedCompany:state.companyDetailReducer,
	States : state.storeState.stateInfo,
	sessionInfo:state.storeSession.loginDetail,
	filterReducer:state.FilterReducer
   }
}
export default withRouter(connect(mapStateToProps)(ViewPOs));
