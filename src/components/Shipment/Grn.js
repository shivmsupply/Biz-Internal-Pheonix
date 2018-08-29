// import React,{ Component } from 'react';
// import {withRouter} from 'react-router-dom';
// import * as commonActions from "../../actions/commonActions";
// import * as CommonApi  from '../CommonApi/commonApi';
// import { connect } from "react-redux";
// import style from './shipment.css';
// import { Button,Text,Dropdown,TextArea,File } from '../FormElements/FormElements';
// import $http from '../../Util/Http';
// import combineClass from "classnames";
// import ENVIROMENT_VAR from '../../Util/Environment'
// import DatePicker from "a-react-datepicker";
// import Modal from "../Modal/Modal";
// import Loading from '../Loading/Loading';

import React,{ Component } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import  '../../assets/styles/components/shipment.css'
import $http from '../../utils/Http';
import ENVIROMENT_VAR from '../../utils/Environment';
import combineClass from "classnames";
import * as commonActions from "../../actions/LoginActions";
import Modal from '../../common/Modal/Modal';
import Loading from '../../common/Loading/Loading';
import * as CommonApi  from '../../common/CommonApi/commonApi';
import DatePicker from "a-react-datepicker";
import { Button,Text,Dropdown,TextArea,File } from '../../common/FormElements/FormElements';

function newState(){
    this.data={ referenceDate:''}
    this.error={referenceDate:'required',referenceDate12:'',referenceDate2:''}
    this.resonValue='';this.textReason='';this.lineIndex='';this.fileArray=[];
    this._isError2=false;this._isError1=false;this.shipmentShow=true;this.invoiceShow=false;
    this.additionalChargeShow=false;this.formSubmitted=false;this.isShowRemark=false;
    this.grnSuccessPopup=false;this.isLoading=false;this.createGrnError=[];
}

class ViewShipmentSetail extends Component{
    constructor(props){
        super(props);
        this.state=new newState();
        this.state['shipmentDoc']='';this.state['projectDetails']='';this.state['fileError']='';
        this.handleChangeLineItem=this.handleChangeLineItem.bind(this);
        this.createGrn=this.createGrn.bind(this);
        this.showRemark=this.showRemark.bind(this)
        this.handleChange=this.handleChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.removeFile=this.removeFile.bind(this);
		this.hideShowShipment = this.hideShowShipment.bind(this);
        this.routeParam =this.props.match.params;
        this.grnPopUpClose=this.grnPopUpClose.bind(this);
        this.downloadFile=this.downloadFile.bind(this);
        let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Shipment & GRN',navigation:'/pr2pay/'+this.routeParam.ShipmentCompanyId+'/shipment'},
        {displayName:this.props.match.url.includes('create-grn')?'Create GRN':'View-GRN',navigation:''}]
        const { dispatch } = this.props;
        dispatch(commonActions.setBreadCrumb(_breadCrumb,false));

    }
    grnPopUpClose(){
        
        this.setState({grnSuccessPopup:false});
    }
    fileArray=[];
    rejectionArray=[{label:'xxxxx',value:'xxxxxx'},{label:'yyy',value:'yyy'},{label:'Other',value:'Other'}]
    hideShowShipment(){
		var stateData = this.state;
		stateData.shipmentShow = !stateData.shipmentShow;
		stateData.data.referenceDate = new Date(stateData.data.referenceDate);
		this.setState(stateData);
	}
	handleChangeLineItem(e,d){
        var temp=this.state.shipmentDoc.lineItems;
        temp[e.target.id].GRN[e.target.name]=Number(d.data)>temp[e.target.id].qty?temp[e.target.id].GRN.rejectedQty:d.data;
        temp[e.target.id].error[e.target.name]=Number(d.data)>temp[e.target.id].qty?'Invalid GRN':d.error;
        if(temp[e.target.id].GRN['rejectedQty']>0&&temp[e.target.id].GRN['customerRemark'] == '')temp[e.target.id].error['customerRemark']='required';
        else temp[e.target.id].error['customerRemark']='';
        if(e.target.name == "rejectedQty"&&temp[e.target.id].GRN[e.target.name] === '')temp[e.target.id].error[e.target.name]='required';
        this.setState(temp);
    }
    setRemark(){
        var _t=this.state.shipmentDoc
       // _t.lineItems[this.state.lineIndex].GRN.customerRemark=this.state.resonValue != 'Other'?this.state.resonValue:this.state.textReason;
        _t.lineItems[this.state.lineIndex].GRN.customerRemark=this.state.textReason;
        _t.lineItems[this.state.lineIndex].error.customerRemark=_t.lineItems[this.state.lineIndex].GRN.customerRemark.length>0?'':'required';
        _t.resonValue=''; _t.textReason=''; _t['isShowRemark']=false;
        this.setState(_t);
    }
    handleChange(e,d){
        var temp=this.state;
        temp[e.target.name]=d.data;
        if(e.target.name == "resonValue"&&e.target.value!=='Other')temp['textReason']='';   
        this.setState(temp);
    }
    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
		var d = inputFormat;
		return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].reverse().join('-');
    }
    prodName;shipmentNo;rejQty;
    showRemark(_id,_obj){
        if(!_obj.GRN.rejectedQty>0)return;
        this.prodName=_obj.name;
        this.rejQty=_obj.GRN.rejectedQty;
        var _t=this.state;
        _t['lineIndex']=_id;_t['isShowRemark']=true;_t['resonValue'] == '';_t['textReason'] == ''
        // if(_obj.GRN.customerRemark.length != 0)this.rejectionArray.forEach((o)=>{if(o.value == _obj.GRN.customerRemark)_t['resonValue']=_obj.GRN.customerRemark})
        // if(_t['resonValue'] == ''){_t['textReason']=_obj.GRN.customerRemark;}
        // if(_obj.GRN.customerRemark.length != 0&&_t['resonValue'] == '')_t['resonValue'] = 'Other';
        _t['textReason']=_obj.GRN.customerRemark;
        this.setState(_t);
    }
    createGrn(){
        this.state['createGrnError']=[];
        this.setState({formSubmitted:true})
        var _isError1=Object.keys(this.state.error).filter((k)=>{return this.state.error[k].length>0;})
        if(_isError1.length>0){this.setState({_isError1:true});window.scrollTo(0,0);return;}
        var _isError2=this.state.shipmentDoc.lineItems.filter(obj=>{
            return Object.keys(obj.error).filter((k)=>{return obj.error[k].length>0;}).length>0
        });
        if(_isError2.length>0){this.setState({_isError2:true});window.scrollTo(0,0);return}
        else this.setState({_isError2:false})
        var _lineItem=this.state.shipmentDoc.lineItems.map((line)=>{
            return {"id":line.id,"rejectedQty": Number(line.GRN.rejectedQty),"remarks": line.GRN.rejectedQty.length>0?line.GRN.customerRemark:''}
        })
        let  _fileArr=this.fileArray.map(f=>{return f.key;})
        //console.log('attachment Key-->',_fileArr)
        var creatJson={
            "shipmentType" : "SIEMENS",
            "channel" : "INTERNAL_PANEL",
            "GRNReferenceDate" : new Date(this.state.data.referenceDate).getTime(),
            "supplierSatisfaction" : true,
            "lineItems":_lineItem,
            "attachmentFile":_fileArr
        }
        console.log(creatJson);
        this.setState({isLoading:true})
         debugger;
         
        $http.putWithUrl(ENVIROMENT_VAR.HOST_NAME+'po2grn/phoenix/grn/'+this.routeParam.companyId+'/'+this.routeParam.projectId+'/'+this.routeParam.ShipmentCompanyId,JSON.stringify(creatJson),(res)=>{
        if(res.http_code != 200){
            this.setState({createGrnError:res.message,isLoading:false})
            return
        }
        if(res.http_code == 200){
            this.setState({grnSuccessPopup:true,isLoading:false});
            //console.log('created----->',res.message);              
           }	
       })
    }
    invoiceDoc;withoutInvoice;
    getShipmentDetail(){
       this.setState({isLoading:true})
       debugger
       $http.getWithUrl(ENVIROMENT_VAR.HOST_NAME+'po2grn/phoenix/shipment/'+this.routeParam.ShipmentCompanyId,(res)=>{
        if(this.props.match.url.split('/').indexOf("create-grn")>-1)
        res.message.shipmentDoc.lineItems.map((obj)=>{
           obj['error']={
               rejectedQty:obj.GRN.rejectedQty>-1?'':'required',
               customerRemark:obj.GRN.rejectedQty>-1?'':'required'
            };
          })
          if(this.props.match.url.split('/').indexOf("view-grn")>-1);
          this.fileArray=res.message.shipmentDoc.GRN.files;
        
          this.invoiceDoc=res.message.invoiceDoc
          this.withoutInvoice=Object.keys(res.message.invoiceDoc)
          //console.log('chchh--->',this.withoutInvoice);
       this.setState({projectDetails:res.message.projectDetails,shipmentDoc:res.message.shipmentDoc,isLoading:false}) ; 
      })
    }
    componentDidMount(){
        this.getShipmentDetail()
    }
    handleFileChange(files, error){
            let _data=this.state;
            _data.fileError='';
            var formData = new FormData();
            formData.append('uploadFiles',files[0]);
            var request = new XMLHttpRequest();
            request.withCredentials = true;
            if(error!==''&&error.length>0){_data.fileError=error; this.setState(_data);return;}
            if(this.fileArray.length>=3){_data.fileError='Maximum 3 file can be upload';
            this.setState(_data);return;};
            request.open('POST',ENVIROMENT_VAR.HOST_NAME+'phoenix/util/uploadFile');
            request.onreadystatechange = () => { 
            if (request.readyState == 4){
                let data = this.state;
                this.fileArray.push(JSON.parse(request.responseText).message[0])
                //console.log(this.fileArray);
                this.setState(data);
            }
            }
            
            request.send(formData); 
    }
    removeFile(_i){
        this.fileArray.splice(_i,1);
        this.setState(this.state);

    }
    downloadFile=(obj,type)=>{
        
        this.setState({isLoading:true})
        if(this.props.location.pathname.indexOf('create-grn')>-1&&type=='grnFile')return;
        let serviceType=type=='invoiceFile'?{servieName:'invoice',cencious:'invoice2payments',isId:this.invoiceDoc.id}:{servieName:'shipment',cencious:'po2grn',isId:this.routeParam.shipmentId};
        $http.getWithUrl(ENVIROMENT_VAR.HOST_NAME+serviceType.cencious+'/'+serviceType.servieName+'/'+this.routeParam.ShipmentCompanyId+'/'+this.routeParam.projectId+'/'+serviceType.isId+'/downloadFile/'+type+'/'+obj.id,(res)=>{
         window.open(res.message)         
        this.setState({isLoading:false})
         //, 'download_window', 'toolbar=0,location=no,directories=0,status=0,scrollbars=0,resizeable=0,width=400,height=400,top=0,left=0');
        })
    }
   
    render(){
        let currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 1);
        var pageType=this.props.match.url.split('/').indexOf("create-grn")>-1?"create-grn":"view-grn";
        // var shipAccordionImg=combineClass(style.accordionImg,{[style.rotateImg]:this.state.shipmentShow});
        // var invAccordionImg=combineClass(style.accordionImg,{[style.rotateImg]:this.state.invoiceShow});
        // var AdiAccordionImg=combineClass(style.accordionImg,{[style.rotateImg]:this.state.additionalChargeShow});
        var shipAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.shipmentShow});
        var invAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.invoiceShow});
        var AdiAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.additionalChargeShow});
        var dateError=combineClass({"dateError":this.state._isError1});
       return <div>
       <Loading isLoader={this.state.isLoading} />
            {this.state.shipmentDoc != ''?
            <div className="container">
            
            <div className="topMargin"> 
             <div className="displayFlex invoiceflexWrap"> 
               <div className="width60"> 
                   <label>Shipment No.: &nbsp;</label>
                   <span className="hadingSpan"> {this.state.shipmentDoc.id}</span>
               </div>
               {/* <div> 
                   <label>Grn No:</label>
                   <span> GRN-1170-c-po-1</span>
               </div> */}
               <div className="detailWrap width30"> 
                  <label>Status:&nbsp;</label>
                  <span className="hadingSpan"> {this.state.shipmentDoc.status.current.status}</span>
              
                   {/* <a onClick={()=>this.setState({shipmentShow:!this.state.shipmentShow})}> IMG</a> */}
              </div>
              <div className="width10">  
                <img className={shipAccordionImg} src={require('../../assets/images/dropdown_icon.png')} onClick={this.hideShowShipment}/> 
              </div>
            </div>
            {this.state.shipmentShow?<div className="accordionContainer" >
            <div className="detailWrap width60"> 
                  <p> <label>Finalised Offer No : </label>
                   <span> {this.state.shipmentDoc.poId}</span></p>
                   <p> <label>Reference PO Number: </label>
                   <span> {this.state.shipmentDoc.poReferenceId}</span></p>
                   <p> <label>Project Name: </label>
                   <span> {this.state.shipmentDoc.customerInformation.projectName}</span>
                   </p>
            </div>
            <div className="detailWrap width30 dateWrapInput">  
                   <p> <label>Store Incharge: </label>
                   <span> {this.state.projectDetails.deliveryContact.name}</span></p>
                   <p> <label>Store Incharge Contact No: </label>
                   <span> {this.state.projectDetails.deliveryContact.mobile}</span></p>
                   <div className={dateError}> 
                   <label className="moveLeft" style={{lineHeight:pageType=='view-grn'?'':'3'}}>
                   Delivery Date: 
                   {pageType=='create-grn'?<span className="mandSymbol">*</span>:null} : </label>
                   {pageType=='view-grn'?
                   <span>&nbsp;{this.state.shipmentDoc.GRN.date?CommonApi.dateConvert(this.state.shipmentDoc.GRN.date):null}</span>:
                   <DatePicker maxDate={currentDate} style={{width:'120px',float:'left','marginLeft':'10px'}} selected={this.state.data.referenceDate} name='referenceDate' 
                        onSelect = {(date,name)=>{
                         var submitData = this.state;
                         submitData.data[name] = this.convertDate(date);
                         submitData.error[name] = submitData.data[name].length>0?'':'required';
                         submitData['_isError1']=false;
                         this.setState(submitData);
                      }}/>
                   }
                   </div>                  
            </div>
            <div className="width10">&nbsp;</div>
            </div>:null}</div>
            <div className="topMargin" style={{'marginBottom':'20px'}}> 
            <div className="displayFlex shipmentflexWrap"> 
               <div className="width30">
                   <label>Invoice No.: </label>
                   {this.withoutInvoice.length>0?<span> {this.invoiceDoc.id}</span>:<span>&nbsp;&nbsp;&nbsp;- </span>}
               </div>
               <div className="width30">
               <label>Delivery Challan(DC) No: </label>
                   <span className="hadingSpan"> {this.state.shipmentDoc.dc.id}</span>
              </div>
              <div className="width30"> 
                  <label>Dispatch Date: </label>
                <span className="hadingSpan">{this.state.shipmentDoc.referenceDate?CommonApi.dateConvert(this.state.shipmentDoc.referenceDate):null}</span>
                   {/* <a onClick={()=>this.setState({invoiceShow:!this.state.invoiceShow})}> IMG</a> */}
                  
              </div>
              <div className="width10">
              <img className={invAccordionImg} src={require('../../assets/images/dropdown_icon.png')} onClick={()=>this.setState({invoiceShow:!this.state.invoiceShow})}/>
                  
              </div>
            </div>
            {this.state.invoiceShow?<div className="accordionContainer">
            <div className="detailWrap width30"> 
                  <p> <label>Invoice Reference No:</label>
                  {this.withoutInvoice.length>0?<span> {this.invoiceDoc.referenceId}</span>:<span>&nbsp;&nbsp;&nbsp;- </span>}
                   </p>
                   <p> <label>Invoice Date:</label>
                   {this.withoutInvoice.length>0?<span> {this.invoiceDoc.date?CommonApi.dateConvert(this.invoiceDoc.date):null}</span>:<span>&nbsp;&nbsp;&nbsp;- </span>}</p>
                   <p> <label>Invoice Amount (&#8377;):&nbsp;</label>
                   {this.withoutInvoice.length>0?<span> {this.invoiceDoc.financeInfo.total}</span>:<span>&nbsp;&nbsp;&nbsp;- </span>}</p>
                   
                   {/* <p> <label>Invoice Attachments</label>
                   {this.withoutInvoice.length>0&&this.invoiceDoc.files.map((fileObj,ind)=>
                    <a onClick={()=>this.downloadFile(fileObj,'invoiceFile')} key={ind} className="width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.displayName} style={{width:'50%'}}> {fileObj.displayName}</a>
                   )} </p> */}
            </div>

            <div className="detailWrap width30">  
                  <p> <label>DC Date:&nbsp;</label>
                   <span> {this.state.shipmentDoc.dc.date?CommonApi.dateConvert(this.state.shipmentDoc.dc.date):null}</span></p>
                   {/* <p> <label>DC Attachments:</label>
                   {this.state.shipmentDoc.dc.files.map((fileObj,ind)=>
                   <a onClick={()=>this.downloadFile(fileObj,'DC')} key={ind} className="width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.displayName}> {fileObj.displayName}</a>
                   )}
                      </p> */}
                  
            </div>

            <div className="detailWrap width30" >   
                 <p> <label>Driver Name:&nbsp;</label>
                   <span> {this.state.shipmentDoc.driverDetails[0].name}</span></p>
                   <p> <label>Driver Contact No:&nbsp;</label>
                   <span> {this.state.shipmentDoc.driverDetails[0].mobile}</span></p>
                   <p> <label>Vehicle Number:&nbsp;</label>
                   <span> {this.state.shipmentDoc.driverDetails[0].vehicleNo}</span></p>
                   <p> <label>Weigh Bridge Challan:&nbsp;</label>
                   <span> {this.state.shipmentDoc.driverDetails[0].weighBridgeChallan}</span></p>
                   <p> <label>E Way Bill:&nbsp;</label>
                   <span> {this.state.shipmentDoc.ewbNumber}</span></p>
                   <p> <label>E Way Bill Date:&nbsp;</label>
                   <span> {this.state.shipmentDoc.ewbDate?CommonApi.dateConvert(this.state.shipmentDoc.ewbDate):null}</span></p>
                   {/* <p> <label>Test Certificate:</label>
                   {this.state.shipmentDoc.testCertificate.map((fileObj,ind)=>
                   <a onClick={()=>this.downloadFile(fileObj.files[0],'TC')} key={ind} className="width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.files[0].displayName}> {fileObj.files[0].displayName}</a>
                   )}
                   </p> */}
            </div>
            <div className="width10">&nbsp;</div>
            </div>:null}
            </div>
       {this.state._isError2?<div className="grnButton errorInfo"><p>Please add remarks for rejected line item quantity </p></div>:null}

           <div className="tableDiv" style={{width:'100%',margin:'0px'}}>
          <table className="compTable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>HSN Code</th>
                <th>Total Qty</th>
                <th>Dispatch Qty</th>
                <th>Rejected Qty</th>
                <th>Accepted Qty</th>                
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
            {this.state.shipmentDoc.lineItems.map((line,ind)=><tr key={ind}>
                <td title={line.name}>{line.name}</td>
                <td>{line.hsnCode}</td>
                <td>{line.totalQty}</td>
                <td>{line.qty}</td>
                <td className="errorMsgHide">{pageType=='view-grn'?line.GRN.rejectedQty:
                <Text labelWidth="0"  id={ind}  name="rejectedQty" value={line.GRN.rejectedQty} change={this.handleChangeLineItem} validation="numberAndDecimal" errorMessage={line.error.rejectedQty}
                        submitted={this.state.formSubmitted} />}</td>
                <td>{(line.qty-line.GRN.rejectedQty)}</td>
                <td className="errorMsgHide fileWrap2" >{pageType=='view-grn'?line.GRN.customerRemark:
                <a style={{opacity:line.GRN.rejectedQty>0?'':'0.5',cursor:line.GRN.rejectedQty>0?'pointer':'not-allowed'}}  onClick={()=>{this.showRemark(ind,line)}}>
                    {line.GRN.customerRemark.length&&line.GRN.rejectedQty>0?'View/Edit':'Add'}
                </a>

                /*<Text labelWidth="0"  id={ind}  name="customerRemark" value={line.GRN.customerRemark} change={this.handleChangeLineItem} validation="company" errorMessage={line.error.customerRemark}
                        submitted={this.state.formSubmitted} /> */
                        }
                </td>
            </tr>)}  
            
              
            </tbody>
          </table>
        </div>

        
        
        
         <div className="grnCharges" > 
           <div className="detailWrap width30">
             <label style={{'lineHeight': '2'}}  className="moveLeft">Attachments: </label>
             <div style={{'marginLeft': '10px'}} className="wid40 moveLeft">
             {pageType=='create-grn'?<File style={{width: '40%'}}  id="collateral" fileCount={3} onFileChange={this.handleFileChange} />:null} 
             
             </div>
             {this.fileArray.map((fileObj,ind)=>
             <div key={ind} title={fileObj.fileName} className="width60 moveRight fileDiv" style={{'marginRight': '18px'}}>
             <p className="fileWrap2 wid80"><a onClick={()=>this.downloadFile(fileObj,'grnFile')} >{fileObj.fileName}</a></p>
             {pageType=='create-grn'?<span className="crossimg" onClick={()=>this.removeFile(ind)}>X</span>:null}
             </div>)}

           {this.state.fileError.length>0?<div className="grnButton errorInfo"><p>{this.state.fileError}</p></div>:null   }
             
           </div> 

           {/* <div className="detailWrap+' '+style.extraInfo}>
             <p>
                 <label>Transportation (&#8377;)</label>
                 <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.shippingCostValue)} </span>
             </p>
             <p>
                 <label>Loading (&#8377;)</label>
                 <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.loadingValue)} </span>
             </p>
             <p>
                 <label>Unloading (&#8377;)</label>
                 <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.unloadingValue)}</span>
             </p>
             <p>
                 <label>Insurance (&#8377;)</label>
                 <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.insuranceValue)}</span>
             </p>

            
           </div>   */}
        </div> 
       {this.state.createGrnError.length>0?<div className="grnButton errorInfo">
       {this.state.createGrnError.map(o=><p>{o} </p>)}
       </div>:null}

          <div className="grnButton">
                <button onClick={()=>window.history.back()}>Back</button>
                {pageType !=='view-grn'?
                <button onClick={this.createGrn}>Submit</button>:null}
                {/* <button onClick={()=>//console.log('DOWNLOAD!!!!')}>Download</button>: */}

            </div>

            <Modal isOpen={this.state.isShowRemark} height={"auto"} header="Remarks" backDropClose={false} 
            onClose={() => {this.setState({ isShowRemark: false,textReason:'',resonValue:'' })}} crossBtn={true}> 
            <div style={{height: '200px',overflow: 'auto'}}>
            <div className="remarkPopUp"> 
            <p>
                <label>Product Name:</label><span className="rejectSpan">{this.prodName} </span>
            </p>
            <p>
                <label>Shipment No:</label><span className="rejectSpan">{this.routeParam.shipmentId} </span>
            </p>
            <p>
                <label>Rejected Qty:</label><span className="rejectSpan">{this.rejQty} </span>
            </p>
           
            {/* <p><label>Reason for Rejection</label></p> */}
            <div className="reasonWrap" style={{width: '100%',float:'left','marginLeft': '5px'}} >
            {/* <Dropdown  name='resonValue' label='Reason for Rejection' value ={this.state.resonValue}  change={this.handleChange}  options={this.rejectionArray}  /> */}
             <TextArea label='Reason for Rejection' placeholder="Enter reason for rejection" disable={false} style={{width: '256px'}} name='textReason' change={this.handleChange} value={this.state.textReason} validation={this.state.textReason} />
            </div>
            </div>
            </div>
            <div className="remarkBtn" style={{marginBottom:'20px'}}>
                <button onClick={() => {this.setState({ isShowRemark: false,textReason:'',resonValue:'' })}}>Cancel</button>
                <button onClick={this.setRemark.bind(this)}>OK</button>
            </div>
            

            
           
           </Modal>

                   
            </div>:null}
            <Modal
          height="150px"
          header="Successful"
        //   isOpen={true}
          isOpen={this.state.grnSuccessPopup}
          onClose={() => {
            this.setState({ grnSuccessPopup: false });
            this.props.closeModal();
          }}
          backDropClose={false}
          crossBtn={false}
        >
          {/* <p className={style['mar-top-10']}>GRN NO : <span className="grnNumber}>GR-11728-C-PO-1</span> for</p>
          <p className={style['mar-top-10']}>Shipment No : <span className="grnNumber}>GR-11728-C-PO-1</span></p> */}
          <p className='mar-top-10'>GRN has been created successfully</p>
          <button
            className="okbtn"
            onClick={() => {
                // let _temp=this.props
                // let _url=_temp.location.pathname.split('/');
                // _url[1]='shipment'
                // _url=_url.join('/')
                // console.log(_url)
                this.props.history.push('/shipment')
                this.grnPopUpClose();
                }}
          >
            OK
          </button>
        </Modal>
            
     </div>


    }
}
const mapStateToProps = state => {
	return {
		selectedCompany:state.companyDetailReducer.currentCompanyDetail,
		loginDetail:state.storeSession.loginDetail
	}
}
export default connect(mapStateToProps)(ViewShipmentSetail);

