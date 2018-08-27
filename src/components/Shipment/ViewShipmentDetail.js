import React,{ Component } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import  '../../assets/styles/components/shipment.css'
import $http from '../../utils/Http';
import ENVIROMENT_VAR from '../../utils/Environment';
import combineClass from "classnames";
import * as commonActions from "../../actions/LoginActions";
// import Modal from '../../Modal/Modal';
import Loading from '../../common/Loading/Loading';
import * as CommonApi  from '../../common/CommonApi/commonApi';

class ViewShipmentDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            shipmentDoc:"",
            shipmentShow:true,
            invoiceShow:true,
            additionalChargeShow:false
        }
        
    window.scrollTo(0, 0);
        this.routeParam =this.props.match.params;
        this.downloadFile=this.downloadFile.bind(this);
        let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'Shipment & GRN',navigation:'/pr2pay/'+this.routeParam.ShipmentCompanyId+'/shipment'},
        {displayName:this.routeParam.shipmentId,navigation:''}]
        const { dispatch } = this.props;
        dispatch(commonActions.setBreadCrumb("_breadCrumb",true));
    }
    invoiceDoc;totalLineItem;
    getShipmentDetail(){

    //   this.setState({isLoading:true})
      debugger
        $http.getWithUrl(ENVIROMENT_VAR.HOST_NAME+'po2grn/phoenix/shipment/'+this.routeParam.ShipmentCompanyId,(res)=>{
          let d= CommonApi.dateConvert(res.message.invoiceDoc.date)
          
      this.setState({isLoading:false})
          this.invoiceDoc= res.message.invoiceDoc ;
          this.shipmentConfig= res.message.config ;
          this.withoutInvoice=Object.keys(this.invoiceDoc).length;
          this.totalLineItem=0;
          res.message.shipmentDoc.lineItems.map(k=>{
            this.totalLineItem=this.totalLineItem+k.grandTotal
        })
        // res.message.shipmentDoc.ewbDate="2018-08-05T16:59:45.268Z";
         this.setState({shipmentDoc:res.message.shipmentDoc}) ; 


        })
     }
     componentDidMount(){
         this.getShipmentDetail()
     }

     downloadFile=(obj,type)=>{
       
      this.setState({isLoading:true})
       let serviceType=type=='invoiceFile'?{servieName:'invoice',cencious:'invoice2payments',isId:this.invoiceDoc.id}:{servieName:'shipment',cencious:'po2grn',isId:this.routeParam.shipmentId};
       $http.getWithUrl(ENVIROMENT_VAR.HOST_NAME+serviceType.cencious+'/'+serviceType.servieName+'/'+this.routeParam.ShipmentCompanyId+'/'+this.routeParam.projectId+'/'+serviceType.isId+'/downloadFile/'+type+'/'+obj.id,(res)=>{
        //console.log(obj,type);  
        let _url;
        if(type == 'invoiceFile')_url=res.urls;
        else _url=res.urls[0]
        window.open(_url, 'download_window', 'toolbar=0,location=no,directories=0,status=0,scrollbars=0,resizeable=0,width=400,height=400,top=0,left=0');
        window.focus();
        
        this.setState({isLoading:false})
      })
     }
    
   
    render(){
        var shipAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.shipmentShow});
        var invAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.invoiceShow});
        var AdiAccordionImg=combineClass("accordionImg",{"rotateImg":this.state.additionalChargeShow});
       return <div>
       <Loading isLoader={this.state.isLoading} />
            {this.state.shipmentDoc&&this.state.shipmentDoc != ""?
            <div className="container">
            <div className="topMargin"> 
             <div className="displayFlex invoiceflexWrap"> 
               <div className="width60">  
                   <label>Shipment No.:&nbsp;</label>
                   <span className="hadingSpan"> {this.state.shipmentDoc.id}</span>
               </div>
               <div className="width30"> 
                  <label>Shipment Status:&nbsp;</label>
                   <span className="hadingSpan"> {this.state.shipmentDoc.status.current.status}</span>
              </div>
              
              <div className="width10">      
                   <img className={shipAccordionImg} src={require('../../assets/images/dropdown_icon.png')} onClick={()=>this.setState({shipmentShow:!this.state.shipmentShow})}/>   </div>
            </div>
            {this.state.shipmentShow?<div className="accordionContainer" >
            <div className="detailWrap width60" >
                  <p> <label>Finalised Offer No:&nbsp;</label>
                   <span> {this.state.shipmentDoc.poId}</span></p>
                   <p> <label>Reference PO Number:&nbsp;</label>
                   <span> {this.state.shipmentDoc.poReferenceId}</span></p>
                   <p> <label>Project Name:&nbsp;</label>
                   <span> {this.state.shipmentDoc.customerInformation.projectName}</span></p>
            </div>
              <div className="width30"> 
                  <label>Expected Delivery Date:&nbsp;</label>
                   <span>{this.state.shipmentDoc.driverDetails[0].expectedDate?CommonApi.dateConvert(this.state.shipmentDoc.driverDetails[0].expectedDate):null}</span>
              </div>
              <div  className="width10">&nbsp;</div>
            </div>:null}</div>
            <div className="topMargin"> 
            <div className="displayFlex shipmentflexWrap"> 
               <div className="width30">  
                   <label>Invoice No.:&nbsp;</label>
                   {this.withoutInvoice>0?<span className="hadingSpan"> {this.invoiceDoc.id}</span>:<span>&nbsp;&nbsp;&nbsp;-</span>}
                   
               </div>
               <div className="width30"> 
                  <label>Delivery Challan(DC) No:&nbsp;</label>
                   <span className="hadingSpan"> {this.state.shipmentDoc.dc.id}</span>
              </div>
              <div className="width30">
                  <label>Dispatch Date:&nbsp;</label>
                   <span className="hadingSpan">
                   {CommonApi.dateConvert(this.state.shipmentDoc.referenceDate)}</span>                 
              </div>
              
              <div className="width10"> 
                   <img className={invAccordionImg} src={require('../../assets/images/dropdown_icon.png')} onClick={()=>this.setState({invoiceShow:!this.state.invoiceShow})}/> 
              </div>
            </div>
            {this.state.invoiceShow?<div className="accordionContainer">
            <div className="detailWrap width30">  
                  <p> <label>Invoice Reference No:&nbsp;</label>
                  {this.withoutInvoice>0?<span> {this.invoiceDoc.referenceId}</span>:<span>&nbsp;&nbsp;&nbsp;-</span>}</p>
                   <p> <label>Invoice Date:&nbsp;</label>
                   {this.withoutInvoice>0?<span> {this.invoiceDoc.date?CommonApi.dateConvert(this.invoiceDoc.date):null}</span>:<span>&nbsp;&nbsp;&nbsp;-</span>}</p>
                   <p> <label>Invoice Amount:&nbsp;</label>
                   {this.withoutInvoice>0?<span> {this.invoiceDoc.financeInfo.total}</span>:<span>&nbsp;&nbsp;&nbsp;-</span>}</p>
                   
                   {/* <p> <label>Invoice Attachments</label>
                   {this.withoutInvoice>0&&this.invoiceDoc.files.map((fileObj,ind)=>
                    <a onClick={()=>this.downloadFile(fileObj,'invoiceFile')} key={ind} className={style.width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.displayName} style={{width:'50%'}}> {fileObj.displayName}</a>
                   )}
                   </p> */}
            </div>

            <div className="detailWrap width30">   
                  <p> <label>DC Date:&nbsp;</label>
                   <span> {this.state.shipmentDoc.dc.date?CommonApi.dateConvert(this.state.shipmentDoc.dc.date):null}</span></p>
                   {/* <p> <label>DC Attachments:</label>
                   {this.state.shipmentDoc.dc.files.map((fileObj,ind)=>
                   <a onClick={()=>this.downloadFile(fileObj,'DC')} key={ind} className={style.width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.displayName}> {fileObj.displayName}</a>
                   )}</p> */}
            </div>

            <div className="detailWrap width30">  
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
                   <span>  {this.state.shipmentDoc.ewbDate?CommonApi.dateConvert(this.state.shipmentDoc.ewbDate):null}</span></p>
                   {/* <p> <label>Test Certificate:</label>
                   {this.state.shipmentDoc.testCertificate.map((fileObj,ind)=>
                   <a onClick={()=>this.downloadFile(fileObj.files[0],'TC')} key={ind} className={style.width60+' '+style.moveRight+' '+style.fileWrap} title={fileObj.files[0].displayName}> {fileObj.files[0].displayName}</a>
                   )}
                   </p> */}
            </div>
            <div  className="width10">&nbsp;</div>
            </div>:null}
            </div>
           <div className="tableDiv topMargin">
           <table className="compTable">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>HSN Code</th>
                <th>Total Qty</th>
                <th>Dispatch Qty</th>
                <th>Rate(&#8377;) </th>
                <th>Discount(%)</th>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<th>Bill Discount Fee(&#8377;) </th>:null} 
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<th>mSupply Fee(&#8377;) </th>:null}
                <th>GST(%)</th>
                <th>Amount(&#8377;) </th>
              </tr>
            </thead>
            <tbody>
              {this.state.shipmentDoc.lineItems.map((line,ind)=><tr key={ind}>
                <td>{line.name}</td>
                <td>{line.hsnCode}</td>
                <td>{line.totalQty}</td>
                <td>{line.qty}</td>
                <td>{line.unitPrice}</td>
                <td>{line.discountPercentage}</td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td>{CommonApi.amountConvert(line.billDiscountingFee)}</td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td>{CommonApi.amountConvert(line.msupplyFee)}</td>:null}
                <td>{line.GSTPercentage}</td>
                <td>{CommonApi.amountConvert(line.grandTotal) }</td>
              </tr>)}  
              
              
            </tbody>
             <tbody>
            <tr>
                <td>Total(&#8377;) </td>
                <td></td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td></td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td></td>:null}
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{CommonApi.amountConvert(this.totalLineItem)}</td>
              </tr> 
             </tbody> 
          </table>
        </div>

        <div className="accordionContainer chargesInfo topMargin"> 
             <span>Additional Charges </span>
             <img className={AdiAccordionImg} src={require('../../assets/images/dropdown_icon.png')} onClick={()=>{this.setState({additionalChargeShow:!this.state.additionalChargeShow})}}/>
        </div>
       {/* {this.state.additionalChargeShow? */}
         <div className="tableDiv chargesInfo">
          <table className="compTable">
              {this.state.additionalChargeShow?
            <thead>
              <tr>
               <th>Service Name</th>
                <th>Basic Value(&#8377;)</th>
                <th>SAC Code</th>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<th>Bill Discount Fee(&#8377;) </th>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<th>mSupply Fee(&#8377;) </th>:null}
                <th>GST(%)</th>
                <th>Amount(&#8377;) </th>
              </tr>
            </thead>:null}
            {this.state.additionalChargeShow?
            <tbody>
            
              <tr>
                <td>Transportation</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.shippingCostBasicValue}</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.shippingCostSACCode}</td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.shippingCostBillDiscountingFee}</td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.shippingCostMsupplyFee}</td>:null}
                <td>{this.state.shipmentDoc.payable.transportationCharges.shippingCostGSTPercentage}</td>
                <td>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.shippingCostValue)}</td>
              </tr>
              <tr>
                <td>Loading</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.loadingBasicValue}</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.loadingSACCode}</td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"? <td>{this.state.shipmentDoc.payable.transportationCharges.loadingBillDiscountingFee}</td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.loadingMsupplyFee}</td>:null}
                <td>{this.state.shipmentDoc.payable.transportationCharges.loadingGSTPercentage}</td>
                <td>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.loadingValue)}</td>
              </tr>
              <tr>
                <td>Unloading</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.unloadingBasicValue}</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.unloadingSACCode}</td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.unloadingBillDiscountingFee}</td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.unloadingMsupplyFee}</td>:null}
                <td>{this.state.shipmentDoc.payable.transportationCharges.unloadingGSTPercentage}</td>
                <td>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.unloadingValue)}</td>
              </tr>
              <tr>
                <td>Insurance</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.insuranceBasicValue}</td>
                <td>{this.state.shipmentDoc.payable.transportationCharges.insuranceSACCode}</td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.insuranceBillDiscountingFee}</td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td>{this.state.shipmentDoc.payable.transportationCharges.insuranceMsupplyFee}</td>:null}
                <td>{this.state.shipmentDoc.payable.transportationCharges.insuranceGSTPercentage}</td>
                <td>{CommonApi.amountConvert(this.state.shipmentDoc.payable.transportationCharges.insuranceValue)}</td>
              </tr>
              
            </tbody>:null}
            {/* {this.state.additionalChargeShow? */}
            <tbody> 
               <tr>
                <td>Total(&#8377;)</td>
                <td></td>
                <td></td>
                {this.shipmentConfig.billDiscountingMethodology != "transaction"?<td></td>:null}
                {this.shipmentConfig.convenienceFeeMethodology != "transaction"?<td></td>:null}
                <td></td>
                <td>{CommonApi.amountConvert((this.state.shipmentDoc.payable.transportationCharges.shippingCostValue+this.state.shipmentDoc.payable.transportationCharges.loadingValue+this.state.shipmentDoc.payable.transportationCharges.unloadingValue+this.state.shipmentDoc.payable.transportationCharges.insuranceValue)) }</td>
              </tr> 
            </tbody>
            {/* :null} */}
          </table>
        </div>
        

       <div className="chargesDiv topMargin">
             {/* <p className={style.totalDiv}> <span className={style.wid100+' '+style.moveRight}>Total </span> </p> */}
             {/* <p > <span>Basic Amount </span> <span>yyyyy </span> </p>
             <p >  <span>Discount </span> <span>yyyyy </span>  </p> */}
             <p >  <label>Total Bill Discount Fee (&#8377;) <span style={{color:'#b5b5b5'}}>incl.taxes</span>  </label> 
             {this.shipmentConfig.billDiscountingMethodology != "transaction"? <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.totalBillDiscountingFee.toFixed(2))} </span> : <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.extraCharges.billDiscountingFeeValue.toFixed(2))} </span> }
              </p>
             <p >  <label>Total mSupply Fee (&#8377;) <span style={{color:'#b5b5b5'}}>incl.taxes</span>  </label>
             {this.shipmentConfig.convenienceFeeMethodology != "transaction"? <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.totalMsupplyFee.toFixed(2))} </span>:<span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.extraCharges.msupplyFeeValue.toFixed(2))} </span>}  </p>
             {/* <p >  <span>GST</span> <span>yyyyy </span>  </p> */}
             <p >  <label>Grand Total(&#8377;) </label> <span>{CommonApi.amountConvert(this.state.shipmentDoc.payable.grandTotal)} </span>  </p>
        </div>
        
        
        {/* <div className={style.totalInfo+' '+style.chargesInfo}>
        <span>
            Grand Total
        </span>
        <span>
        {this.state.shipmentDoc.payable.grandTotal}
        </span>
        </div> */}
        
         <div className="fileContainer"> 

            {this.state.shipmentDoc.remarks.length>0?<p><label style={{float:'left','marginRight':'5px'}}>Remarks: </label><span className="remarkSpan">{this.state.shipmentDoc.remarks} </span> </p>:null} 
             {this.state.shipmentDoc.attachments.map((fileObj,ind)=>
              <div key={ind} title={fileObj.files[0].displayName} className="width60 moveRight fileDiv" style={{'marginRight': '18px',width:'20%'}}>
             <p className="fileWrap2 wid80"><a onClick={()=>this.downloadFile(fileObj.files[0],'Additional')} >{fileObj.files[0].displayName}</a></p>
            
             </div>)}
             

        </div> 
           <div className="grnButton">
                <button onClick={()=>window.history.back()}>Back</button>
               {this.props.loginDetail != ''&&this.state.shipmentDoc.GRNReceived&&this.props.loginDetail.privilege["shipment-read"]?<button onClick={()=>{
                    this.props.history.push('/pr2pay/'+this.routeParam.companyId+'/view-grn/'+this.routeParam.ShipmentCompanyId+'/'+this.routeParam.projectId+'/'+this.routeParam.shipmentId);
                }}>View GRN</button>:null} 


                {!this.state.shipmentDoc.GRNReceived&&this.props.loginDetail.privilege['shipment-create']?<button onClick={()=>{
                  this.props.history.push('/pr2pay/'+this.routeParam.companyId+'/create-grn/'+this.routeParam.ShipmentCompanyId+'/'+this.routeParam.projectId+'/'+this.routeParam.shipmentId);
                  
                }}>Create GRN</button>:null}


            </div> 

                   
            </div>:null}
           
            
     </div>


    }
}

const mapStateToProps = state => {
    
	return {
		selectedCompany:state.companyDetailReducer.currentCompanyDetail,
		loginDetail:state.storeSession.loginDetail
	}
}
export default connect(mapStateToProps)(ViewShipmentDetail);

