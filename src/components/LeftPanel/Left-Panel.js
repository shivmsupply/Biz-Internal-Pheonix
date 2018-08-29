import React, {Component} from 'react';
import { withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import cls from 'classnames';


class LeftNavigation extends Component {
    constructor(props){
        super(props);
        // api.stg.msupply.biz/rfq/phoenix/enterprise/:enterpriseId/company/:companyId/inquirie
        this.state=
        {
            dockIn:false,
            imgPath :[
                {
                    key:1,
                    imgRight:require('../../assets/images/dropdown_icon_right.png'),
                    imgLeft:require('../../assets/images/dropdown_icon_left.png')
                }
            ]    
        }        
      this.click=  this.click.bind(this) 
      
    }
    handleClick(e){
        let dockStatus = this.state.dockIn;
        this.setState({dockIn:!dockStatus})
    }

    click(value){
       debugger;
       this.props.history.push("/"+value+"/"+(this.props.filterReducer.selectedEnterprise!=undefined&&this.props.filterReducer.selectedEnterprise!=''?this.props.filterReducer.selectedEnterprise+"/" : "")+(this.props.filterReducer.selectedEnterprise!=undefined&&this.props.filterReducer.selectedCompany!=''?this.props.filterReducer.selectedCompany+"/" : "")+(this.props.filterReducer.selectedEnterprise!=undefined&&this.props.filterReducer.selectedProject!=''?this.props.filterReducer.selectedProject+"/" : ""))
    }
    render(){let tabs;
              
         var slideClass=cls("left-panel-div",{'transitionstyle':this.state.dockIn},{'transitionstyl':!this.state.dockIn})
           tabs = <ul className="font-16 Nav-ul">    
            {/* {this.props.getAccessControl&&this.props.getAccessControl['user-create']===true?<li key={1} className="leftPanelLi" title={this.state.dockIn ? "My Actions": ""}>                
                 <a onClick={()=>this.click("my-actions")}>
                    <img src={require('../../assets/images/Dashboard.svg')} width="24px" height="24px"/>{!this.state.dockIn?<span>Registration</span> :null}</a>
             </li>:null}                 */}
         
             <li key={2} className="leftPanelLi" title={this.state.dockIn ? "View Enquiries": ""}>                
                 <a onClick={()=>this.click("view-enquiries")}>
                    <img src={require('../../assets/images/ViewEnquiry.svg')} width="24px" height="24px"/>{!this.state.dockIn?<span>View Enquiries</span> :null}</a>
             </li>
             <li key={3} className="leftPanelLi" title={this.state.dockIn ? "View Enquiries": ""}>                
                 <a onClick={()=>this.click("view-users")}>
                    <img src={require('../../assets/images/ViewEnquiry.svg')} width="24px" height="24px"/>{!this.state.dockIn?<span>Users</span> :null}</a>
             </li>
            <li key={4} className="leftPanelLi" title={this.state.dockIn ? "View Pos": ""}>                
                <a onClick={()=>this.click("list-po")}>
                <img src={require('../../assets/images/PurchaseOrder.svg')} width="24px" height="24px"/>{!this.state.dockIn?<span>View Pos</span> :null}</a>
             </li>
             <li key={5} className="leftPanelLi" title={this.state.dockIn ? "Shipment": ""}>                
                <a onClick={()=>this.click("shipment")}>
                <img src={require('../../assets/images/PurchaseOrder.svg')} width="24px" height="24px"/>{!this.state.dockIn?<span>List Shipment</span> :null}</a>
             </li> 

         </ul>      
         
            const imgFloat = this.state.imgPath.map((value)=>(
                 <img  key={value.key}  src={this.state.dockIn ? value.imgLeft: value.imgRight} 

                  onClick={this.handleClick.bind(this)} className="floatArrow"/> 
                )
            )
        return (
            <div className={slideClass} style={{    height: '100vh'}}>
                <div className="profile-section flex">
                  
                   <div className="imgCircle">
                     <img src={require('../../assets/images/No_Image_02.png')}/>
                    </div>                  
                    
                    </div>
                <div className="posRelative flex">
                    {imgFloat}   
                        {tabs}
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
  
	return {
        getAccessControl:state.storeSession.loginDetail.privilege,
        selectedInfo:state.companyDetailReducer,
        filterReducer:state.FilterReducer
     }
}




export default withRouter (connect(mapStateToProps)(LeftNavigation));

