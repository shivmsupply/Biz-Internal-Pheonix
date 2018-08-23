import React, { Component } from 'react';
// import ReactDom from 'react-dom';
import $http from '../utils/Http';
import { withRouter } from 'react-router-dom';
import ENV_VARIABLE from "../utils/Environment";
import * as CommonApi from '../common/CommonApi/commonApi';
import { connect } from 'react-redux';
import '../assets/styles/style.css';
// import DatePicker from "a-react-datepicker";
import DatePicker from "a-react-datepicker";
import * as commonActions from "../actions/LoginActions";

import "../assets/styles/components/viewComparatives.css";
import '../assets/styles/components/viewEnquiry.css';
import './SelectSupplier';
// import Loading from '../common/Loading/Loading';

class EnquiryDetails extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            accordionData:true,
            jsonData: {},
            customFields:[],
            dateInfo:'',
            editDate:false,
            supplierInfo :[]
        }

        this.updateDate=this.updateDate.bind(this)
        this.routeParam =this.props.match.params;
        let _breadCrumb=[
            {displayName:'PR2Pay',navigation:''},
            {displayName:'View-Enquiry',navigation:'/pr2pay/'+this.props.match.params.companyId+'/view-enquiries'},
            {displayName:this.routeParam.enquiryId,navigation:''}
        ]
        const { dispatch } = this.props;
        dispatch(commonActions.setBreadCrumb(_breadCrumb,false))
        
        window.scrollTo(0,0);
    }

    updateDate=()=>{
            let enterpriseId = this.props.match.params.enterpriseId
            let companyId = this.props.match.params.companyId;
            let projectId = this.props.match.params.projectId;
            let enquiryId = this.props.match.params.enquiryId;
            // api.stg.msupply.biz/rfq/phoenix/enterprise/enterpriseId/company/:companyId/inquiry/:inquiryId/date
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/enterprise/'+enterpriseId+'/company/'+companyId+'/inquiry/'+enquiryId+'/date',JSON.stringify({
            "respondByDate": new Date(this.state.dateInfo).setHours(23,59,59,59)
        }),res=>{
            this.getInfo()
        })
    }
    // static count = 0;
    mappingFields(enquiry) {
        
        let customField = {
            customTextFiled:[],
            customLineItems:[]
        };
         enquiry.config.enquiryCustomFields.map((key,index) =>{
            //  if(enquiry[key.fieldName])
            if(enquiry[key.fieldName])
            customField.customTextFiled.push(<li key={index} className="width50 flexWrap"><label>{key.fieldName +": "}</label><span className="detailEllipse">{enquiry[key.fieldName]}</span></li>  )        
            // else{
            //     return
            // }
        })
        enquiry.config.enquiryLineItemCustomFields.map((key,index) =>{
            if(key.enabled==true){
                customField.customLineItems.push(<th key={index}>{key.fieldDisplayName}</th>)
            }
        })

        return customField;
    }

    goBack() {
        this.props.history.goBack();
    }
    goToComparatives() {
        let companyId = this.props.match.params.companyId;
        let enquiryId = this.props.match.params.enquiryId;
        this.props.history.push("/pr2pay/" + companyId + '/detail-comparative/'+ enquiryId);
    }
    toggleAccordion() {
        let accordionFlag = this.state.accordionData;
        this.setState({
            accordionData: !accordionFlag
        })
    }
    // dateReverse(date) {
    //     return (date.split("-").reverse().join("-"))
    // }
    convertDate(inputDate) {
        function pad(s) {return(s<10)?'0'+s:s;}
        var d = inputDate.getTime();
        return d;
    }
    updateDate() {
        let companyId = this.props.match.params.companyId;
        let enquiryId = this.props.match.params.enquiryId;
        let dateBody = {
            "respondByDate":1531180800000,
            "deliveryByDate":1531180800
        }
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+"rfq/inquiry/" + companyId+"/" + enquiryId +"/date",(dateBody),(res)=>{  

        })
    }

    getSupplierInfo() {
        // api.stg.msupply.biz/rfq/phoenix/fetchInquiryDetailsForFloat/EQ-0003-1808-0082
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/fetchInquiryDetailsForFloat/'+ this.props.match.params.enquiryId ,(res)=>{
            // debugger
            let supplierData = res.message.floatToSupplier;
            // debugger
            let arrayTemp = {}
            // debugger
            supplierData.map((key,index)=>{
                arrayTemp[key.subCategory]={
                    supplierNameArray:key.suppliers.map(_O=>{
                        return _O.companyName;
                    })
                }
                
               
            // })debu

                // debugger
            })
            this.setState({supplierInfo:arrayTemp})
        })
    }
    componentDidMount() {
        // debugger
        this.getInfo()
        this.getSupplierInfo()
    }
    getInfo(){
        let companyId = this.props.match.params.companyId;
        let enterpriseID = this.props.match.params.enterpriseId;
            let projectId = this.props.match.params.projectId;
            let enquiryId = this.props.match.params.enquiryId
            $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/enterprise/'+enterpriseID+'/company/'+companyId+'/project/'+projectId+'/inquiry/'+ enquiryId ,(res)=>{
                let t=this.state;

                this.dateL=res.message.respondByDate.substring(0,10).split('-').reverse().join('-')
                t['dateInfo']=''
                //  t['dateInfo']=new Date(res.message.respondByDate).getTime()
                t['jsonData']=res.message
                t['editDate']=false;
                this.setState(t);
        })
    }
    render(){
        // this.accordionFun()
        let enquiryCustomDetails;
        let enquiryData = {...this.state.jsonData} 
        {Object.keys(this.state.jsonData).length ? 
            enquiryCustomDetails=this.mappingFields(this.state.jsonData): null}         
        let shippingData = {...this.state.jsonData.shippingAddress}
        let paymentTerms = {...this.state.jsonData.paymentTerms}
        let [deliveryDate,quoteInfo] = [this.state.jsonData.deliveryByDate,this.state.jsonData.suppliersQuotedCount]
        // let enquiryDataDate = new Date(enquiryData.respondByDate);
        return (
            <div className="mainDiv">
                <div className="enqDetDiv">
                    <div className="enquiryAccordion" >
                        <ul>

                            <li><label>Enquiry Id : </label><span><b>{enquiryData.id}</b></span></li>
                            <li><label>Project Name : </label><span>{enquiryData.associatedProjectName}</span></li>
                            <li><label>Status : </label>
                            {enquiryData.inquiryStatus==="New"?<span>RFQ Submitted</span>:null}
                            {enquiryData.inquiryStatus==="Submitted"?<span>Enquiry Floated</span>:null}
                            {enquiryData.inquiryStatus==="ComparativeReceived"?<span>Quote Received</span>:null}
                            {enquiryData.inquiryStatus==="Closed"?<span>Closed</span>:null}
                            </li>
                            <li><label>Raised on : </label><span>{CommonApi.dateConvert(enquiryData.inquiryTimestamp)}</span></li>
                            <li><span><img onClick={this.toggleAccordion.bind(this)} src={ENV_VARIABLE.IMAGE_URL+'dropDown_arrow.svg'} className={!this.state.accordionData ? "rotated" : ""} /></span></li>

                        </ul>
                        
                    </div>
                    {this.state.accordionData ? <div className="accordionPanel">
                    <ul className="width80">
                            <li>
                            <label>Purchase Requisition Number : </label> <span> {enquiryData.referenceInquiryId} </span>
                            </li>
                            <li><label>Mapping Enquiry Id : </label> <span>{enquiryData.mappingInquiryId}</span></li>
                        </ul>
                        <div className="flex">
                        
                          
                          
                            <ul className="width80">
                            
                                {enquiryCustomDetails?enquiryCustomDetails.customTextFiled.map((key)=>{
                                    return key;
                                }):null }
                            </ul>
                            <div className="width20">
                                  <ul>
                                    <li>
                                        <label>Enquiry Validity: </label>
                                        
                                        {enquiryData &&!this.state.editDate?<span>{this.dateL}</span>:null }
                                        {enquiryData &&this.state.editDate? <span>
                                        <DatePicker selected={this.state.dateInfo} minDate={new Date()} name = "dateInfo"
                                          onSelect = {(date,name)=>{
                                                var submitData = this.state;
                                                submitData[name] = this.convertDate(date);
                                                this.setState(submitData);
                                            }}
                                           style={{width:"90%"}}/>
                                        
                                    </span>:null}
                                    {enquiryData.inquiryStatus!="Closed"&&this.props.match.params.companyId!="ero" && !this.state.editDate?<a onClick={()=>{
                                        let t=this.state;
                                        t['editDate']=true;
                                        this.setState(t)
                                    }} style={{    marginLeft: '10px'}} >Extend</a>:null}

                                    {this.state.editDate?<a onClick={this.updateDate} >Submit</a>:null}
                                    {this.state.editDate?<a onClick={()=>{
                                        let t=this.state;
                                        t['editDate']=false;
                                        this.setState(t);
                                    }} style={{marginLeft: '10px'}}>Close</a>:null}
                                    
                                    
                                    </li>
                                    
                                </ul>  
                            </div>
                        </div>
                    </div> :null}
                </div>
                <div>
                    <table cellPadding="0" cellSpacing="0" className="compTable">
                        <thead>
                            <tr>
                                <th width="4%">Sl No.</th>
                                <th width="15%">Product Name</th>
                                <th>Spec</th>
                                <th>Brand</th>
                                <th>Quantity</th>
                                <th>UOM</th>
                                <th>Target Price</th>
                                <th>Remarks</th>
                                {enquiryCustomDetails?enquiryCustomDetails.customLineItems:null}
                                
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.jsonData.inquiryStructured ? this.state.jsonData.inquiryStructured.inquiryParams.map((key, index)=>{
                                return <tr key={index}>
                                    <td>{index+1}</td>
                                    <td title={key.productName} className="detailEllipse">{key.productName}</td>
                                    <td title={key.productSpecs} className="detailEllipse">{key.productSpecs}</td>
                                    <td title={key.brand} className="detailEllipse">{key.brand}</td>
                                    <td title={key.quantity} className="detailEllipse">{key.quantity}</td>
                                    <td title={key.quantityUnit} className="detailEllipse">{key.quantityUnit}</td>
                                    <td title={key.targetPrice} className="detailEllipse">{key.targetPrice}</td>
                                    <td title={key.itemRemarks} className="detailEllipse">{key.itemRemarks}</td>
                                    {this.state.jsonData.config.enquiryLineItemCustomFields.map((customField, index)=>{
                                        return <td key={index} title={key[customField.fieldName]} className="detailEllipse">{key[customField.fieldName]}</td>
                                    })}

                            </tr>}): null }
                        </tbody>
                    </table>
                </div>
                {enquiryData.inquiryStatus!="Closed"?<div><a onClick={()=>{
                    // debugger;
                    this.props.history.push('/select-supplier/'+this.props.match.params.enterpriseId+'/'+this.props.match.params.companyId+'/'+this.props.match.params.projectId+"/"+this.props.match.params.enquiryId+"/?&categories="+this.state.jsonData.categories+"&city="+this.state.jsonData.shippingAddress.city )}}>Add Supplier</a>
                </div>:null}
                <div>
                <table>
                    <thead>
                      <tr>
                        {/* <th width="20%"></th> */}
                        <th width="20%">SubCategory</th>
                        <th width="20%">Supplier Name</th>
                        {/* <th width="20%">Type</th> */}
                        {/* <th width="20%">Brand</th> */}
                      </tr>
                    </thead>
                    <tbody>   
                      {this.state.supplierInfo ?
                       Object.keys(this.state.supplierInfo).map((item,indx)=> 
                       <tr>
                            <td>{item}</td>
                            <td>{this.state.supplierInfo[item] ? this.state.supplierInfo[item].supplierNameArray.join(', ') : "" }</td> 
     
                        </tr>

                      ):null }
                           
                    </tbody>
                </table>
                </div>
                <div className="addressDetails">
                    <div className="shipAdd">
                        <label>Delivery Address : </label>
                        <p>{shippingData.firstName} {shippingData.lastName} {shippingData.addressLine1}, {shippingData.addressLine2}, {shippingData.city}, {shippingData.state} </p>
                    </div>
                    <div>
                        <ul>
                            <li><label>Payment Terms : </label>
                        <span>{paymentTerms.advance +"%" + " "+ "Advance" + ", " + (100-paymentTerms.advance) + "% " + "Credit" } </span></li>
                         <li><label>Payment Schedule : </label>
                        <span> {paymentTerms.creditType}</span></li> 
                        <li><label>Credit Days : </label>
                        <span>{paymentTerms.creditSchedule1 ? paymentTerms.creditSchedule1 + ' Days' : " -"} </span></li>
                        </ul>
                    </div>
                    <div><ul>
                            <li><label>Expected Delivery Date : </label>
                        <span>{deliveryDate ? CommonApi.dateConvert(deliveryDate): " -"}</span>
                        </li>
                        <li><label>Quote received from : </label>
                        <span>{quoteInfo ? quoteInfo : "  -"} </span></li>
                        </ul>
                        </div>
                </div>
                <div>
                    <ul className="flex">
                        <li><button onClick={this.goBack.bind(this)} className="normalBtn">Back</button></li>
                        {/* <li><button onClick={this.updateDate.bind(this)}>Save Changes</button></li> */}
                        {/* {quoteInfo ? <li><button onClick={this.goToComparatives.bind(this)} className={styles.normalBtn}>View Comparative</button></li>:null} */}
                    </ul>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
	return {
		// allState:state.storeState.stateInfo,
		companyDetails: state.companyDetailReducer,
     }
}

export default withRouter(connect(mapStateToProps)(EnquiryDetails));