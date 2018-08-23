// import React,{ Component } from 'react';
// import {withRouter} from 'react-router-dom';
// import * as commonActions from "../../actions/commonActions";
// import { connect } from "react-redux";

// import ENV_VARIABLE from "../../Util/Environment";


import React,{ Component } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import  '../../assets/styles/components/shipment.css'
// import $http from '../../utils/Http';
import ENV_VARIABLE from '../../utils/Environment';
import combineClass from "classnames";
import * as commonActions from "../../actions/LoginActions";
// import Modal from '../../Modal/Modal';
// import Loading from '../../common/Loading/Loading';
// import * as CommonApi  from '../../common/CommonApi/commonApi';


import ListData from "../../containers/ListData"

 class ViewShipment extends Component{
    constructor(props){
        super(props);
        this.clickShipment = this.clickShipment.bind(this);
		this.clickForGRN = this.clickForGRN.bind(this);
		 let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Shipment & GRN',navigation:'shipment'},
        ]
		const { dispatch } = this.props;
        dispatch(commonActions.setBreadCrumb(_breadCrumb,true));
        this.state = {
		uniqueFilters : {
		"projectIds":[],
		"statuses":[],
		"supplierIds":[],
		"companyIds":[],
		"customerIds":[]
		
		},
		
		tabs:[{"label":"Upcoming Shipments", "value":"open"}, {"label":"Past Shipments", "value":"closed"}],
		tableKeys :[{
			"headerName" : "Shipment No.",
			"key" : "id",
			"onClickFunction" :this.clickShipment
		},{
			"headerName" : "Date",
			"key" : "date"
		},
		{
			"headerName" : "Project Name",
			"key" : "customerInformation.projectName"
		},{
			"headerName" : "PO No.",
			"key" : "poId"
		},{
			"headerName" : "Ref. PO No.",
			"key" : "poReferenceId"
		},{
			"headerName" : "Status",
			"key" : "status"
		},
		{
			"headerName" : `Shipment Amount (${String.fromCharCode(8377)})`,
			"key" : "shipmentAmount",
			"classN":"textRight"
		},
		{
			"headerName" : `GRN Amount (${String.fromCharCode(8377)})`,
			"key" : "GRNTotal",
			"classN":"textRight"
		},
		{
			"headerName" : "GRN",
			"key" : "GRN",
			"onClickFunction" :this.clickForGRN
		}],
		breadCrumbs :[{"displayName":"PR2Pay","link":"/"},{"displayName":"Shipment & GRN", "link":"shipment"}]
		}
		if(this.props.match.params.companyId !== 'ero'){
		  this.serviceName=ENV_VARIABLE.HOST_NAME+"po2grn/shipment/shipments/"+this.props.match.params.companyId
		  this.filterServiceName=ENV_VARIABLE.HOST_NAME+"po2grn/shipment/filters/"+this.props.match.params.companyId
		 
		}
		else{
			this.serviceName=ENV_VARIABLE.HOST_NAME+"po2grn/shipment/shipments";
			this.filterServiceName=ENV_VARIABLE.HOST_NAME+"po2grn/shipment/filters";
			 
		}
		
		
        
    }
    componentDidMount(){
    }
    
	clickShipment(item){
		
		
		this.props.history.push("shipment-detail/"+item.customerInformation.companyId+"/"+item.customerInformation.projectId+"/"+item.id)
	}
	clickForGRN(item){
		if(item.GRNReceived){
					this.props.history.push("view-grn/"+item.customerInformation.companyId+"/"+item.customerInformation.projectId+"/"+item.id)

		}
		else{
					this.props.history.push("create-grn/"+item.customerInformation.companyId+"/"+item.customerInformation.projectId+"/"+item.id)

		}
	
	}
	componentWillReceiveProps(){
		
		
		
	}

    render(){
		
        return <div>
	{
			(this.props.userSelectedCompany.companyId!= ''||this.props.match.params.companyId == 'ero') && this.props.sessionInfo!=undefined?
     <ListData placeHolder = "Search by Shipment Id" breadCrumbs= {this.state.breadCrumbs} sessionInfo = {this.props.sessionInfo} userSelectedCompany = {this.props.userSelectedCompany}tabs= {this.state.tabs}  responseName = "shipments" uniqueFilters = {this.state.uniqueFilters} tableDataType = "Shipments" tableKeys = {this.state.tableKeys} serviceName = {this.serviceName} filterService = {this.filterServiceName}/> 
	:null}
		   
		   </div>

    }
}
const mapStateToProps = state => {
	
  return {
    userSelectedCompany:state.companyDetailReducer,
	States : state.storeState.stateInfo,
	sessionInfo:state.storeSession.loginDetail
   }
}
export default withRouter(connect(mapStateToProps)(ViewShipment));
