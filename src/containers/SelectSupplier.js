import React, {Component} from 'react';
import $http from '../utils/Http';
import { withRouter } from 'react-router-dom';
import ENV_VARIABLE from "../utils/Environment";
import * as CommonApi from '../common/CommonApi/commonApi';
import { connect } from 'react-redux';
import '../assets/styles/components/enquiries.css';
const queryString = require('query-string');
// import { Text,Button, Dropdown, TextArea } from '../FormElements/FormElements';
import Modal from '../common/Modal/Modal';

class SelectSupplier extends Component {
  constructor(props) {
    super(props);
    this.state={      
        data:{
          "city": JSON.parse(JSON.stringify(queryString.parse(this.props.location.search))).city,
          "inquiryType": "SIEMENS",
          "inquirySource":"MakeAList",
          "channel":"WEB",
          "inquiryStatus":"New",
           "suppliersChoosen":[],
          "quoteFromMSupplySuppliers": true
      },
      showType:[
        {
          label:"Retailer",
          value:"Retailer"
        },
        {
          label:"Manufacturer",
          value:"Manufacturer"
        },
       {
         label:"Wholesaler",
          value:"Wholesaler"
        }
      ],
      state:"",
      city:"",
      type:'',
      supplierObj:[],
      submitPopUp:false,
      savePopUp:false,
      dockIn:[],
      inquiryId:"",
      preSelected:[],
      disabledSupplier:[],
      errorPop:false,
      finalObj:{}
      
    }
    window.scrollTo(0,0);
    this.submitData = this.submitData.bind(this);
    // //console.log("categoryisdchjs",this.props.match.params.categories)
    this.dockClick=this.dockClick.bind(this)
    this.selectCity = this.selectCity.bind(this);
    this.handleChange = this.handleChange.bind(this)
    // this.saveEnquiry = this.saveEnquiry.bind(this);
    // this.applyFilter = this.applyFilter.bind(this);
    this.applyFilter("loadData")
    this.getSupplierInfo();
  }

  getSupplierInfo() {
    // api.stg.msupply.biz/rfq/phoenix/fetchInquiryDetailsForFloat/EQ-0003-1808-0082
      $http.getWithUrl(ENV_VARIABLE.HOST_NAME+'rfq/phoenix/fetchInquiryDetailsForFloat/'+ this.props.match.params.enquiryId ,(res)=>{
          debugger
          let finalOb = res.message;
          let supplierData = res.message.floatToSupplier;
          
          // debugger
          let disabledOne ={}
          let arrayTemp = {}
          // debugger
          supplierData.map((key,index)=>{
            disabledOne[key.subCategory]={
                supplierNameArray:key.suppliers.map(_O=>{
                    return _O.supplierId;
                }),
            }
        })
          supplierData.map((key,index)=>{
              arrayTemp[key.subCategory]={
                  supplierNameArray:key.suppliers.map(_O=>{
                      return _O.supplierId;
                  }),
                  sendSupplierNameArray:key.suppliers.map(_O=>{
                    return _O;
                })
              }
          })
          // debugger
          this.setState({preSelected:arrayTemp,disabledSupplier:disabledOne,finalObj:finalOb})
    })
  } 

  goBack() {
    // this.props.history.push(this.props.location.pathname+"/"+"shipping")
    // this.props.NextStep('shipping')
    this.props.history.goBack();
  }
  reset(){
    let _t=this.state
    _t['type']=''
    _t['city']=''
    _t['state']=''
    //this.props.history.push(this.props.location.pathname);
    // //debugger
    // this.setState(_t);
   
    this.applyFilter('loadData');
  }
  applyFilter(type) {
    let body;
    let tempObj;
    let dock = this.state.dockIn;
    let _qS=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search)));
    _qS.categories.split(',').map(_t=>{
        dock.push(false);
    })
    dock[0]=true;
    // //debugger
    if(type==='loadData'){
     body = {
    "subCategories":_qS.categories.split(','),
    "city":_qS.city,
    }}
    if(type==='applydata'){
      body = {
        "subCategories":_qS.categories.split(','),
        "city": _qS.city,
        "state":this.state.state===undefined?'':this.state.state,
        "filterCity":this.state.city===undefined?'':this.state.city,
        'type':this.state.type===undefined?'':this.state.type
        }
    }
    // let supplierList=[];
    $http.postWithUrl(ENV_VARIABLE.HOST_NAME+"rfq/phoenix/inquiry/getSystemSuppliers",JSON.stringify(body),(res)=>{
      let supplierList = res.message.floatToSupplier;    
      // systemSupplier.map((key,index)=>{
      //     supplierList.push({
      //       supplier:key.suppliers,
      //         subCategory:key.subCategory            
      //     });
      // });
      debugger
      this.setState({supplierObj:supplierList});
      
    })


  }
  handleSupplier(e,idx,val,cat) {
debugger
    let suppData = this.state.data;
      let supplierArr = this.state.preSelected;
      debugger
      let fIndex = supplierArr[cat].supplierNameArray.findIndex((item)=>{
          return item== val.supplierId
      });
      debugger
      if(fIndex > -1){
        supplierArr[cat].sendSupplierNameArray.splice(fIndex,1)
      }
      else{ 
          supplierArr[cat].sendSupplierNameArray.push({
            "companyName":val.companyName,
            "supplierId":val.supplierId
          })
      }
      if(supplierArr[cat].supplierNameArray.indexOf(val.supplierId) > -1){
        supplierArr[cat].supplierNameArray.splice(supplierArr[cat].supplierNameArray.indexOf(val.supplierId), 1)
        debugger
      }
      else {
        supplierArr[cat].supplierNameArray.push(val.supplierId)
        debugger
      }
      let sellerId =[];
      // let as = supplierArr.findIndex((data1)=>{
      //   return data1.subCategory==cat})
        
      //   if(as >-1) {
      //     if(supplierArr[as].sellersIds.indexOf(val.supplierId) > -1){
      //       supplierArr[as].sellersIds.splice(supplierArr[as].sellersIds.indexOf(val.supplierId),1);            
      //     }
      //     else {
      //       supplierArr[as].sellersIds.push(val.supplierId);            
      //     }
      //   }
      //   else {
      //     sellerId.push(val.supplierId)
      //     supplierArr.push({
      //       "subCategory":cat,
      //       "sellersIds":sellerId
      //     })
      //   }
      // if(sellersId.indexOf(data.supplierId) == -1) {
      //   sellersId.push(data.supplierId)
      // }
      // else {
      //   // sellersId.splice(sellersId.indexOf(data.supplierId),1);
      // }
      // suppData["suppliersChoosen"]=supplierArr;
      this.setState({preSelected:supplierArr})

     
  }

  cityArray = [];
  selectCity(e, data) {  
    // //debugger;
    for (let i = 0; i < this.props.allState.length; i++) {
      if (data.data === this.props.allState[i].state) {
        this.cityArray = this.props.allState[i].cities.map(obj => {
          return {
            label: obj,
            value: obj
          };
        });
      }
    }
    this.handleChange(e,data)
  }
  dockClick(idx) {
    // //debugger;
    let dock = this.state.dockIn;
    dock[idx]=!dock[idx]
    this.setState({dockIn:dock})
  }
  submitData(e){

    let companyId = this.props.match.params.companyId;
    let projectId = this.props.match.params.projectId;
    let inquiryId = this.props.match.params.enquiryId;
    let finalObject = this.state.finalObj;
    debugger

    finalObject.floatToSupplier.map(o=>{
      o.suppliers=this.state.preSelected[o.subCategory].sendSupplierNameArray
     })
    // let _qS=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search))).categories.split(",");
    // if(this.state.su)
   
      // this.state.supplierObj.map(k=>{
      //   if(k.supplier.length == 0) {
      //     finalObject.suppliersChoosen.push({
      //         "subCategory":k.subCategory,
      //         "sellersIds":[]
      //       })
      //   }
      // })

  //     _qS.map(o=>{
  //       let c=true;
  //     finalObject.suppliersChoosen.map(ob=>{
  //         if(o==ob.subCategory)c=false;
  //     })
  //     if(c)finalObject.suppliersChoosen.push({subCategory:o, sellersIds: []})
  //  })
    finalObject["channel"] = "INTERNAL_PANEL";
    finalObject["status"] ="EditCompleted";
    // //debugger
    // api.stg.msupply.biz/rfq/phoenix/floatInquiryToSuppliers/:inquiryId
    debugger
   $http.postWithUrl(ENV_VARIABLE.HOST_NAME+"rfq/phoenix/floatInquiryToSuppliers/"+inquiryId, JSON.stringify(finalObject),(res)=>{

      
      if(parseInt(res.http_code) === 200){
        
        this.setState({inquiryId:res.inquiryId,submitPopUp:true})
      }
   })
  }

  submitOk() {
    this.setState({submitPopUp:false});
    this.props.history.push('/detail-enquiries/'+this.props.match.params.enterpriseID+'/'+this.props.match.params.companyId+ '/'+ this.props.match.params.projectId +'/'+this.props.match.params.enquiryId)
  }

  handleChange(e, data) {
    // //debugger;
    var submitData = this.state;
    submitData[e.target.name] = data.data;
    this.setState( submitData);
  }

//   saveEnquiry() {
//     let companyId = this.props.match.params.companyId;
//     let projectId = this.props.match.params.projectId;
//     let inquiryId = this.props.match.params.inquiryId;
//     let finalObject = this.state.data;
//     finalObject["inquiryStatus"] = "Saved";
//     let _qS=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search))).categories.split(",");
//     this.state.supplierObj.map(k=>{
//       if(k.supplier.length == 0) {
//         finalObject.suppliersChoosen.push({
//             "subCategory":k.subCategory,
//             "sellersIds":[]
//           })
//       }
//     })
//     // //debugger
//     // finalObject.suppliersChoosen.map(key=>{
//     //   _qs.map(k=>{
//     //     //console.log(k);
//     //   })
//     // })
   
//     _qS.map(o=>{
//       let c=true;
//     finalObject.suppliersChoosen.map(ob=>{
//         if(o==ob.subCategory)c=false;
//     })
//     if(c)finalObject.suppliersChoosen.push({subCategory:o, sellersIds: []})
//  })

//     // if(finalObject.suppliersChoosen.length === 0) {
//     //   this.setState({errorPop:true})
//     //     return
//     // }
//     // finalObject.suppliersChoosen.map(key=>{
//     //   if(key.sellersIds.length == 0){
//     //     this.setState({errorPop:true})
//     //     return 
//     //   }
//     // })

//    $http.postWithUrl(ENV_VARIABLE.HOST_NAME+"rfq/inquiry/suppliers/"+companyId +'/'+projectId+'/'+inquiryId, JSON.stringify(finalObject),(res)=>{

//       if(parseInt(res.http_code) === 200){
        
//         this.setState({inquiryId:res.inquiryId,savePopUp:true})
//       }
//    })
//   }

    render() {
      // //console.log(this.state.suppliersChoosen)
        return(
            <div>
                  {/* <ul className="flex flexbtn supplierFilter"> 
                        <li><Dropdown name="type" placeholder="Supplier Type" change={this.handleChange} options={this.state.showType} value={this.state.type} /></li> */}
                        {/* <li><Dropdown name="state" placeholder="State" change={this.selectCity}  options={this.props.allState.map(obj => {
                            return { label: obj.state, value: obj.state };
                      })} value={this.state.state}  /></li>
                        <li><Dropdown name="city" placeholder="City" change={this.handleChange} options={this.cityArray} value={this.state.city} /></li> */}
                        {/* <li className="textRight"><button className="btn_with_yellow_border" onClick={()=>this.applyFilter('applydata')}>Apply</button>
                        <button className="btn_with_yellow_border" onClick={()=>this.reset()}>Reset</button></li>
                   </ul> */}
                <div>
           
                {this.state.supplierObj ? this.state.supplierObj.map((key,index)=>{
                
                  return <div> 
                  <div className="cateName"  onClick={()=>this.dockClick(index)}>
                      {CommonApi.splitCamelCase(key.subCategory)} 
                      {/* <label>Selected Supplier{this.state.data.suppliersChoosen[index].length}</label> */}
                    <img width="25px" className="moveRight" src={this.state.dockIn[index] ? 
                      ENV_VARIABLE.IMAGE_URL + "dropdown_icon_up.png":ENV_VARIABLE.IMAGE_URL + "dropdown_icon.png"} />
                  </div>
                  {key.suppliers.length > 0 ?<div className={this.state.dockIn[index] ?  "overFlow" : "close"}>
                   <table className="compTable">
                    <thead>
                      <tr>
                        <th width="10%"></th>
                        <th width="20%">Supplier</th>
                        <th width="20%">Location</th>
                        <th width="20%">Type</th>
                        {/* <th width="20%">Brand</th> */}
                      </tr>
                    </thead>
                    <tbody>   
                      {key.suppliers.map((item,indx)=>{    
                          return <tr>
                            <td>
                              <input id={index} type="checkbox" value={this.state.data.suppliersChoosen[index]}
                            
                              onClick={(event)=>this.handleSupplier(event,index,item,key.subCategory)}
                              disabled={this.state.disabledSupplier[key.subCategory]&&this.state.disabledSupplier[key.subCategory]["supplierNameArray"].indexOf(item.supplierId) > -1 ? true:false}
                              checked={this.state.preSelected[key.subCategory]&&this.state.preSelected[key.subCategory]["supplierNameArray"].indexOf(item.supplierId) > -1 ? true:false}
                              
                              />
                            </td>
                            <td>{item.companyName}</td>
                            <td>{item.city}</td>
                            <td>{item.type}</td>
                            {/* <td>{item.brand}</td> */}
                          </tr>
                      })
                     }       
                    </tbody>
                </table>
                </div>:<div style={{textAlign:"center"}} className={this.state.dockIn[index] ?  "overFlow" : "close"}>No Supplier</div>}
                </div>
              }) :null}
                  
                  {/* <Button type="button" display="1" style= {{ marginTop:"10px"}} value="Submit" click={this.submitData}/> */}
                  <div className="buttons">
                    <button onClick={()=>this.goBack()} className="btn_with_yellow_border mar-10">Back</button>
                    {/* <button type="button" className={styles.btn_with_yellow_border + " "+ styles["mar-10"]} onClick={()=>this.saveEnquiry()}>Save</button> */}
                    <button onClick={this.submitData} type="button" className="btn_with_yellow_border mar-10">Submit</button>
                  </div>
                </div>
                <Modal header="Error" isOpen={this.state.errorPop} onClose={()=>{this.setState({errorPop:false})}}><p><b>Please select at least one supplier at each category</b></p>
                  <button type="button" className="btn_with_yellow_border" onClick={()=>{this.setState({errorPop:false})}}>OK</button>
                </Modal>
                <Modal header="Success" isOpen={this.state.submitPopUp} onClose={()=>{this.setState({submitPopUp:false})}}><p><b>{this.state.inquiryId}</b></p><p>Successfully Floated</p>
                  <button type="button" className="btn_with_yellow_border" onClick={this.submitOk.bind(this)}>OK</button>
                </Modal>
                <Modal header="Success" isOpen={this.state.savePopUp} onClose={()=>{this.setState({savePopUp:false})}}><p><b>{this.state.inquiryId}</b></p><p>Successfully Saved</p>
                  <button type="button" className="btn_with_yellow_border" onClick={this.submitOk.bind(this)}>OK</button>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = state => {
    // debugger
  return {
    allState: state.storeState.stateInfo,
    accessRole:state.companyDetailReducer.currentCompanyDetail,
    companyID: state.companyDetailReducer.companyId,
    loginDetail: state.storeSession.loginDetail
  };
  
};
export default withRouter(connect(mapStateToProps)(SelectSupplier));
// export default withRouter(SelectSupplier);