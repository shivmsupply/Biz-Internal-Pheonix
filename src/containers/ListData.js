import React from "react";

const queryString = require('query-string');
import FilterData from './FilterData';
import $http from "../utils/Http";
import TableList from "./TableList"

// import style from "../../styles/main.css"
import {Button, Text, Dropdown, Radio} from "../common/FormElements/FormElements";
import Loading from '../common/Loading/Loading';

import ENV_VARIABLE from "../utils/Environment";
import { withRouter } from "react-router-dom";
import '../assets/styles/style.css';

  const  serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return ("?&"+str.join("&"))
}
class ListData extends React.Component {
    constructor(props){
        super(props);
        window.scrollTo(0,0);
		
		this.state = {
			appliedFilter:{"itemsPerPage":10,"pageNumber":0},
			itemsPerPageOptions : [{label:10, value:10}, {label:20, value:20}, {label:30, value:30}],
			responseLength:""
		}
		this.getFilteredData = this.getFilteredData.bind(this);
       this.applyFilter = this.applyFilter.bind(this);
	   this.resetFilter = this.resetFilter.bind(this);
	    this.getTableData = this.getTableData.bind(this);
		this.pageChange = this.pageChange.bind(this);
		this.changeDisplayType = this.changeDisplayType.bind(this);
		this.handleItemsPerPageChange = this.handleItemsPerPageChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCompanyChange = this.handleCompanyChange.bind(this);
		this.clickBreadCrumb = this.clickBreadCrumb.bind(this);
		this.searchForList = this.searchForList.bind(this);
		this.downloadArchivePos  =  this.downloadArchivePos.bind(this)
    }

    
	componentWillReceiveProps(nextProps){
		
		var stateData = this.state;
		
		if(!(stateData.filterService == nextProps.filterService && stateData.serviceName == nextProps.serviceName)){
		stateData.filterService = nextProps.filterService ;
		stateData.serviceName =  nextProps.serviceName ;
		
		this.setState(stateData);
		this.getFilteredData();
		this.setState({"displayType":"open"});
		}
		 
		
		
	}
    handleCompanyChange(companyId){
		var stateData = this.state;
		stateData.filterService = this.props.filterService +"/"+companyId;
		stateData.serviceName =  this.props.serviceName +"/"+companyId;
		this.setState(stateData);
		this.getFilteredData();
		
	}

   componentDidMount(){
	   var stateData = this.state;
		stateData.filterService = this.props.filterService ;
		stateData.serviceName =  this.props.serviceName ;
		this.setState(stateData);
	   this.getFilteredData();
	   this.setState({"displayType":"open"});
	  
	  
	}
	changeDisplayType(data){
		
		
		var stateData = this.state;
		stateData.displayType = data;
		stateData.appliedFilter = {"pageNumber":0, "itemsPerPage":10}
		stateData.appliedFilter.search = "";
		if(data == "open"){
			stateData.appliedFilter.status = stateData.openStatuses.join();
			
			
		}
		else if(data == "closed"){
			stateData.appliedFilter.status = stateData.closedStatuses.join();
			
		}
		
		var newURL=this.props.location;
        newURL.search = "?status="+stateData.appliedFilter.status;

		
		
        this.props.history.push(this.props.location.pathname+this.props.location.search);
        this.getFilteredData();
		
		this.setState(stateData);
		this.getTableData();
		
	}
	handleKeyPress(e){
		if(e.key == "Enter"){
			this.searchForList()
			
			
		}
	}
	searchForList(){
		var stateData = this.state
			stateData.appliedFilter= {
				"itemsPerPage" :10,
				"pageNumber" : 0,
				"search":this.state.appliedFilter.search
				
			}
			this.setState(stateData);
			var newURL=this.props.location
			newURL.search=serialize(this.state.appliedFilter);
			this.props.history.push(this.props.location.pathname+this.props.location.search);
			this.getFilteredData();
	}
	handleChange(e, data){
		var stateData= this.state;
		stateData.appliedFilter[e.target.name] = e.target.value;
		this.setState(stateData);
	}
	
	getFilteredData(){
	var filterUrl=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search)));
	
	    var stateData = this.state;
		
	   for(var key in filterUrl){
		   
		  if(filterUrl[key]!= undefined&&filterUrl[key]!= null && key != ''){
			   stateData.appliedFilter[key] = filterUrl[key];
		   }
		} 
		
	   this.setState(stateData);
	   this.getFilters();
	  
	}
	getTableData(){
		var k ="";
		var q = "?"
	for(k in this.state.appliedFilter){
		if(k!="companyId"){
			if(k == "fromDate" &&this.state.appliedFilter[k]!=''&&this.state.appliedFilter[k]!=undefined){
			q=  q+k+"="+new Date(this.state.appliedFilter[k]).setHours("0", "0", "0", "0")+"&"
		}
		
		else if(k=="toDate" &&this.state.appliedFilter[k]!=''&&this.state.appliedFilter[k]!=undefined)
			q=  q+k+"="+(new Date(this.state.appliedFilter[k]).setHours("0", "0", "0", "0")+86400000)+"&"
		else if(this.state.appliedFilter[k] !== ''){

			q = q+k+"="+this.state.appliedFilter[k]+"&"
		}
		}
		
		
	}

	q = q.substring(0, q.length - 1); 
	
	this.setState({isLoading:true})
		$http.getWithUrl(this.state.serviceName+q,(response)=>{
			
				this.setState({isLoading:false});
				if(response.http_code == 400){
					
				}
				else if(response.http_code == 404){
					
					var stateData = this.state;
					stateData.tableData = [];
					stateData.showTableData = true;
					stateData.responseLength = 0;
					this.setState(stateData);
					
				}else{
					this.setState({responseLength :response.message.count})
					var tableData = []
					if(this.props.tableDataType == "Orders")
						tableData = response.message[this.props.responseName];
					else if(this.props.tableDataType == "Shipments"){
						tableData = response.message[this.props.responseName];
					}
					else if(this.props.tableDataType == "Invoices"){
						tableData = response.message[this.props.responseName];
					}
					
					this.setState({tableData:tableData,showTableData : true})
					
				}
				
			})
	}
	getFilters(){
		
		$http.getWithUrl(this.state.filterService,(response)=>{
			this.setState({isLoading:false});
				if(response.http_code == 400){
					
				}
				else if(response.http_code == 404){
					
					var stateData = this.state;
					stateData.tableData = [];
					stateData.showTableData = true;
					this.setState(stateData);
				}
				
					else{

						
					var filterInfo = [];
					if(this.props.sessionInfo.isEnterpriseUser){
						var filter = {
								"label":"Select Company",
								"key":"companyId",
								"value":[]
							}
							Object.keys(this.props.sessionInfo.authorizations).map((item) =>{
								filter.value.push({
									"label":this.props.sessionInfo.authorizations[item].companyDetails.companyName,

									"value":this.props.sessionInfo.authorizations[item].companyDetails.id
								})
							})
							filterInfo.push(filter);
					}
					
					this.setState({openStatuses:response.message.openStatuses});
					this.setState({closedStatuses:response.message.closedStatuses});
					if(this.state.appliedFilter.status == response.message.closedStatuses.join(",")){
						this.setState({"displayType":"closed"})
					}
						
					for(var key in response.message){
						
						if(key == "users"){
							var filter = {
								"label":"Select User",
								"key":"customerId",
								"value":[]
								
							}
							response.message[key].map(function(item){
								filter.value.push({
									"label":item.customerName,
									"value":item.customerId
								})
							})
							filterInfo.push(filter);
						}
						if(key == "projects"){
							var filter = {
								"label":"Select Project",
								"key":"projectId",
								"value":[]
								
							}
							response.message[key].map(function(item){
								filter.value.push({
									"label":item.projectName,
									"value":item.projectId
								})
							})
							filterInfo.push(filter);
						}
						
						if(this.state.displayType == "open" ){
							var spliceIndex=""
							filterInfo.map((item, index) => {
								if(item.key == "status")
								{
										spliceIndex = index;
								}	
							})
							if(spliceIndex!="")
							filterInfo.splice(spliceIndex, 1);
							var filter = {
								"label":"Select Status",
								"key":"status",
								"value":[]
							}
							response.message["openStatuses"].map(function(item){
								filter.value.push({
									"label":item,
									"value":item
								})
							})
							filterInfo.push(filter);
						}
						else if(this.state.displayType == "closed"){
							var spliceIndex = ""
							filterInfo.map((item, index) => {
								if(item.key == "status")
								{
									spliceIndex = index;
								}	
							})
							if(spliceIndex!="")
							filterInfo.splice(spliceIndex, 1);
							var filter = {
								"label":"Select Status",
								"key":"status",
								"value":[]
							}
							response.message["closedStatuses"].map(function(item){
								filter.value.push({
									"label":item,
									"value":item
								})
							})
							filterInfo.push(filter);
						}
						
						
					}
					
					filterInfo.push({
						label:'From Date',
						key:'fromDate'
					},
					{
						label:'To Date',
						key:'toDate'
					})
					this.setState({filterInfo:filterInfo});
					var stateData = this.state;
					
					if(this.state.displayType == "open" && this.state.appliedFilter.status == undefined){
						stateData.appliedFilter.status = response.message.openStatuses.join(",");
					}
					this.setState(stateData);
					this.getTableData();
				}
				
			})
	}
	clickBreadCrumb(e){
		this.props.history.push(e.target.dataset.link)
	}
applyFilter(data){
	
        var newURL=this.props.location
        newURL.search=data;
		var appliedFilter = this.state.appliedFilter;
		appliedFilter.pageNumber = 0;
		this.setState({appliedFilter:appliedFilter})
        this.props.history.push(this.props.location.pathname+this.props.location.search);
        this.getFilteredData();
        
    }
    resetFilter(data){
		this.props.history.push(this.props.location.pathname);
		this.props.location.search = "";
		var temp=this.state.appliedFilter
        for(var i in this.state.appliedFilter){
			if(i!="itemsPerPage" && i != "pageNumber")
			temp[i]='';
		}
		if(this.state.displayType == "open")
			temp.status = this.state.openStatuses.join(",");
		else
			temp.status = this.state.closedStatuses.join(",");
		
		temp.pageNumber = 0;
		temp.itemsPerPage = 10;
        this.setState({appliedFilter:temp});
		var stateData = this.state;
		stateData.filterService = this.props.filterService;
		stateData.serviceName =  this.props.serviceName;
		this.setState(stateData);
		this.getFilteredData();
        //console.log('parents reset---->',data);
    }

pageChange(changeType){
	
	if(this.state.appliedFilter.pageNumber == 0 && changeType == "decrement")
		return;
	if(changeType == "increment"  && this.state.responseLength/this.state.appliedFilter.itemsPerPage< (parseInt(this.state.appliedFilter.pageNumber) + 1 ))
		return;
	
	
	var appliedFilter = this.state.appliedFilter;
	 if(changeType == "decrement"){
			appliedFilter.pageNumber = parseInt(appliedFilter.pageNumber) - 1;
		}
	else if(changeType == "increment"){
		appliedFilter.pageNumber = parseInt(appliedFilter.pageNumber) + 1;
	}
	this.setState({appliedFilter : appliedFilter});
	
	var newURL=this.props.location
    newURL.search=serialize(this.state.appliedFilter);
	this.props.history.push(this.props.location.pathname+this.props.location.search);
        this.getFilteredData();
	
}
handleItemsPerPageChange(e, data){
	
	var appliedFilter = this.state.appliedFilter;
	appliedFilter.itemsPerPage = data.data;
	appliedFilter.pageNumber = 0;
	this.setState({appliedFilter : appliedFilter});
	var newURL=this.props.location
    newURL.search=serialize(this.state.appliedFilter);
	this.props.history.push(this.props.location.pathname+this.props.location.search);
	this.getFilteredData();
	
}
downloadArchivePos(){
	window.open("https://static.msupply.biz/archive/Siemens_Archived_Data_01.xlsx");
}
    render()
    {
        return(
		 <div>
		 <Loading isLoader={this.state.isLoading} />
		 {/* {
			 this.props.breadCrumbs!=undefined?
			 <div style={{margin:"10px"}}>
			 {this.props.breadCrumbs.map((item, index)=>{
			 return <span style={{cursor:"pointer"}} data-link={item.link} onClick={this.clickBreadCrumb}> {index!=0 ? <img height="10px"width="10px" src={ENV_VARIABLE.IMAGE_URL+'arrow-right.png'} alt="BizLogo"/> : null } {item.displayName}</span>
			 })}
			 </div>:null
		 } */}
		 <div style={{width: "35%",margin: "0 64%"}} >

		<Text name="search" onKeyPress={this.handleKeyPress} change={this.handleChange}  style={{margin:"3% auto 0"}} 
		placeholder={this.props.placeHolder!= undefined ? this.props.placeHolder : "Search"} value={this.state.appliedFilter.search} className="noBorder"/>

		<img onClick = {this.searchForList} className="searchImage" src={ require('../assets/images/if_icon-111-search_314478.svg')} width="25px" alt="BizLogo"/>
		
		</div>
		{this.props.tableDataType == "Orders"?<div style={{width:"36%", float:"right"}}><a onClick = {this.downloadArchivePos}>Download Archive POs</a></div>:null}
		{this.state.filterInfo  ? <FilterData handleCompanyChange = {this.handleCompanyChange}sessionInfo = {this.props.sessionInfo} filterInfo={this.state.filterInfo}   applyFilter={this.applyFilter} resetFilter={this.resetFilter} /> : null }

			<div style={{float:"right",marginRight:"1%"}}>Total Number of {this.props.tableDataType} : {this.state.responseLength}</div>
{this.state.showTableData == true ? <TableList userSelectedCompany={this.props.userSelectedCompany} displayType = {this.state.displayType} changeDisplayType = {this.changeDisplayType}tabs={this.props.tabs}tableData = {this.state.tableData} tableKeys={this.props.tableKeys} /> : null}
		
		{this.state.showTableData==true && this.state.tableData.length == 0 ? <div style = {{marginTop: "5%",textAlign: "center", marginBottom: "5%", color: "#bd4931"}}>No Data Found</div> : null}
		{this.state.tableData != undefined  ?
		<div className = "pagination-container">
			<div style={{width:"8%", margin:"0 auto"}}>
				<span style={{paddingRight:"10px"}} onClick = {() =>{this.pageChange("decrement")}}><img style={{transform: "rotate(180deg)"}} src={require('../assets/images/arrow-right.png') } alt="increment"/></span><span className = "page-number"> {parseInt(this.state.appliedFilter.pageNumber) +1} </span><span  style={{paddingLeft:"10px"}}onClick = {() =>{this.pageChange("increment")}}><img className="companyLogo" src={require('../assets/images/arrow-right.png') } alt="increment"/></span>
			</div>
			<div style={{float:"left", marginLeft:"1%", marginBottom:"3%",marginTop:"-2%"}}>Total Number of {this.props.tableDataType} : {this.state.responseLength}</div>
			<div style={{float:"right", marginRight:"1%",width:"15%", marginBottom:"3%",marginTop:"-2%"}}>
				<span style={{position:"relative", top:"8px", float:"left",paddingRight:"8px"}}>View </span>
				<div style={{width:"44%", float:"left"}}> <Dropdown change = {this.handleItemsPerPageChange}options = {this.state.itemsPerPageOptions} 
				value = {this.state.appliedFilter.itemsPerPage}/></div>
				<span style={{position:"relative",float:"left", top:"8px"}}>per page </span>
			</div>
		
		</div>
		:null}
		
	</div> )
    }

    
}
export default withRouter(ListData)
