import React,{Component} from 'react';

import $http from "../utils/Http";
import { connect } from "react-redux";
import {Saved, SentToSupplier,ReadyToShip, PartialShipped, Shipped, PartialDelivered, Delivered} from '../containers/ProgressBar';
import { Dropdown } from '../common/FormElements/FormElements';
import { withRouter } from "react-router-dom";
import * as CommonApi  from '../common/CommonApi/commonApi';
import '../assets/styles/PoDetail.css';

import {Button, Text,  Radio} from "../common/FormElements/FormElements";
import ENV_VARIABLE from "../utils/Environment";
import Modal from '../common/Modal/Modal';



class PODetail extends Component{
    constructor(props){
        super(props);
        debugger
        this.userProfileNavigation=this.userProfileNavigation.bind(this);
        this.getPOdetails =this.getPOdetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.redirectToList = this.redirectToList.bind(this);
        this.CancelReasonPo = this.CancelReasonPo.bind(this);
        this.handleChangeReason = this.handleChangeReason.bind(this);
        this.handleChangeRadio =this.handleChangeRadio.bind(this);
        this.cancelConfirmationClose = this.cancelConfirmationClose.bind(this);
		this.gotoPreviousVersion = this.gotoPreviousVersion.bind(this);
		this.gotoNextVersion = this.gotoNextVersion.bind(this);
        this.fileDownload = this.fileDownload.bind(this);
        this.changePaymentTerms = this.changePaymentTerms.bind(this);
        this.cancelPo = this.cancelPo.bind(this);
        this.refreshPage = this.refreshPage.bind(this);

        this.handleSupplierId = this.handleSupplierId.bind(this)
        this.handleStateChange = this.handleStateChange.bind(this)
        this.handleChangeSearch = this.handleChangeSearch.bind(this)
        this.handleSearchSupplier = this.handleSearchSupplier.bind(this)
        this.handleCityChange = this.handleCityChange.bind(this)
        this.supplierChange = this.supplierChange.bind(this)

        this.rIhandleChangeRadio =this.rIhandleChangeRadio.bind(this);
        this.rIhandleSupplierId = this.rIhandleSupplierId.bind(this)
        this.rIhandleStateChange = this.rIhandleStateChange.bind(this)
        this.rIhandleChangeSearch = this.rIhandleChangeSearch.bind(this)
        this.rIhandleSearchSupplier = this.rIhandleSearchSupplier.bind(this)
        this.rIhandleCityChange = this.rIhandleCityChange.bind(this)
        this.rIsupplierChange = this.rIsupplierChange.bind(this)

        this.state={
          //  poDetails:{"privileges" :""},
            poDetails:{},
            companyDetails:'',
            close:'',
            showCancelPopup:false,
            CancelReason:false,
            paymentDetailsPopup:false,
            supplierPO: false,
            supplierModalStatus: false,
            cities:[],
            allState:[],
            searchSupplier:"",
            supplierQuted: "quoted",
            suppliersList:[],
            suppliersAdvList:[],
            data:{
                refId: "",
                refPoDate:"",
                suplierSearch:"",
                advPercentage:"",
                noOfDays: "",
                setSellerName:""       
            },
            errors:{
                refId: "required",
                refPoDate:"required",
                advPercentage:"required",
                noOfDays: "required",
            },
            supplier:{
                stateSupplier : "",
                citySupplier : "",
                searchSupplier: "",
            },
            formSubmitted  :false,
            supplierId:"",
            sellerName:"",
            successPopup:false,
            suppllierSubMes: false,

            //Second Popup
            rIsupplierId:"",
            rIsellerName:"",
           
            rIsuppllierSubMes: false,
            rIsupplierPO: false,
            rIsupplierModalStatus: false,
            rIformSubmitted  :false,
            rIsupplierQuted: "quoted",
            rIsuppliersList:[],
            rIsuppliersAdvList:[],
            rIdata:{
                rIadvPercentage:"",
                rInoOfDays: "",       
            },
            rIerrors:{
                rIadvPercentage:"required",
                rInoOfDays: "required",
            },
            rIsupplier:{
                rIstateSupplier : "",
                rIcitySupplier : "",
                rIsearchSupplier: "",
            },
            rsIerrors:{
                rIsuplierSearch:"required",
            },
            rIcities:[],
            rIallState:[],
            rIsuppllierFailed:false
        }  

        this.routeParam =this.props.match.params;

        let _breadCrumb=[{displayName:'PR2Pay',navigation:''},
        {displayName:'View Purchase Orders',navigation:'/pr2pay/'+this.routeParam.CompanyId+'/view-po'},
        {displayName:this.routeParam.poId,navigation:''}]
        const { dispatch } = this.props;
        // dispatch(commonActions.setBreadCrumb(_breadCrumb,false));  
    }   

    componentDidMount(){
        this.redirectToList()
        this.getPOdetails();
    }
	gotoPreviousVersion(){
		this.props.history.push("/view-po/"+this.props.match.params.enterpriseID+"/"+this.state.companyDetails.id+"/"+this.state.projectDetails.id+"/"+this.state.poDetails.id+"/"+parseInt(this.state.poDetails.amendmentNumber-1))
        
	}
	gotoNextVersion(){
		this.props.history.push("/view-po/"+this.state.companyDetails.id+"/"+this.state.projectDetails.id+"/"+this.state.poDetails.id+"/"+parseInt(this.state.poDetails.amendmentNumber+1))
       
	}
    fileDownload(e){
		
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/'+this.props.match.params.companyId+'/'+this.props.match.params.projectId+'/'+ this.props.match.params.poId+'/'+this.props.match.params.amendmentNumber+"/downloadFile/"+e.target.name, (response)=>{
           if(response.http_code == 200){
               
           window.open(response.message)
           }
       });
   }
    
    submitBtn(po,flag){
        var stateData = this.state;
        stateData.reasonErrorFlag =false;
        if(this.state.cancellationReason == undefined || this.state.cancellationReason == ''){
            stateData.reasonErrorFlag =true;
            stateData.reasonErrorMessage= "Please provide a reason";
            this.setState(stateData);
            return;
        }
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/'+po.id+'/'+po.addressLineItemMapping["0"][0].activeMappingPoId+"/"+flag,
        
        JSON.stringify({"reason":this.state.cancellationReason}), (response)=>{
            if(response.http_code == 200){
           
                this.setState({successPopup:true,successMsg:response.message,CancelReason:false})
                }
        });
    }
    refreshPage(){
        this.setState({successPopup:false,rIsuppllierSubMes:false, rIsuppllierFailed:false,supplierPO:false,rIsupplierPO:false});
        this.getPOdetails();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.match.params.amendmentNumber!=this.state.poDetails.amendmentNumber){
				
            this.getPOdetails(nextProps);
        }
        /* if(this.props.userSelectedCompany != undefined&& this.props.userSelectedCompany.selected!=''){

             var poDetails = this.state.poDetails;
            poDetails.privileges = this.props.userSelectedCompany.selectedCompany.privileges;
             poDetails.customFields = this.state.poDetails.config.poCustomFields.map((item) => {
                 return({"label":item.fieldDisplayName, "keyName":item.fieldName})
             });   
			
             this.setState({poDetails:poDetails})
			
			
           
        } */
		
    }
    changePaymentTerms(po){
        this.setState({paymentDetailsPopup:true})
      
       
    }
    updatePaymentTerms(po){
        let data = {
            "paymentTerms": {
                "paymentType": po.addressLineItemMapping["0"][0].mappingPaymentTerms.paymentType,
                "financialInstitution":po.addressLineItemMapping["0"][0].mappingPaymentTerms.financialInstitution,
                "isCreditOrder":po.addressLineItemMapping["0"][0].mappingPaymentTerms.isCreditOrder,
                "creditPeriodUnit": "Days",
                "creditPeriod": parseInt(po.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod),
                "creditType": po.addressLineItemMapping["0"][0].mappingPaymentTerms.creditType,
                "schedule": po.addressLineItemMapping["0"][0].mappingPaymentTerms.schedule,
                "paymentCycle": po.addressLineItemMapping["0"][0].mappingPaymentTerms.paymentCycle,
                "gracePeriodUnit": "Days",
                "gracePeriod": parseInt(po.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod) +15,
                "isAdvance": po.addressLineItemMapping["0"][0].mappingPaymentTerms.isAdvance,
                "advanceUnit": "percentage",
                "advance": parseInt(po.addressLineItemMapping["0"][0].mappingPaymentTerms.advance)
            }
        }
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/amend/'+po.id+'/'+po.amendmentNumber+'/'+po.addressLineItemMapping["0"][0].activeMappingPoId,JSON.stringify(data),(response)=>{
            this.getPOdetails()
            this.setState({paymentDetailsPopup:false,paymentDetailsPopupSuccess:true})
        });
    }


    getPOdetails(props){
        if(props!=undefined){
			var props = props;
		}
		else{
			var props = this.props;
        }
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/'+props.match.params.poId+'/'+props.match.params.amendmentNumber,(response)=>{
            if(response.http_code == 200){
                var stateData = this.state;
                //console.log(this.props);
                stateData.poDetails = response.message.poDetails;                
                stateData.sellerDetails = response.message.sellerDetails;
               // if(this.props.userSelectedCompany != undefined&& this.props.userSelectedCompany.selectedCompany!=''&& this.state.poDetails.customFields==undefined){
                   
                   // stateData.poDetails.privileges = this.props.userSelectedCompany.selectedCompany.privileges;
                    stateData.poDetails.customDisplayFields = stateData.poDetails.config.poCustomFields.map((item) => {
                        return({"label":item. fieldDisplayName, "keyName":item.fieldName})
                    }); 	
             //   }
                stateData.poDetails.addressLineItemMapping["0"]!=undefined  && stateData.poDetails.addressLineItemMapping["0"].map((item)=>{
                    item.accordionData = true;
                })
                stateData['companyDetails']=response.message.companyDetails;
                stateData['projectDetails']=response.message.projectDetails;
                stateData['sellerDetails']=response.message.sellerDetails;
                stateData['shippingAddress']=response.message.shippingAddress;
                stateData['billingAddress']=response.message.billingAddress;
                stateData['billingGSTNumber']=response.message.billingGSTNumber; 
            
                this.setState(stateData);
            }
        });
    }    

   



    userProfileNavigation(navigation){ 
        this.props.history.push("/list-po/"+this.props.userSelectedCompany.selectedEnterprise+"/"+this.props.userSelectedCompany.selectedCompany)
    }
    handleChangeEdit()
    {   
        this.props.history.push('/pr2pay/'+this.state.companyDetails.id+'/edit-po/'+this.state.projectDetails.id +'/'+this.state.poDetails.id+'/'+this.state.poDetails.amendmentNumber);
    }
    handleChange(e, data){
        var stateData = this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms;
        if(parseInt(stateData.advance) > 100 || parseInt(stateData.advance) < 0 ){           
           stateData[e.target.name] = "";
          this.setState(stateData);
            return;
        }
        
        stateData[e.target.name] = data.data;
        this.setState(stateData);
       
    }
    handleChangeReason(e,d){
        var stateData=this.state;
        stateData[e.target.name]=d.data;
        if(e.target.name == "cancellationReason"&&e.target.value=='Others')stateData['textReason']='';   
        this.setState(stateData);
    }

    toggleAccordion(index){           
        var stateData = this.state;
        stateData.poDetails.addressLineItemMapping["0"][index].accordionData = !stateData.poDetails.addressLineItemMapping["0"][index].accordionData;
        this.setState(stateData);
    }
    convertDate(inputFormat) {
		function pad(s) { return (s < 10) ? '0' + s : s; }
		var d = inputFormat.getTime();
        return d;
    }
    cancelPo(val , data){
        this.setState({showCancelPopup : true,setBizUpdateFlag:data,cancellationReason:""});        
    }
    redirectToList(){
        this.setState({CancelSuccess : false});
        this.props.history.push('/view-po/'+ this.routeParam.enterpriseID +'/'+this.routeParam.companyId+"/"+this.routeParam.projectId+"/"+this.routeParam.poId+"/"+this.routeParam.amendmentNumber);
    }
    
    CancelReasonPo(data){
        let urlData;
        if(data ==="reject"){
            urlData = "PORejectionReason";
        }
        else{
            urlData = "POAmendmentReason";
        }
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/reasonCodes/'+urlData, (response)=>{
            if(response.http_code == 200){
                this.setState({reasonCodes:response.message.POReasonEntity.map((item)=>{item.label = item.reason; item.value=item.reason; return item}), CancelReason :true,showCancelPopup:false});
            }
        });
    }

    cancelConfirmationClose(){        
        this.setState({showCancelPopup: false});        
    }


    /**************IssueToSupplier handler****************************/
    statesIndia(){

       return CommonApi.getState()
        .then((res)=>{
            this.setState({
                allState:res
            })
           return   res
        })
    }
    supplierChange(){
         this.setState({
            supplierModalStatus: true
        })
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/quotes/suppliers/'+this.state.poDetails.enquiryId, (res)=>{
            if(res.http_code === "200"){
                this.setState({
                    suppliersList: res.message
                })
            }       
        })
        this.statesIndia()
    }

    handleChangeRadio(event) {
        this.setState({
            supplierQuted: event.target.value
        });
    }



  
    handleStateChange(event){
      
        let value = event.target.value
        if(value!==''){

            this.setState({
                stateSupplier:value
            })
           

            let cityArr = this.state.allState.filter(state => {
                if(state.state === value){
                    return state.cities
                }
                else{
                    return;
                }
            })
          
            this.setState({
                cities:cityArr
            })
            
        }
    }

    handleCityChange(event){
        let value = event.target.value
        if(value!==''){
            this.setState({
                citySupplier:value
            })
        }
    }   

    handleChangeSearch(event){
        this.setState({
            searchSupplier: event.target.value
        })
    }


    handleSearchSupplier(event){
        var state = this.state.stateSupplier;
        if(this.state.stateSupplier==="Andhra Pradesh (Before Division)" || this.state.stateSupplier ==="Andhra Pradesh (NEW)"){
            state ="Andhra Pradesh";
        }
        let _Json={
            servedState: this.state.poDetails.shippingAddress[0].state,
            servedCity: this.state.poDetails.shippingAddress[0].city,
            basedState: state,
            basedCity: this.state.citySupplier,
            textSearch: this.state.searchSupplier
        }

        $http.postWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/suppliers',JSON.stringify(_Json),(res)=>{
            if(res.http_code === "200"){
                //console.log("in 200 ================>", res.message)
                this.setState({
                    suppliersAdvList: res.message
                })
            }
            
        })
       
       
    }

    handleSupplierId(e,name,id){
        if(e.target.value!=''){
            this.setState({
                supplierId: id,
                sellerName: name
            })
        }
    }


    submitSupplierSet(){

        this.setState(prevState => ({
            data: {
                ...prevState.data,
                setSupplierId: this.state.supplierId,
                setSellerName:this.state.sellerName,
            },
            supplierModalStatus : false
        }))
    }

    IssueToSupplier(){
        this.setState(prevState => ({
    
            data: {
                ...prevState.data,
                refId:this.state.poDetails.referenceId,
                refPoDate:this.state.poDetails.referenceDate !==""? new Date(this.state.poDetails.referenceDate).toISOString().substr(0, 10):"",
                advPercentage : this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.advance,
                noOfDays: this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod,
                setSupplierId: this.state.poDetails.addressLineItemMapping["0"][0].mappingSellerId,
                setSellerName: this.state.poDetails.addressLineItemMapping["0"][0].mappingSellerName,
            },
            supplierPO : true
        }))
    } 


    handleChangeData = (e, data) =>{
        var submitData = this.state.data;         
		if(data == "refPoDate"){        
            submitData[data] = CommonApi.convertFromDate(e);            
            this.setState({data:submitData});
        }
        else{
            submitData[e.target.name] = data.data;
            this.setState({data:submitData});
            var submitErrors = this.state.errors;
            submitErrors[e.target.name] = data.error;
            this.setState({errors:submitErrors});
        }

    }

    submitSipplier = () =>{
      
        this.setState({
            formSubmitted:true
        })
        let _Json = {
            referenceId: this.state.data.refId,
            referenceDate:  new Date(this.state.data.refPoDate).getTime(),
            mappings:[{
                poId:this.state.poDetails.addressLineItemMapping[0][0].activeMappingPoId,
                sellerId:  this.state.data.setSupplierId,
                sellerName: this.state.data.setSellerName,
                paymentTerms:{
                    paymentType:"Self",
			        financialInstitution: "",
                    isCreditOrder: (parseInt(this.state.data.noOfDays) > 0) ? true : false,
                    creditPeriodUnit:"Days",
                    creditPeriod: parseInt(this.state.data.noOfDays),
                    creditType:"single",
                    schedule:[],
                    paymentCycle:"invoiceGeneration",
                    gracePeriodUnit: "Days",
                    gracePeriod: parseInt(this.state.data.noOfDays)+15,
                    isAdvance: (parseFloat(this.state.data.advPercentage) > 0) ? true : false,
                    advanceUnit: "percentage",
                    advance: parseFloat(this.state.data.advPercentage)
                }
            }],
        }

        //console.log("Json Datat ==============<",_Json)
         // if(Object.keys(this.state.errors).filter((key)=>{if(this.state.data[key]!='')return 1;else return 0;}).length !==0 )
           //  return;
          
        //console.log("po id ===========>", _Json)
        $http.putWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/issue/'+this.state.poDetails.id, JSON.stringify(_Json), (res)=>{
            if(res.http_code === 200){
                this.setState({supplierPO : false, successPopup:true,successMsg:res.message})
            }
            else{
                 this.setState({supplierPO : false, rIsuppllierFailed: true})
            } 
            
        })
    }


    /**************Re IssueToSupplier handler****************
    *********************************************************/
    rIstatesIndia(){

       return CommonApi.getState()
        .then((res)=>{
            this.setState({
                rIallState:res
            })
           return   res
        })
    }

    rIsupplierChange(){
         this.setState({
            rIsupplierModalStatus: true
        })
        $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/quotes/suppliers/'+this.state.poDetails.enquiryId, (res)=>{
            if(res.http_code === "200"){
                this.setState({
                    rIsuppliersList: res.message
                })
            }       
        })
        this.rIstatesIndia()
    }

    rIhandleChangeRadio(event) {
        this.setState({
            rIsupplierQuted: event.target.value
        });
    }
    
    rIhandleStateChange(event){
        let value = event.target.value
        if(value!==''){

            this.setState({
                rIstateSupplier:value
            })
           

            let rIcityArr = this.state.rIallState.filter(state => {
                if(state.state === value){
                    return state.cities
                }
                else{
                    return;
                }
            })
            
           // console.log("cities ================>", rIcityArr)
            this.setState({
                rIcities:rIcityArr
            })
            
        }
    }

    rIhandleCityChange(event){
        let value = event.target.value
        if(value!==''){
            this.setState({
                rIcitySupplier:value
            })
        }
    }   

    rIhandleChangeSearch(event){
        this.setState({
            rIsearchSupplier: event.target.value
        })
    }


    rIhandleSearchSupplier(event){
        debugger;
        var state = this.state.rIstateSupplier;
        if(this.state.rIstateSupplier==="Andhra Pradesh (Before Division)" || this.state.rIstateSupplier ==="Andhra Pradesh (NEW)"){
            state ="Andhra Pradesh";
        }
        let _Json={
            servedState: this.state.poDetails.shippingAddress[0].state,
            servedCity: this.state.poDetails.shippingAddress[0].city,
            basedState: state,
            basedCity: this.state.rIcitySupplier,
            textSearch: this.state.rIsearchSupplier
        }

        $http.postWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/suppliers',JSON.stringify(_Json),(res)=>{
            if(res.http_code === "200"){
                //console.log("in 200 ================>", res.message)
                this.setState({
                    rIsuppliersAdvList: res.message
                })
            }
            
        })
       
       
    }

    rIhandleSupplierId(e,name,id){
        if(e.target.value!=''){
            this.setState({
                rIsupplierId: id,
                rIsellerName: name
            })

        }
    }


    rIsubmitSupplierSet(){
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                rIsetSupplierId: this.state.rIsupplierId,
                rIsetSellerName:this.state.rIsellerName,
            },
            rIsupplierModalStatus : false
        }))
    }

     rIIssueToSupplier(){
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                rIsetSupplierId:this.state.poDetails.addressLineItemMapping["0"][0].mappingSellerId,
                rIsetSellerName: this.state.poDetails.addressLineItemMapping["0"][0].mappingSellerName,
            },
            // ,
            // rIdata:{
            //     rIadvPercentage : this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.advance,
            //     rInoOfDays: this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod,
            // },
            rIsupplierPO : true
        }))
    } 


    rIhandleChangeData = (e, data) =>{  
        var submitData = this.state.rIdata;
        
        submitData[e.target.name] = data.data;
        var submitErrors = this.state.rsIerrors;
        submitErrors[e.target.name] = data.error;
        
        this.setState({rIdata:submitData, rsIerrors:submitErrors});
    }

    rIsubmitSipplier = () =>{
        this.setState({
            rIformSubmitted:false
        })
        if(this.state.rIdata.rInoOfDays ==="" || this.state.rIdata.rIadvPercentage ===""){
            return;
        }
        
            
        let _Json = {
                sellerId:  this.state.data.rIsetSupplierId,
                sellerName: this.state.data.rIsetSellerName,
                paymentTerms:{
                    paymentType:"Self",
                    financialInstitution: "",
                    isCreditOrder: (parseInt(this.state.rIdata.rInoOfDays) > 0) ? true : false,
                    creditPeriodUnit:"Days",
                    creditPeriod: parseInt(this.state.rIdata.rInoOfDays),
                    creditType:"single",
                    schedule:[],
                    paymentCycle:"invoiceGeneration",
                    gracePeriodUnit: "Days",
                    gracePeriod: parseInt(this.state.rIdata.rInoOfDays)+15,
                    isAdvance: (parseFloat(this.state.rIdata.rIadvPercentage) > 0) ? true : false,
                    advanceUnit: "percentage",
                    advance: parseFloat(this.state.rIdata.rIadvPercentage)
                }
        }
        //console.log("po id ===========>", _Json)
        $http.postWithUrl(ENV_VARIABLE.HOST_NAME+'po2grn/phoenix/po/reIssue/'+this.state.poDetails.id+'/'+this.state.poDetails.addressLineItemMapping[0][0].activeMappingPoId, JSON.stringify(_Json), (res)=>{
            if(res.http_code === 200){
                this.setState({rIsupplierPO : false, rIsuppllierSubMes: true})
                 
            }else{
                 this.setState({rIsupplierPO : false, rIsuppllierFailed: true})
            }
            
        })

        // console.log("data to sent ============>", data)
    }

    render(){   
          
        let currentDate = new Date();
        currentDate=  currentDate.toISOString().split("T")[0];
         /**********************************************************************
        ************************ PO Supplier Issue*******************************
        ***********************************************************************/ 
        let states;
      
        if(this.state.allState){
            states = this.state.allState.map((state, index) =>{

                return (
                    <option  key={"stateOp"+index} value={state.state}>{state.state}</option>
                )
            })
        }

        let cities = this.state.cities.map(key=>{
           return key.cities.map((city, index) =>{
               return(
                    <option key={"cityOp"+index} value={city}>{city}</option>
               )
            })
        })
        
        
        let supplersNodes = this.state.suppliersList.map((suplliers, index)=>{
            return(
                <tr key={"trListAdv"+index}>
                    <td>
                        <Radio type="radio"
                            id={"seller"+index}
                            name="sellerInfo"
                            value={suplliers.sellerId}
                            onChange={(e)=>this.handleSupplierId(e, suplliers.name, suplliers.sellerId)}
                            checked={this.state.supplierId === suplliers.sellerId}
                            label={suplliers.name}
                        />
                    </td>
                     <td>{suplliers.mobile}</td>
                     <td>{suplliers.city}, {suplliers.state}</td>
                </tr>
                )
           
            })
        
        let suppliersAdvList = this.state.suppliersAdvList.map((suplliers, index) =>{
            return(
                <tr key={"trListq"+index}>
                    <td>
                        <Radio type="radio"
                                id={"sellerAdv"+index}
                                name="sellerAdvInfo"
                                value={suplliers.sellerId}
                                onChange={(e)=>this.handleSupplierId(e, suplliers.sellerName, suplliers.sellerId)}
                                checked={this.state.supplierId === suplliers.sellerId}
                                label={suplliers.sellerName}
                        />
                    </td>
                     
                     <td>{suplliers.mobile}</td>
                </tr>
            )
        })
        


        /**********************************************************************
        ************************Supplier Reissue*******************************
        ***********************************************************************/ 

        let rIstates;

        if(this.state.rIallState){
            rIstates = this.state.rIallState.map((state, index) =>{

                return (
                    <option  key={"stateOp"+index} value={state.state}>{state.state}</option>
                )
            })
        }

      //  console.log("cities ===========>", this.state.rIcities)

        let rIcities = this.state.rIcities.map(key=>{
           return key.cities.map((city, index) =>{
               return(
                    <option key={"cityOp"+index} value={city}>{city}</option>
               )
            })
        })
        
       // console.log("cityNodes  =====================>",rIcities)

        let rIsupplersNodes = this.state.rIsuppliersList.map((suplliers, index)=>{
            return(
                <tr key={"trListAdv"+index}>
                    <td>
                        <Radio 
                            type="radio"
                            id={"rIsellser"+index}
                            name="rIsellerInfo"
                            value={suplliers.sellerId}
                            onChange={(e)=>this.rIhandleSupplierId(e, suplliers.name, suplliers.sellerId)}
                            checked={this.state.rIsupplierId === suplliers.sellerId}
                            label={suplliers.name}
                        />
                    </td>
                     <td>{suplliers.mobile}</td>
                     <td>{suplliers.city}, {suplliers.state}</td>
                </tr>
            )
           
        })

        
        let rIsuppliersAdvList = this.state.rIsuppliersAdvList.map((suplliers, index) =>{
            return(
                <tr key={"rItq"+index}>
                    <td>
                        <Radio type="radio"
                                id={"rIsellerAdv"+index}
                                name="rIsellerAdvInfo"
                                value={suplliers.sellerId}
                                onChange={(e)=>this.rIhandleSupplierId(e, suplliers.sellerName, suplliers.sellerId)}
                                checked={this.state.rIsupplierId === suplliers.sellerId}
                                label={suplliers.sellerName}
                        />
                    </td>
                     
                     <td>{suplliers.mobile}</td>
                </tr>
            )
        })
        
        return(
    
        <div className="poDetails-page">
 
        {this.state.poDetails !='' && this.state.companyDetails !='' && this.state.poDetails.customFields!=undefined?
        <div>

             <div className="all-buttons width100">
     
        <ul className="flex justifyContent">

            
             <li>
                <button className="btn_with_yellow_border" type="button" onClick={()=>this.userProfileNavigation('list-po')}>Back To List</button>
            </li> 
           {/* <li className={styles.width50}>
                <button className={styles.btn_with_yellow_border} type="button" onClick={()=>this.rIIssueToSupplier('list-po')}>ReIssue To Supplier</button>
            </li>*/}
            {/* {
                this.state.poDetails.isLatestVersion && this.state.poDetails.paymentEditable && this.state.poDetails.status.current.status !='Saved' ? 
                <li>
                    <button className={styles.btn_with_yellow_border} onClick={() =>this.EditExtraChanges()} type="button">Edit Extra Changes</button>
                </li>:null
            }  */}
            {this.state.poDetails.isLatestVersion && (this.state.poDetails.status.current.status ==='Sent To Supplier' || this.state.poDetails.status.current.status ==='Amendment - Sent To Supplier' ) && this.state.poDetails.poIssuedToSupplier === false? 
                <li>
                    <button className="btn_with_yellow_border" onClick={() =>this.IssueToSupplier()} type="button">Issue PO to Supplier</button>
                </li>:null
            }          
            {this.state.poDetails.isLatestVersion && this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status === 'Rejected'  && (this.state.poDetails.status.current.status ==='Sent To Supplier' || this.state.poDetails.status.current.status ==='Amendment - Sent To Supplier')? 
                <li>
                    <button className="btn_with_yellow_border" onClick={() =>this.rIIssueToSupplier()} type="button">Re-Issue PO to Supplier</button>
                </li>:null
            } 
            {this.state.poDetails.isLatestVersion && this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status === 'Amendment - Requested By Supplier'  && (this.state.poDetails.status.current.status ==='Sent To Supplier' || this.state.poDetails.status.current.status === 'Amendment - Sent To Supplier')? 
                <li>
                    <button className="btn_with_yellow_border" onClick={() =>this.changePaymentTerms(this.state.poDetails)} type="button">Change Payment Terms</button>
                </li>
            :null}     


         {this.state.poDetails.isLatestVersion && (this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status === 'Rejected') && (this.state.poDetails.status.current.status ==='Sent To Supplier' || this.state.poDetails.status.current.status ==='Amendment - Sent To Supplier')
             ? 
            <li>
                <button className="btn_with_yellow_border" onClick={() =>this.cancelPo(this.state.poDetails,"reject")} type="button">Update BIZ Reject Status</button>
            </li>
         :null}   
           {this.state.poDetails.isLatestVersion && (this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status === 'Amendment - Requested By Supplier') && (this.state.poDetails.status.current.status ==='Sent To Supplier' || this.state.poDetails.status.current.status === 'Amendment - Sent To Supplier')? 
            (<li>
                <button className="btn_with_yellow_border" onClick={() =>this.cancelPo(this.state.poDetails,"rfa")} type="button">Update BIZ RFA Status</button>
            </li>)
         :null}   




            </ul>
            {this.state.poDetails.amendmentNumber >0 ||this.state.poDetails.isLatestVersion == false  ?
        <ul> <li className="width100" style = {{fontSize:"20px", textAlign:"center"}}>{this.state.poDetails.amendmentNumber >0 ? 
        <img 
            style={{transform: "rotate(180deg)"}} 
            onClick={this.gotoPreviousVersion}
            src={ENV_VARIABLE.IMAGE_URL+'arrow-right.png'} 
            alt="increment"
                
            />: null}
            <span style={{padding:"10px"}}>Version {this.state.poDetails.amendmentNumber}</span>{this.state.poDetails.isLatestVersion == false ?
            <img onClick={this.gotoNextVersion}src={ENV_VARIABLE.IMAGE_URL+'arrow-right.png'} alt="increment"/>:null }</li></ul>:null}
        
        </div>
             
                <div className="main-div">  
                
                        <ul className="flex">
                            <li className="profileImg"></li>
                            <li className="width30">
                                <ul>
                                    <li><label>PO Number: </label><span>{this.state.poDetails.id}</span></li>
                                        <li><b>{this.state.companyDetails.name}</b></li>
                                        <li><label>GSTIN: </label><span>{this.state.companyDetails.GSTNumber}</span></li>
                                        <li>
                                        {/* {this.state.companyDetails.address.id +' '+
                                         this.state.companyDetails.address.addressFirstName +' '+ this.state.companyDetails.address.addressMiddleName + ' '+ this.state.companyDetails.address.addressLastName + ' ' + 
                                         this.state.companyDetails.address.addressLine1 + ' ,' + this.state.companyDetails.address.addressLine2 + ' '+this.state.companyDetails.address.addressLine3 + ' ,' +} */}
                                       { this.state.companyDetails.address.city + ' ,' + this.state.companyDetails.address.state + ' ' +this.state.companyDetails.address.pincode }
                                    </li>                                       
                                </ul>
                            </li>
						
                        </ul>
                        <ul className="flex">
                            <li className="width20">    
                                <ul>
                                    <li><h3>Finalised Offer Details</h3></li>                        
                                    <li><label>Reference PO#: </label><span>{this.state.poDetails.referenceId}</span></li>
                                    <li><label>Reference Date: </label><span>{this.state.poDetails.referenceDate ? CommonApi.dateConvert(this.state.poDetails.referenceDate): "NA"}</span></li>
                                    <li><label>Enquiry ID: </label><span>{this.state.poDetails.enquiryId}</span></li>                                
                                </ul>                            
                            </li>
                            <li>
                                <ul>
                                    <li><label>Status: </label><span className="statusColor"> {this.state.poDetails.status.current.status}</span></li>
                                    <li><label>Reason: </label><span>{this.state.poDetails.status.current.reason ? this.state.poDetails.status.current.reason :' - '}</span></li>
                                    <li><label>Comments: </label><span>{this.state.poDetails.remarks  ? this.state.poDetails.remarks : 'NA'} </span></li>
                                </ul>
                            </li>
                            <li>
                                <ul>
                                    <li><label>Mapping PO Number: </label><span> {this.state.poDetails.addressLineItemMapping["0"][0].activeMappingPoId}</span></li>
                                    <li><label>Mapping PO Status: </label><span className="statusColor">{this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status  ? this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.status : 'NA'} </span></li>
                                    <li><label>Mapping PO Reason: </label><span>{this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.reason ? this.state.poDetails.addressLineItemMapping["0"][0].mappingStatus.current.reason : 'NA'}</span></li>
                                </ul>
                            </li>
                        </ul>
                        <div className="flex">
                            <div className="width20 card">
                                <div className="flex-container wid100"><span className="card-header-left">Bill To</span>
                                </div>
                                <div className="card-details mar-top-30"><p>{this.state.poDetails.billingAddress[0].addressFirstName + " "+ this.state.poDetails .billingAddress[0].addressLastName}</p>
                                    <p>{this.state.poDetails.billingAddress[0].addressLine1+ ", "  +this.state.poDetails.billingAddress[0].addressLine2}</p>
                                    <p>{this.state.poDetails.billingAddress[0].city+ ", "  +this.state.poDetails.billingAddress[0].state}</p>
                                    <p>{this.state.poDetails.billingAddress[0].pincode}</p>
                                    <p className="LightColor">GST </p>
                                    <p>{this.state.poDetails.billingAddress[0].billingGSTNumber}</p>                                    
                                </div>  
		                    </div>
                            <div className="width20 card">
                                <div className="flex-container wid100"><span className="card-header-left">Ship To</span>
                                </div>                                   
                                <div className="card-details mar-top-30"><p>{this.state.poDetails.shippingAddress[0].addressFirstName + " " + this.state.poDetails .shippingAddress[0].addressLastName}</p>
                                    <p>{this.state.poDetails.shippingAddress[0].addressLine1+ ", "  +this.state.poDetails.shippingAddress[0].addressLine2}</p>
                                    <p>{this.state.poDetails.shippingAddress[0].city+ ", "  +this.state.poDetails.shippingAddress[0].state}</p>
                                    <p>{this.state.poDetails.billingAddress[0].pincode}</p>
                                </div>    
		                    </div>
                            {this.state.sellerDetails ?
                            <div className="width20 card">                           
                                <div className="flex-container wid100"><span className="card-header-left">Supplier Info</span>
                                </div>                                   
                                <div className="card-details mar-top-30"><p>{this.state.sellerDetails.address[0].address1}</p>
                                    <p>{this.state.sellerDetails.address[0].state+ ", "  +this.state.sellerDetails.address[0].city}</p>
                                    <p>{this.state.sellerDetails.address[0].pincode}</p>
                                    <p className="LightColor">GST </p>
                                    <p>{this.state.sellerDetails.GSTNumber}</p>                                    
                                </div>
		                    </div>:null}
                        </div> 
                        <div className="flex">                        
                        <ul className="width60 customFields">
                            <li className="width100" >                                
                                <ul>                                    
                                    <li><h3>Additional Details</h3></li> 
                                    <li className="width100">
                                        <ul className="width100 flex flexWrap">                                      
                                            {this.state.poDetails!= '' && this.state.poDetails!= undefined && this.state.poDetails.customFields!=undefined ?
                                            this.state.poDetails.customDisplayFields.map((item, index)=>{
                                                return(<li key={"cudtom"+index} className="width30 flexWrap"><label>{item.label}: </label><span>
                                                {this.state.poDetails.customFields[item.keyName]}</span></li>);  
                                            }): null} 
                                        </ul>
                                    </li>
                                </ul>
                            </li>                            
                        </ul>
                        </div>
                    <div className="item-detail">
                        <table>
                            <thead className="headData">                                    
                                <tr>
                                    <th width="3%">Item</th>
                                    <th width="10%">Category</th>
                                    <th width="10%">Product Description</th>
                                    <th width="10%">HSN Code</th>
                                    <th width="10%">Qty</th>
                                    <th width="7%">UOM</th>
                                    <th width="10%">Rate (&#8377;)</th>
                                    <th width="7%">GST (&#37;)</th>
                                    <th width="7%">Discount (&#37;)</th>
                                    {
                                        this.state.poDetails.config.billDiscountingMethodology == "lineItem-column"?<th width="15%">Bill Discounting Fee (&#8377;)</th>:null
                                    }
                                    {
                                        this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?<th width="10%">Msupply Fee (&#8377;)</th>:null
                                    }
                                    <th width="10%">Amount (&#8377;)</th>
                                    {this.state.poDetails.config.poLineItemCustomFields.map((item, index) => {
                                        return(<th key={"poLineItem"+index} width="10%">{item.fieldDisplayName}</th>)
                                    })} 
                                </tr>
                            </thead>                           
                                {this.state.poDetails.addressLineItemMapping!='' && this.state.poDetails.addressLineItemMapping!= undefined && this.state.poDetails.addressLineItemMapping["0"] !=undefined && this.state.poDetails.addressLineItemMapping["0"].map((item,index)=>{
                                    return(
                                        <tbody>
                                           <tr>
                                                <td>{index+1}</td>
                                                <td title={CommonApi.splitCamelCase(item.category2)}>{CommonApi.splitCamelCase(item.category2)}</td>
                                                <td className="itemDescription" title={CommonApi.splitCamelCase(item.category3)}>{CommonApi.splitCamelCase(item.category3)}</td>
                                                <td>{item.hsnCode}</td>
                                                <td>{item.payable[0].qty}</td>
                                                <td>{item.payable[0].uom}</td>
                                                <td>{item.payable[0].unitPrice}</td>
                                                <td>{item.payable[0].GSTPercentage}</td>
                                                <td>{item.payable[0].discountPercentage}</td>
                                                {
                                            this.state.poDetails.config.billDiscountingMethodology == "lineItem-column"?<td>{CommonApi.amountConvert(item.payable[0].billDiscountingFee)}</td>:null
                                                }
                                        {
                                            this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ? <td>{CommonApi.amountConvert(item.payable[0].msupplyFee)}</td>:null
                                        }
                                            <td>{CommonApi.amountConvert(item.payable[0].grandTotal)}</td>
                                                {this.state.poDetails.config.poLineItemCustomFields.map((subItem, subIndex) => {
                                            return(<td className="itemDescription" title={item.customFields[subItem.fieldName]}>
                                            <span>{item.customFields[subItem.fieldName]!='' ? item.customFields[subItem.fieldName] :'-' }</span></td>)
                                        })} 
                                             </tr>
                                             <tr>

                                             <td colSpan={10 + this.state.poDetails.config.poLineItemCustomFields.length + (this.state.poDetails.config.billDiscountingMethodology=="lineItem-column" ? 1:0) + (this.state.poDetails.config.convenienceFeeMethodology=="lineItem-column" ? 1:0)} className="textL trBg cursorP"   onClick={this.toggleAccordion.bind(this, index)}>
                                                 {item.status.current.status ==="Rejected" || item.status.current.status ==="Short Closed"||item.status.current.status ==="Cancelled" ? null :<img width="25px"
                                                 src={item.accordionData? ENV_VARIABLE.IMAGE_URL + "dropdown_icon.png":ENV_VARIABLE.IMAGE_URL + "dropdown_icon_up.png"}
                                                 />}
                                                 <span className="statusColor">{item.status.current.status}</span>
                                            </td>
                                             {/* <td colSpan ={5}></td> */}                                          
                                             </tr>   
                                             {!item.accordionData ?
                                                 <tr className="bgTr">
                                                    <td colSpan={10 + this.state.poDetails.config.poLineItemCustomFields.length + (this.state.poDetails.config.billDiscountingMethodology=="lineItem-column" ? 1:0) + (this.state.poDetails.config.convenienceFeeMethodology=="lineItem-column" ? 1:0)}>
                                                   {item.status.current.status ==="Saved" ? <Saved/>:null}
                                                    {item.status.current.status ==="Sent To Supplier" ? <SentToSupplier/>:null}
                                                    {item.status.current.status ==="Ready to Ship" ? <ReadyToShip/>:null}
                                                    {item.status.current.status ==="Partially Shipped" ? <PartialShipped/>:null}
                                                    {item.status.current.status ==="Shipped" ? <Shipped/>:null}
                                                    {item.status.current.status ==="Partially Delivered" ? <PartialDelivered/>:null}
                                                    {item.status.current.status ==="Delivered" ? <Delivered/>:null}    
                                                    
                                                    </td>                                                      
                                                 </tr> :null
                                             }
                                             </tbody>                                             
                                        )

                                        })
                                    }
     
                                    <tbody>
                                        <tr>
                                            <td colSpan={7} className="textL valign"><label className="delivery">
                                            Delivery Date: </label>{this.state.poDetails.deliveryDate ? CommonApi.dateConvert(this.state.poDetails.deliveryDate): "NA"}</td>
                                            <td colSpan={5 + (this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?1:0) + (this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	1:0)} className="pad0">
                                                <table cellPadding="0" cellSpacing="0" className="plCharges">
                                                    <tbody>
                                                    <tr>
                                                        <td colSpan={this.state.poDetails.config.billDiscountingMethodology ? 4:2}>SubTotal (&#8377;)</td>
                                                        <td colSpan={3}>{CommonApi.amountConvert(this.state.poDetails.payable[0].subTotal)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={this.state.poDetails.config.billDiscountingMethodology ? 4:2}>GST (&#8377;)</td>
                                                        <td colSpan={3}>{CommonApi.amountConvert(this.state.poDetails.payable[0].GST)}</td>
                                                    </tr>
                                                    <tr>
														{
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td></td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td ></td>:null
														}
                                                        
                                                    </tr>
                                                    <tr>
                                                        <td className="LightColor">Service Name</td>
                                                        <td className="LightColor">Amount (&#8377;)</td>
                                                        <td className="LightColor">SAC Code</td>
                                                        <td className="LightColor">GST (&#37;)</td>
														{
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td className="LightColor">Bill Discounting Fee (&#8377;)</td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td className="LightColor">Msupply Fee (&#8377;)</td>:null
														}
														
                                                        <td className="LightColor">Total Amount (&#8377;)</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="LightColor">Transportation</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.shippingCostBasicValue}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.shippingCostSACCode!=''? this.state.poDetails.payable[0].transportationCharges.shippingCostSACCode : '-'}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.shippingCostGSTPercentage}</td>
														{
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.shippingCostBillDiscountingFee}</td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.shippingCostMsupplyFee}</td>:null
														}
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.shippingCostValue}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="LightColor">Loading</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.loadingBasicValue}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.loadingSACCode!=''? this.state.poDetails.payable[0].transportationCharges.loadingSACCode : '-'}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.loadingGSTPercentage}</td>
                                                        {
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.loadingBillDiscountingFee}</td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.loadingMsupplyFee}</td>:null
														}
														<td>{this.state.poDetails.payable[0].transportationCharges.loadingValue}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="LightColor">Unloading</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.unloadingBasicValue}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.unloadingSACCode!='' ?  this.state.poDetails.payable[0].transportationCharges.unloadingSACCode:'-'}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.unloadingGSTPercentage}</td>
														{
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.unloadingBillDiscountingFee}</td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.unloadingMsupplyFee}</td>:null
														}
													   <td>{this.state.poDetails.payable[0].transportationCharges.unloadingValue}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="LightColor">Insurance</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.insuranceBasicValue}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.insuranceSACCode!='' ?  this.state.poDetails.payable[0].transportationCharges.insuranceSACCode:'-'}</td>
                                                        <td>{this.state.poDetails.payable[0].transportationCharges.insuranceGSTPercentage}</td>
                                                        {
														 this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.insuranceBillDiscountingFee}</td>:null
														}
														{
														 this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	
														<td>{this.state.poDetails.payable[0].transportationCharges.insuranceMsupplyFee}</td>:null
														}
														<td>{this.state.poDetails.payable[0].transportationCharges.insuranceValue}</td>
                                                    </tr>
                                                    {
                                                        this.state.poDetails.config.billDiscountingMethodology == "transaction"?
                                                        <tr  className="trBg">
                                                        <td colSpan={4+(this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?1:0) + (this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	1:0)} className="totalData">Total Bill Discount Fee (&#8377;)</td>
                                                        <td colSpan={1}>{this.state.poDetails.payable[0].transportationCharges.extraCharges.billDiscountingFeeValue.toFixed(2)}</td>                                                        
                                                    </tr>:null

                                                    }
                                                    {
                                                        this.state.poDetails.config.convenienceFeeMethodology == "transaction"?
                                                        <tr className="trBg">
                                                        <td colSpan={4+(this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?1:0) + (this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	1:0)} className="totalData">Total mSupply Fee (&#8377;)</td>
                                                        <td colSpan={1}>{this.state.poDetails.payable[0].transportationCharges.extraCharges.msupplyFeeValue.toFixed(2)}</td>                                                        
                                                    </tr>:null

                                                    }
                                                   
                                                    <tr className="trBg">
                                                        <td colSpan={4+(this.state.poDetails.config.billDiscountingMethodology == "lineItem-column" ?1:0) + (this.state.poDetails.config.convenienceFeeMethodology == "lineItem-column" ?	1:0)} className="totalData">Grand Total (&#8377;)</td>
                                                        <td colSpan={1}><b>{this.state.poDetails.payable[0].grandTotal}</b></td>                                                    
                                                    </tr>  
                                                    </tbody> 
                                                </table>                                            
                                            </td>
                                        </tr>
                                    </tbody>
                                    
                                
                          
                        </table>
                    </div>
                    <div className="payment-details">
                    <ul className="flex flexOne">
                            <li>                                
                                <ul>
                                    <li><h3>Payment Details</h3></li>
                                    <li><label>Credit: </label>
                                        <span>{this.state.poDetails.paymentTerms.creditType == 'single' ? "Single Payment":""}</span>
                                        <span >{this.state.poDetails.paymentTerms.creditType == 'multiple' ? "Multiple Payment":""}</span>
                                    </li>
                                    <li>
                                        <label>Credit Period: </label>
                                        <span>{this.state.poDetails.paymentTerms.creditType == 'single' ? this.state.poDetails.paymentTerms.creditPeriod + " Days": ""}</span>
                                        
                                        {this.state.poDetails.paymentTerms.creditType == 'multiple'?
                                            <table className="width80">
                                                <thead>
                                                    <tr>
                                                    <th width="6%">No. Of Days</th>
                                                    <th width="6%">Payment %</th>
                                                    </tr>
                                                </thead>
                                                <tbody>                                                    
                                                    {this.state.poDetails.paymentTerms.schedule!='' &&  this.state.poDetails.paymentTerms.schedule!=undefined &&this.state.poDetails.paymentTerms.schedule.map((item)=>{
                                                        return(<tr>
                                                            <td>{item.interval}</td>
                                                            <td>{item.value}</td>
                                                        </tr>)
                                                    })}
                                                </tbody>
                                            </table>
                                        :null}                                    
                                    </li>
                                </ul>
                            </li>
                            <li><h3>Documents &amp; Attachments</h3>
                                <ul className="decimal">
                                    {this.state.poDetails.attachmentFile.map((item, index) => {
                                        return (<li key={"item"+index}><a name={item}onClick={this.fileDownload}>{item.split("-").slice(0, -1).join("-") + "."+ item.split(".").pop()}</a></li>)
                                    })}
                                </ul>
                            </li>
                            <li><h3>Terms &amp; Conditions</h3>            
                                <ul className="decimal">                                    
                                    <li>{this.state.poDetails.otherTerms}</li>
                                </ul>
                            </li>
                    </ul>

                    </div>               
                    <Modal crossBtn="true" isOpen={this.state.showCancelPopup} className="popupHeader" header ="BIZ PO Status" height="200px"  width="400px"  onClose = {() =>{this.setState({showCancelPopup : false})}} >
                                    <p className="popHeader"> Are you sure you want to BIZ PO Status?</p>                                    
                             <div style = {{width: "90%", marginLeft: "6%",justifyContent:"space-evenly",display:"flex"}}>
                                        <Button display="1" type="button" click={()=>this.CancelReasonPo(this.state.setBizUpdateFlag)} value="Yes"/>
                            </div>
                    </Modal>

                    <Modal crossBtn="true" isOpen={this.state.CancelReason} header="Select Reason" height="250px" width="400px" onClose={() =>{this.setState({CancelReason : false})}}>
                        <div style = {{width: "90%", margin: "3%"}}>
                            {this.state.reasonCodes!=undefined ? 
                                <Dropdown  name="cancellationReason" id="poCancel" value ={this.state.cancellationReason} change={this.handleChangeReason} label = {this.state.setBizUpdateFlag === "rfa" ? 
                                "Select Amendment Reason":"Select Rejection Reason"}
                                options={this.state.reasonCodes}  /> 
                            :null
                            }
                            {this.state.reasonErrorFlag == true ? <p>{this.state.reasonErrorMessage}</p>:null}
                        </div>   
                            <button className="firstSubmit" onClick={()=>this.submitBtn(this.state.poDetails,this.state.setBizUpdateFlag)}>Submit</button>
                    </Modal>
                    <Modal isOpen={this.state.successPopup} className="popupHeader"
                    header ="Success" height="auto"  width="400px" >
                         <p>{this.state.successMsg}</p>
                         <button type="button" onClick= {this.refreshPage} className="firstSubmit">OK</button>
                    </Modal>

                    <Modal crossBtn ="true" isOpen={this.state.paymentDetailsPopup} className="popupHeader" header ="Change Payment Terms"  
                    width="500px" height="400px"  onClose = {() =>{this.setState({paymentDetailsPopup : false})}} >
                           <form>
                         
                                <div className="marginTop1"> <label>Supplier Name: </label><b>{this.state.poDetails.addressLineItemMapping["0"][0].mappingSellerName}</b>   </div>
                                <div className="marginTop1">  <label>Current Payment Terms to Supplier :</label><b> </b> </div>                                
                                <div className="marginTop1"> 
                                    <label>Credit Period: </label>
                                    <span>{this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditType == 'single' ? this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod + " Days": ""}</span>
                                    
                                    {this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditType == 'multiple'?
                                        <table className="width80">
                                            <thead>
                                                <tr>
                                                <th width="6%">No. Of Days</th>
                                                <th width="6%">Payment %</th>
                                                </tr>
                                            </thead>
                                            <tbody>                                                    
                                                {this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.schedule!='' &&  this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.schedule!=undefined &&this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.schedule.map((item, index)=>{
                                                    return(<tr key={"addressLine"+index}>
                                                        <td>{item.interval}</td>
                                                        <td>{item.value}</td>
                                                    </tr>)
                                                })}
                                            </tbody>
                                        </table>
                                    :null}
                                </div>
                                <div className="marginTop10">   
                                <p>{this.state.errorMsg}</p>
                                     <p>New Payment Terms:</p>                                       
                                    {
                                        this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditType === 'single'?
                                        <Text type="number" max="100" name="advance" label="Advance Percentage"
                                        style = {{width:"50%", paddingTop:"18px",float:"left"}}
                                        id = "advance" change={this.handleChange} maxlength='3' value ={this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.advance}/> : null
                                    }
                                       {
                                        this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditType === 'single'?
                                        <Text type="number" name="creditPeriod" label="No. of Days"
                                        style = {{paddingLeft:"25px", width:"50%", paddingTop:"18px",float:"left"}}
                                        id = "creditPeriod" change={this.handleChange} value ={this.state.poDetails.addressLineItemMapping["0"][0].mappingPaymentTerms.creditPeriod}/> : null
                                    }               
                                    <button type="button" onClick={()=> this.updatePaymentTerms(this.state.poDetails)} className="btn_with_yellow_border"
                                     style = {{margin:"20px auto"}}
                                    >Update</button>                     
                                  </div>
                               
                            </form>
                           
                    </Modal>
                    <Modal crossBtn ="true" isOpen={this.state.paymentDetailsPopupSuccess} className="popupHeader" header ="Success"  
                    width="400px" height="auto" onClose = {() =>{this.setState({paymentDetailsPopupSuccess : false})}} >
                         <p>Payment Terms has been updated successfully</p>
                    </Modal>

                    {/**********************************************************************
                    ************************Supplier Issue Modals***************************
                    ***********************************************************************/}

                    <Modal 
                        isOpen={this.state.supplierPO} 
                        className="popupHeader" 
                        header ="Issue PO to Supplier"  
                        width="500px"  

                        onClose = {() =>{this.setState({supplierPO : false})}} position="initial"
                    >
                        
                        <form className="msForm">
                             <div className="msFormGr">
                                <Text 
                                    labelWidth="0" 
                                    placeholder="Reference Id *"  
                                    name="refId" 
                                    value={this.state.data.refId} 
                                    change={this.handleChangeData}  
                                    errorMessage={this.state.errors.refId}
                                    className="inputControl"
                                    submitted={this.state.formSubmitted} 
                                />
                            </div>

                            
                            <div className="msFormGr">
                          
	
                                <Text 
                                    type="date" 
                                    max={currentDate}
                                    labelWidth="0" 
                                    placeholder="Reference PO Date *" 
                                    name="refPoDate"
                                    value={this.state.data.refPoDate} 
                                    change={this.handleChangeData} 
                                    errorMessage={this.state.errors.refPoDate}
                                    className="inputControl"
                                    submitted={this.state.formSubmitted}
                                />
                            </div>





                             <div className="msFormGr">
                                <Text 
                                    type="text" 
                                    labelWidth="0" 
                                    placeholder="Supplier Search"
                                    name="suplierSearch" 
                                    value={this.state.data.setSellerName} 
                                    change={this.handleChangeData} 
                                    
                                    className="inputControl"
                                    submitted={this.state.formSubmitted}
                                />
                                <img 
                                    src={ENV_VARIABLE.IMAGE_URL+"Search_icon.svg"} 
                                    className="absIconText" 
                                    onClick={() =>this.supplierChange()}
                             
                                />
                            </div>
                            
                            <div className="msFormGrm">
                                <h3>New Payment Terms</h3>
                            </div>

                             <div className="msFormGrm">
                                <div className="msRow">
                                 <div className={this.state.data.advPercentage != 100?"msCol6":"msCol12"}>
                                        <Text 
                                          
                                            labelWidth="0" 
                                            placeholder="Advance Percentage % *" 
                                            name="advPercentage" 
                                            validation='advPercentage'
                                            value={this.state.data.advPercentage} 
                                            change={this.handleChangeData} 
                                            errorMessage={this.state.errors.advPercentage}
                                            className="inputControl"
                                            width="100%"
                                            submitted={this.state.formSubmitted}
                                        />
                                    </div>
                                    {this.state.data.advPercentage != 100? (
                                        <div className="msCol6">
                                                <Text 
                                                type="text" 
                                                labelWidth="0" 
                                                placeholder="No Of Days *" 
                                                name="noOfDays" 
                                                width="100%"
                                                height="auto"
                                                value={this.state.data.noOfDays} 
                                                change={this.handleChangeData} 
                                                errorMessage={this.state.errors.noOfDays}
                                                className="inputControl"
                                                submitted={this.state.formSubmitted}
                                            />
                                        </div>
                                    ):null}
                                        
                                    
                                </div>

                                <div className="msRow">
                                    <div className="msCol12">
                                        <button 
                                            type="button" 
                                            className="btn_with_yellow_border"
                                            style = {{margin:"20px"}}
                                            onClick= {this.refreshPage} 
                                        >
                                            Cancel
                                        </button>                     

                                        <button 
                                            type="button" 
                                            className="btn_with_yellow_border"
                                            style = {{margin:"20px"}}
                                            onClick={this.submitSipplier}
                                        >
                                            Submit
                                        </button>                     
                                    </div>
                                </div>

                            </div>
                        </form>
                    </Modal>
                    

                    {/************** Modal for Change Supplier **************/}
                    
                    <Modal
                        crossBtn ="true" 
                        isOpen={this.state.supplierModalStatus} 
                        className="popupSupplierChange"
                        header ="Change Supplier"  
                        width="700px"  
                        onClose = {() =>{this.setState({supplierModalStatus : false})}} 
                    >
                        <form className="msFormSupplierChange" >
                        
                    
                        <div className="radioBlock">
                            <div className="msRow">
                                <div className="msCol6">
                                    <Radio 
                                        type="radio"
                                        id="quoted"
                                        name="supplierEmpanel"
                                        value="quoted"
                                        onChange={(e) => this.handleChangeRadio(e)}
                                        checked={this.state.supplierQuted === "quoted"} 
                                        label="Suppliers Quoted"
                                    />
                                </div>
                                <div className="msCol6">
                                    <Radio 
                                        type="radio"
                                        name="supplierEmpanel"
                                        id="advance"
                                        value="advance"
                                        onChange={(e) => this.handleChangeRadio(e)}
                                        checked={this.state.supplierQuted === "advance"} 
                                        label="Advance Search/Other Suppliers"
                                    
                                    />
                                </div>
                            </div>
                        </div>

                     {this.state.supplierQuted === "advance"?
                            (<div>
                                <div className="msRow mrt20">
                                    <div className="msCol4">
                                        
                                        <select 
                                            
                                            className="inputControl locationSupp"
                                            placeholder="Select State"
                                            onChange={this.handleStateChange}
                                            value={this.state.stateSupplier}
                                        >
                                            <option value="">Select State</option>
                                        {states}
                                        </select>

                                    </div>
                                    <div className="msCol4">
                                            {this.state.cities.length>0?(
                                                <select 
                                                    className="inputControl locationSupp"
                                                    placeholder="Select City"
                                                    onChange={this.handleCityChange}
                                                    value={this.state.citySupplier}
                                                >
                                                    <option value="">Select City</option>
                                                    {cities} 
                                                </select>
                                            ):null

                                            }
                                        </div>

                                    <div className="msCol4">
                                        <Text 
                                            type="text" 
                                            change= {this.handleChangeSearch}
                                            placeholder="Search Supplier"
                                            className="searchSupp"
                                            value={this.state.searchSupplier}
                                        />
                                        <img 
                                            onClick = {this.handleSearchSupplier}
                                            src={ENV_VARIABLE.IMAGE_URL+"Search_icon.svg"}
                                            className="absIconText"
                                            
                                        />
                                    </div>
                                </div>
                    
                                <div className="msRow">
                                    <div className="msCol12">
                                        <table className="tableSupply">
                                            <thead className="theadSupply">
                                                <tr>
                                                    <th>Supplier Name</th>
                                                    <th>Phone No</th>
                                                </tr>
                                            </thead>
                                            <tbody className="tbodySupply">
                                                {this.state.suppliersAdvList.length>0?
                                                    suppliersAdvList:(<p>No results Found !</p>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ):null}
                        
                        {this.state.supplierQuted === "quoted"?
                        (
                            <div className="msRow">
                                <div className="msCol12">
                                    <table className="tableSupply">
                                        <thead className="theadSupply">
                                            <tr>
                                                <th>Supplier Name</th>
                                                <th>Phone No</th>
                                                <th>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tbodySupply">
                                            {this.state.suppliersList.length>0?
                                            supplersNodes:(<p>No results Found !</p>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ):null}

                        <div className="msRow">
                            <div className="msCol12">
                                <button 
                                    type="button" 
                                    className="btn_with_yellow_border"
                                    style = {{margin:"20px"}}
                                    onClick= {() =>{this.setState({supplierModalStatus : false})}}
                                >
                                    Cancel
                                </button>                     

                                <button 
                                    onClick={(e)=>{this.submitSupplierSet(e)}}
                                    type="button" 
                                    className="btn_with_yellow_border"
                                    style = {{margin:"20px"}}
                                >
                                    Submit
                                </button>  
                            </div>  
                        </div>
                        </form>
                    </Modal>

                    {/*******************************************************
                    ***************  Modal for Re Issue New Supplier PO******
                    *********************************************************/}
                    <Modal 
                        crossBtn ="true" 
                        isOpen={this.state.rIsupplierPO} 
                        className="popupHeader" 
                        header ="Re-Issue PO to Supplier"  
                        width="500px"  
                        onClose = {() =>{this.setState({rIsupplierPO : false})}} 
                    >
                        
                        <form className="msForm">
                            <div className="msFormGr">
                                <Text 
                                    type="text" 
                                    labelWidth="0" 
                                    placeholder="Supplier Search"
                                    name="rIsuplierSearch" 
                                    value={this.state.data.rIsetSellerName} 
                                    change={this.rIhandleChangeData} 
                                    className="inputControl"                                 
                                />
                                <img 
                                    src={ENV_VARIABLE.IMAGE_URL+"Search_icon.svg"}
                                    className="absIconText"
                                    onClick={() =>this.rIsupplierChange()}
                             
                                />
                            </div>
                            
                            <div className="msFormGrm">
                                <h3>New Payment Terms</h3>
                            </div>

                             <div className="msFormGrm">
                                <div className="msRow">
                                 <div className={this.state.rIdata.rIadvPercentage != 100?"msCol6":"msCol12"}>
                                        <Text 
                                          
                                            labelWidth="0" 
                                            placeholder="Advance Percentage % *" 
                                            name="rIadvPercentage" 
                                            validation='advPercentage'
                                            value={this.state.rIdata.rIadvPercentage} 
                                            change={this.rIhandleChangeData} 
                                            errorMessage={this.state.rIerrors.rIadvPercentage}
                                            className="inputControl"
                                            width="100%"
                                            submitted={this.state.rIformSubmitted}
                                        />
                                    </div>
                                    {this.state.data.rIadvPercentage != 100? (
                                        <div className="msCol6">
                                                <Text 
                                                type="text" 
                                                labelWidth="0" 
                                                placeholder="No Of Days *" 
                                                name="rInoOfDays" 
                                                width="100%"
                                                height="auto"
                                                value={this.state.rIdata.rInoOfDays} 
                                                change={this.rIhandleChangeData} 
                                                errorMessage={this.state.rIerrors.rInoOfDays}
                                                className="inputControl"
                                                submitted={this.state.rIformSubmitted}
                                            />
                                        </div>
                                    ):null}
                                        
                                    
                                </div>

                                <div className="msRow">
                                    <div className="msCol12">
                                        <button 
                                            type="button" 
                                            className="btn_with_yellow_border"
                                            style = {{margin:"20px"}}
                                          
                                            onClick= {this.refreshPage} 
                                        >
                                            Cancel
                                        </button>                     

                                        <button 
                                            type="button" 
                                            className="btn_with_yellow_border"
                                            style = {{margin:"20px"}}
                                            onClick={this.rIsubmitSipplier}
                                        >
                                            Submit
                                        </button>                     
                                    </div>
                                </div>

                            </div>
                        </form>
                    </Modal>
                    

                    {/*******************************************************
                    *************** Modal for Change Supplier ***************
                    *********************************************************/}
                    
                    <Modal
                        crossBtn ="true" 
                        isOpen={this.state.rIsupplierModalStatus} 
                        className="popupSupplierChange"
                        header ="Change Supplier"  
                        width="700px"  
                        onClose = {() =>{this.setState({rIsupplierModalStatus : false})}} 
                    >
                        <form className="msFormSupplierChange" >
                        
                    
                        <div className="radioBlock">
                            <div className="msRow">
                                <div className="msCol6">
                                    <Radio 
                                        type="radio"
                                        id="quoted"
                                        name="resupplierEmpanel"
                                        value="quoted"
                                        onChange={(e) => this.rIhandleChangeRadio(e)}
                                        checked={this.state.rIsupplierQuted === "quoted"} 
                                        label="Suppliers Quoted"
                                    />
                                </div>
                                <div className="msCol6">
                                    <Radio 
                                        type="radio"
                                        name="resupplierEmpanel"
                                        id="advance"
                                        value="advance"
                                        onChange={(e) => this.rIhandleChangeRadio(e)}
                                        checked={this.state.rIsupplierQuted === "advance"} 
                                        label="Advance Search/Other Suppliers"
                                    
                                    />
                                </div>
                            </div>
                        </div>
                        

                       

                    {this.state.rIsupplierQuted === "advance"?
                    (
                        <div>
                                <div className="msRow mrt20">
                                    <div className="msCol4">
                                        
                                        <select 
                                            
                                            className="inputControl locationSupp"
                                            placeholder="Select State"
                                            onChange={this.rIhandleStateChange}
                                            value={this.state.rIstateSupplier}
                                        >
                                            <option value="">Select State</option>
                                        {rIstates}
                                        </select>

                                    </div>
                                    <div className="msCol4">
                                            {this.state.rIcities.length>0?(
                                                <select 
                                                    className="inputControl locationSupp"
                                                    placeholder="Select City"
                                                    onChange={this.rIhandleCityChange}
                                                    value={this.state.rIcitySupplier}
                                                >
                                                    <option value="">Select City</option>
                                                    {rIcities} 
                                                </select>
                                            ):null

                                            }
                                        </div>

                                    <div className="msCol4">
                                        <Text 
                                            type="text" 
                                            change= {this.rIhandleChangeSearch}
                                            placeholder="Search Supplier"
                                            className="searchSupp"
                                            value={this.state.rIsearchSupplier}
                                        />
                                        <img 
                                            onClick = {this.rIhandleSearchSupplier}
                                            src={ENV_VARIABLE.IMAGE_URL+"Search_icon.svg"}
                                            className="absIconText" 
                                            
                                        />
                                    </div>
                                </div>
                    
                                <div className="msRow">
                                    <div className="msCol12">
                                        <table className="tableSupply">
                                            <thead className="theadSupply">
                                                <tr>
                                                    <th>Supplier Name</th>
                                                    <th>Phone No</th>
                                                </tr>
                                            </thead>
                                            <tbody className="tbodySupply">
                                                {this.state.rIsuppliersAdvList.length>0?
                                                    rIsuppliersAdvList:(<p>No results Found !</p>)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ):null}
                        
                        {this.state.rIsupplierQuted === "quoted"?
                        (
                            <div className="msRow">
                                <div className="msCol12">
                                    <table className="tableSupply">
                                        <thead className="theadSupply">
                                            <tr>
                                                <th>Supplier Name</th>
                                                <th>Phone No</th>
                                                <th>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody className="tbodySupply">
                                            {this.state.rIsuppliersList.length>0?
                                            rIsupplersNodes:(<p>No results Found !</p>)
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ):null}

                        <div className="msRow">
                            <div className="msCol12">
                                <button 
                                    type="button" 
                                    className="btn_with_yellow_border"
                                    style = {{margin:"20px"}}
                                    onClick= {() =>{this.setState({rIsupplierModalStatus : false})}} 
                                >
                                    Cancel
                                </button>                     

                                <button 
                                    onClick={(e)=>{this.rIsubmitSupplierSet(e)}}
                                    type="button" 
                                    className="btn_with_yellow_border"
                                    style = {{margin:"20px"}}
                                >
                                    Submit
                                </button>  
                            </div>  
                        </div>
                        </form>
                    </Modal>
                    
                    <Modal 
                        crossBtn ="true" 
                        isOpen={this.state.rIsuppllierSubMes}
                        className="popupHeader"
                        header ="Success"  
                        width="400px" 
                        height="auto" 
                        onClose = {() =>{this.setState({rIsuppllierSubMes : false})}} >
                         <p>PO Re-Issued to Supplier Successfully</p>
                         
                         <button type="button" onClick= {this.refreshPage} className="firstSubmit">OK</button>
                    </Modal>

                    <Modal 
                        crossBtn ="true" 
                        isOpen={this.state.rIsuppllierFailed}
                        className="popupHeader"
                        header ="Failed"  
                        width="400px" 
                        height="auto" 
                        onClose = {() =>{this.setState({rIsuppllierFailed : false})}} >
                         <p>Failed Re-Issued to Supplier request</p>
                         <button type="button" onClick= {this.refreshPage} className="firstSubmit">OK</button>
                    </Modal>

                </div>
            </div>:null}
        </div>

        
        )
    }
    
}
const mapStateToProps = state => {
	
    return {
      userSelectedCompany:state.companyDetailReducer,
      States : state.storeState.stateInfo
     }
  }
  export default withRouter(connect(mapStateToProps)(PODetail));
  
