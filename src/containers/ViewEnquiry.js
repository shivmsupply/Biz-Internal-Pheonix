import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {Link} from 'react-router-dom';
const queryString = require('query-string');
// import DatePicker from "a-react-datepicker";
import $http from '../utils/Http';
import {withRouter} from 'react-router-dom';
import ENV_VARIABLE from "../utils/Environment";
import { Text,Button, Dropdown } from '../common/FormElements/FormElements';
// import style from "../viewComparatives.css";
import * as CommonApi from '../common/CommonApi/commonApi';
// import * as commonActions from "../../actions/commonActions";
import Loading from '../common/Loading/Loading';

import { connect } from 'react-redux';

import { debug } from 'util';

import { saveAs } from '../utils/FileSaver';
class ListEnquiry extends Component {

    constructor(props){
        super(props)
        this.state={
            userList:[],
            statusData:[], 
            projectList:[], 
            appliedFilter:{"userId":"",
                "inquiryStatus":"",
                "projectId":"",
                "fromDate":"",
                "toDate":"",
                "textField":""},    
            listData:"",
            inquiryCount:0,          
            inquiryCurrentStatus:["Submitted","New","ComparativeReceived"],
            sortValue:[{"label":"10","value":10},{"label":"20","value":20},{"label":"30","value":30}],
            tabActiveName:"open",
            hideTabs:false,
            itemsPerPage:10,
            totalEnquiries:0,
            pageNumber:0,
            dateError:"",
            currentStatus:["Submitted","New","ComparativeReceived"]
        }   
        window.scrollTo(0, 0);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.applyFilters = this.applyFilters.bind(this);
        this.resetBtn = this.resetBtn.bind(this);
        let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'View-Enquiries',navigation:''}]
        const { dispatch } = this.props;
        // dispatch(commonActions.setBreadCrumb(_breadCrumb,true));  
        this.handlePageNumber = this.handlePageNumber.bind(this); 
         this.incre = this.incre.bind(this);
        this.decre = this.decre.bind(this);
    }


    apiCallFunc(val,value) {
        // debugger
        this.setState({isLoading:true})
        let inquiryS ;
        let firstHalfUrl;
        let companyId='';
        // let currentStatus = this.state.currentStatus
        // let applyFilterData = this.state.appliedFilter;
        let apiUrl ="";
        // //debugger;
        let applyFilterData1 = this.state.appliedFilter;
        if(this.state.tabActiveName != val) {
            this.state.pageNumber = 0;
            let applyFilterData = this.state.appliedFilter;
            applyFilterData={"userId":"","inquiryStatus":"","projectId":"","textField":"","toDate":"","fromDate":""};
            this.props.location.search="";
            this.props.history.push(this.props.location.pathname);
        }
        let statusEnquiry = val == "closed"?  "Closed" :  this.state.inquiryCurrentStatus;
       this.state.currentStatus = statusEnquiry
        // this.setState({currentStatus:statusEnquiry})
       
        
        this.state.tabActiveName =val;
        if(this.props.match.params.companyId === 'ero') {
            firstHalfUrl = "rfq/phoenix/enterprise/"+this.props.match.params.enterpriseId +'/company/'+ this.props.match.params.companyId+'/inquiries?itemsPerPage='+this.state.itemsPerPage+"&pageNumber="+this.state.pageNumber
        }
        else{
            let companyId = this.props.match.params.companyId; 
            firstHalfUrl = "rfq/phoenix/enterprise/"+this.props.match.params.enterpriseId +'/company/'+ this.props.match.params.companyId+'/inquiries/?itemsPerPage='+this.state.itemsPerPage+"&pageNumber="+this.state.pageNumber
        }
        
        // var filterUrl = new URLSearchParams(this.props.location.search);
        let filterObj = this.state.appliedFilter;
        var filterUrl=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search)));
        for(let idx in filterUrl) {
            
            if(idx!=""&&filterUrl[idx]!=null)
            {filterObj[idx]=filterUrl[idx]}
            
        }
        // //debugger
        if(typeof(filterUrl.fromDate)== "string"&&new Date(filterUrl.fromDate) != 'Invalid Date'){
            filterUrl.fromDate=new Date(filterUrl.fromDate)
        }
        if(typeof(filterUrl.toDate)== "string"&&new Date(filterUrl.toDate) != 'Invalid Date'){
            filterUrl.toDate= new Date(filterUrl.toDate)
        }
        
        filterObj['fromDate']= filterUrl.fromDate == undefined?'':new Date(Number(filterUrl.fromDate))
        filterObj['toDate']=  filterUrl.toDate == undefined?'': new Date(Number(filterUrl.toDate))
        if(Object.keys(filterUrl).length === 0) {
            
            $http.getWithUrl(ENV_VARIABLE.HOST_NAME+ firstHalfUrl + "&inquiryStatus=" + value ,(res)=>{
            //    debugger
                this.setState({listData:res.message.inquiryList,
                inquiryCount : res.message.totalInquiriesCount,isLoading:false});
            })
        }
        else{
            if((filterUrl["inquiryStatus"]==undefined && filterUrl["textField"]==undefined) || (filterUrl["inquiryStatus"]=="" && filterUrl["textField"]=="")){
                for(let key in filterUrl){
                    if(filterUrl[key] != ''&&filterUrl[key] != null&&filterUrl[key] != undefined) {   
                        apiUrl=apiUrl.concat('&').concat(key).concat('=').concat(filterUrl[key]);
                    }
                }
                apiUrl = apiUrl + "&" + "inquiryStatus=" + statusEnquiry;
            }
            else if(filterUrl["textField"]!=undefined && filterUrl["textField"]!=""){
               
                apiUrl = apiUrl.concat('&')+"textField="+filterUrl["textField"];
            }
            else{
                for(let key in filterUrl){
                    if(filterUrl[key] != ''&&filterUrl[key] != null&&filterUrl[key] != undefined) {
                        if((key== 'fromDate'&& typeof(filterUrl[key])== 'object')|| (key== 'toDate'&& typeof(filterUrl[key])== 'object')){
                         apiUrl=apiUrl.concat('&').concat(key).concat('=').concat(new Date(filterUrl.fromDate).getTime());
                           //console.log(key, typeof(filterUrl[key])) 
                        }else  
                        apiUrl=apiUrl.concat('&').concat(key).concat('=').concat(filterUrl[key]);
                    }
                }
            }
            
            $http.getWithUrl(ENV_VARIABLE.HOST_NAME+ firstHalfUrl + apiUrl ,(res)=>{
                this.setState({listData:res.message.inquiryList,
                inquiryCount : res.message.totalInquiriesCount,isLoading:false})
            })
        }
            
    }

    filtersApi() {
        let userListArray = [];
        let statusArr =[];
        let projectArray = [];
        let companyId='';
        if(this.props.match.params.companyId==='ero'){
             companyId = "";
        }
        else{
             companyId = this.props.match.params.companyId;}
        this.setState({isLoading:true})
        // api.stg.msupply.biz/rfq/phoenix/enterprise/:enterpriseId/company/:companyId/filters
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/enterprise/'+this.props.match.params.enterpriseId+'/company/'+companyId+'/filters', (res)=>{
            
            let filterData = res.message;
            filterData.usersInfo.map((key)=>{
                userListArray.push({
                    "label":key.userName,
                    "value":key.customerId
                })
            })
            filterData.customerInquiryStatus.map((key)=>{
                if(key.systemStatus!='Closed'&& key.systemStatus!='Saved'){
                    statusArr.push({
                        "label":key.uiStatus,
                        "value":key.systemStatus
                    })
                }
            })
            filterData.projectList.map((key)=>{
                projectArray.push({
                    "label":key.projectName,
                    "value":key.projectId
                })
            })
            this.setState({userList:userListArray,
                            statusData:statusArr,
                            projectList:projectArray,isLoading:false});
            // this.setState({statusData:statusArr});   
            // this.setState({projectList:projectArray})
        })
    }

    handleChangeDate(item,name) {
        CommonApi.convertFromDate(item);
        var subData = this.state.appliedFilter;
        if(name =="fromDate"){
            subData[name] = CommonApi.convertFromDate(item)
        }
        else if(name =="toDate"){
            subData[name] = CommonApi.convertToDate(item);
        };
        this.setState({appliedFilter:subData})
    }
    convertDateMillis(date) {
        return new Date(date).getTime();
    }

    componentDidMount() {
        this.filtersApi();
        this.apiCallFunc(this.state.tabActiveName,this.state.inquiryCurrentStatus);       

    }

    handleChange(e) {
        // //debugger;
        let databody=this.state.appliedFilter;
        // if(typeof(databody.fromDate) == "object"){
        //     databody.fromDate=new Date(databody.fromDate)
        // }
        // if(typeof(databody.toDate) == "object"){
        //     databody.toDate=new Date(databody.toDate)
        // }
        databody[e.target.name] = e.target.value;
        this.setState({appliedFilter:databody})
    }
    applyFilters(){

        let isFilter=Object.keys(this.state.appliedFilter).filter(o=>{
            if(o == "fromDate"|| o == "toDate") return this.state.appliedFilter[o]>0?true:false;
            return this.state.appliedFilter[o].length>0
         })
         if(isFilter.length == 0)return;

        let val;
        let queryUrl ='?';
        
        
        let userId = this.state.appliedFilter.userId;
        let inquiryStatus = this.state.appliedFilter.inquiryStatus;
        
        if(typeof(this.state.appliedFilter.fromDate) == "object"){
            this.state.appliedFilter.fromDate=new Date(this.state.appliedFilter.fromDate).getTime()
        }
        if(typeof(this.state.appliedFilter.toDate) == "object"){
            this.state.appliedFilter.toDate=new Date(this.state.appliedFilter.toDate).getTime()
        }
        let projectId = this.state.appliedFilter.projectId; 
        for(let key in this.state.appliedFilter){
            if(this.state.appliedFilter[key] != ''&&this.state.appliedFilter[key] != null&&this.state.appliedFilter[key] != undefined) {   
            queryUrl=queryUrl.concat('&').concat(key).concat('=').concat(this.state.appliedFilter[key]);
            }
        }
        // if(inquiryStatus===""){
        //     queryUrl = queryUrl.concat('&').concat('inquiryStatus').concat('=').concat(this.state.inquiryCurrentStatus)
        // }
        this.props.history.push(this.props.location.pathname+ queryUrl);
        if(inquiryStatus==="Closed") {
            val="closed"
        }
        else {
            val = "open"
        }

          if(this.state.appliedFilter.fromDate !="" && this.state.appliedFilter.toDate ==""){
            return;
          } 
          if(this.state.appliedFilter.fromDate =="" && this.state.appliedFilter.toDate !=""){
            return;
          }
          else if(this.state.appliedFilter.fromDate > this.state.appliedFilter.toDate){
            this.state.dateError ="To Date should be greater than From Date";
          }
          else{
            this.state.pageNumber = 0;
            
            this.state.dateError ="";
            this.props.location.search=queryUrl
            // //debugger
            if(this.state.appliedFilter.inquiryStatus!=''){
            this.state.tabActiveName = 'open'}
            // this.setState({pageNumber:page})
            this.apiCallFunc(this.state.tabActiveName, queryUrl);
            //console.log(this.state);
          }
    }
    resetBtn(){
        let getFilters = this.state.appliedFilter; 
        let page = this.state.pageNumber;
        page = 0;  
        this.state.dateError ="";
        getFilters={"userId":"","inquiryStatus":"","projectId":"","textField":"","toDate":"","fromDate":""};
        this.setState({appliedFilter:getFilters,hideTabs:false,pageNumber:page})
        this.props.location.search="";
        this.props.history.push(this.props.location.pathname);
        this.apiCallFunc("open",this.state.inquiryCurrentStatus);
    }

     searchInquiry(){
         if(this.state.appliedFilter.textField===undefined||this.state.appliedFilter.textField===""){
             return
         }
         
        let queryUrl = "?"
        let getFilters = this.state.appliedFilter;
        getFilters={"userId":"","inquiryStatus":"","projectId":"","toDate":"","fromDate":"","textField":this.state.appliedFilter.textField};
        this.setState({appliedFilter:getFilters,hideTabs:true});
      
        // for(let key in this.state.appliedFilter){
        //     if(this.state.appliedFilter[key] != ''&&this.state.appliedFilter[key] != null&&this.state.appliedFilter[key] != undefined) {   
        //     queryUrl=queryUrl.concat('&').concat(key).concat('=').concat(this.state.appliedFilter[key]);
        //     }
        // }
        queryUrl = queryUrl.concat('&').concat("textField").concat('=').concat(this.state.appliedFilter.textField);
        this.props.location.search=queryUrl;
        this.props.history.push(this.props.location.pathname + this.props.location.search);
        // this.state.tabActiveName = null;
       
        this.apiCallFunc(this.state.tabActiveName, queryUrl);
     }
    //  downloadEnquiry() {
         
    // this.setState({isLoading:true})
    //     $http.getWithUrl(ENV_VARIABLE.HOST_NAME+"rfq/reports/inquiries" ,(res)=>{
    //         var blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
	// 		saveAs(blob, 'Enquiry Report - ' + new Date() + '.xlsx');

    //         this.setState({isLoading:false})
    //       window.focus();
    //     },true);  
    //  }

     decre(){
        let pageValue = this.state.pageNumber;
        pageValue = pageValue-1;    
        this.handlePageNumber(pageValue,"pageNumber");     
      }      
      incre(){
        let pageValue = this.state.pageNumber;
        pageValue = pageValue+1;        
        this.handlePageNumber(pageValue,"pageNumber") 
      }
      handlePageNumber(item,name) {
        if(name ==="pageNumber"){
          var subData = this.state;   
          subData[name] =  item;   
        }else{
          var subData = this.state;   
          subData[item.target.name] =  JSON.parse(item.target.value);
        }
        if(this.state.appliedFilter.inquiryStatus) {
        this.state.currentStatus = this.state.appliedFilter.inquiryStatus;}
        this.setState(subData);
        // //debugger
        this.apiCallFunc(this.state.tabActiveName, this.state.currentStatus);
      }
      eroSaved(status,key) {
        //   //debugger
          if(this.props.match.params.companyId === 'ero' && status === 'Saved') {
            return;
          }
          else if(this.props.match.params.companyId != 'ero' && status === 'Saved'){
            this.props.history.push('/pr2pay/' + this.props.match.params.companyId +'/enquiries/create-enquiry/'+key.associatedProjectId + '/' + key.id)
          }
          else {
              debugger
            this.props.history.push('/detail-enquiries/'+this.props.match.params.enterpriseId+"/"+key.associatedCompanyId +"/"+key.associatedProjectId+ '/' + key.id)
          }
      }
    render() {
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

        return (           
                <div className="mainScreen"> <Loading isLoader={this.state.isLoading} />
                    <div className="pullSearch">
                    <input type="search" name="textField" onKeyPress={this.searchEnquiry} 
                           value={this.state.appliedFilter.textField}className="inputSearch"
                           placeholder="Search by Enquiry Id or PR Number"
                           onChange={this.handleChange} />
                        <img onClick={this.searchInquiry.bind(this)} src={ENV_VARIABLE.IMAGE_URL + "if_icon-111-search_314478.svg"} width="25px" style={{top:"-10px"}}/>
                    </div>
                    <div className="applyFilter">
                    
        {this.state.dateError !== "" ? <p className="alignCenter error">{this.state.dateError}</p>:null}
                    <ul className="flex flexAend"> 
                        {/* <li><Dropdown name="projectId" placeholder="Project" change={this.handleChange} options={this.state.projectList} value={this.state.appliedFilter.projectId} /></li> */}
                        <li><Dropdown name="inquiryStatus" placeholder="Status" change={this.handleChange} options={this.state.statusData} value={this.state.appliedFilter.inquiryStatus} /></li>
                        <li><Dropdown name="userId" placeholder="User" change={this.handleChange} options={this.state.userList} value={this.state.appliedFilter.userId} /></li>
                        {/* <li><DatePicker name="fromDate" maxDate={currentDate} selected={this.state.appliedFilter.fromDate} label="From Date" onSelect={this.handleChangeDate} /></li> */}

                        {/* <li><DatePicker name="toDate"maxDate={currentDate} selected={this.state.appliedFilter.toDate} label="To Date" onSelect={this.handleChangeDate} /></li> */}

                        <li><button className="applyBtn button" onClick={()=>this.applyFilters("filter")}>Apply</button>
                        <button  className="resetBtn button" onClick={this.resetBtn}>Reset</button></li>
                    </ul>
                </div>
                {this.state.hideTabs === false ?
                <div className="width100">
                    <ul className="listTabs" style={{width:"60%",float:"left"}}>
                        <li style={{cursor:"pointer"}} onClick={()=>this.apiCallFunc("open",this.state.inquiryCurrentStatus)} className={this.state.tabActiveName ==="open"? "active":null}>Open Enquiries</li>
                        <li style={{cursor:"pointer"}} onClick={()=>this.apiCallFunc("closed",'Closed')} className={this.state.tabActiveName ==="closed"? "active":null}>Past Enquiries</li>
                        
                    </ul>
                    <div style={{width:'15%',float:'right',marginTop:'21px'}}>Total no. of Enquiries: <b>{this.state.inquiryCount}</b></div>
                </div>:null}
                <div>
                <table className="compTable">
                    <thead>
                        <tr>
                            <th width="15%">Enquiry Id</th>
                            <th width="10%">Date Created</th>
                            <th width="10%">Company</th>
                            <th width="10%">Project</th>
                            <th width="15%">Category</th>
                            <th width="10%">Status</th>
                            <th width="10%">PR Number</th>
                            <th width="10%">Users</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.inquiryCount > 0 ? this.state.listData.map((key)=>{
                                return <tr key={key.id}>
                                    <td title={key.id} className="ellipses" onClick={()=>this.eroSaved(key.inquiryStatus,key)} >
                                        <a>{key.id}</a></td>                                   
                                    <td title="" className="ellipses">{CommonApi.dateConvert(key.inquiryTimestamp)}</td>
                                    <td title={key.companyName}>{key.companyName}</td>
                                    <td title={key.associatedProjectName} className="ellipses">{key.associatedProjectName}</td>
                                    <td title={CommonApi.splitCamelCase(key.categories.join(','))} className="ellipses">{CommonApi.splitCamelCase(key.categories.join(','))}</td> 
                                    {/* {key.inquiryStatus == "Saved"? (<td className={style.ellipses}>Saved</td>):null} */}
                                    {key.inquiryStatus == "New"? (<td className="ellipses">RFQ Submitted</td>):null}
                                    {key.inquiryStatus == "Submitted"? (<td className="ellipses">Enquiry Floated</td>):null}
                                    {key.inquiryStatus == "ComparativeReceived"? (<td className="ellipses">Quote Received</td>):null}
                                    {key.inquiryStatus == "Closed"? (<td className="ellipses">Closed</td>):null}
                                    <td title={key.referenceInquiryId} className="ellipses">{key.referenceInquiryId}</td>
                                    <td title={key.customerFirstName + " "+ key.customerLastName} className="ellipses">{key.customerFirstName + " "+ key.customerLastName }</td>
                                </tr>
                                
                                
                            }) :<tr><td colSpan="8">No Enquiries Found</td></tr>}
                        </tbody>
                    </table>
                    <div>
                        <ul className="flex">
                            <li>Total no. of Enquiries: <b>{this.state.inquiryCount}</b></li>
                            
                            <li className="alignCenter">
                            {this.state.pageNumber > 0? <span className="pageLeft" onClick={this.decre}>&lt;</span>:null}
                                <input type="number" name="pageNumber" value={this.state.pageNumber+1} min="0" onChange={this.handlePageNumber} className="page" readOnly="true"/>
                                {((this.state.pageNumber+1)*this.state.itemsPerPage) < this.state.inquiryCount ? <span className="pageRight" onClick={this.incre}>&gt;</span>    :null}
                            </li>


                            <li>
                            <div className="itemsperPage">
                                <span>View </span>
                                <Dropdown options={this.state.sortValue} value={this.state.itemsPerPage} change={this.handlePageNumber} name="itemsPerPage"/>
                                <span> Per page</span>           
                            </div>
                            </li>
                        </ul>
                    </div>
                    {/* <p className={style.textRight}><a onClick={this.downloadEnquiry.bind(this)}>Download Enquiries</a></p> */}
                </div>
            </div>
        )
    }
}
export default  connect(null)(ListEnquiry);

