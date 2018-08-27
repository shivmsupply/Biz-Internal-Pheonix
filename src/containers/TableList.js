import React from "react";
import '../assets/styles/style.css';
import * as CommonApi  from '../common/CommonApi/commonApi';

export default class TableList extends React.Component {
    constructor(props){
        super(props);
        window.scrollTo(0,0);
		this.getPropByString = this.getPropByString.bind(this)
      this.renderColumnValue =  this.renderColumnValue.bind(this);
	  this.changeDisplayType = this.changeDisplayType.bind(this);
    }

    getPropByString(obj, propString) {
		
		
    if (!propString)
        return obj;
	
    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];
		if(!isNaN(props[i])){
			props[i] = parseInt(props[i])
		}
        var candidate = obj[prop];
        if (candidate !== undefined) {
            obj = candidate;
        } else {
            break;
        }
    }
	
	
    return obj[props[i]];
}
changeDisplayType(e){
	
	this.props.changeDisplayType(e.target.dataset.id)
	
}
renderColumnValue(item, columnItem){
	
	var renderedValue = this.getPropByString(item, columnItem.key);
	if(columnItem.headerName == "GRN"){
		if(item.GRNReceived == true){
			
			return <a to = "" onClick={()=>{columnItem.onClickFunction(item)}}>View GRN</a>
		}
		else{
			return <a to = "" onClick={()=>{columnItem.onClickFunction(item)}}>Create GRN</a>
		}
	}
	if(columnItem.onClickFunction != undefined){
	return <a to = "" onClick={()=>{columnItem.onClickFunction(item)}}>{renderedValue}</a>
	}
	else if(Array.isArray(renderedValue)){
		renderedValue = renderedValue.splice(0,5);
		return renderedValue.map((item) => {
			return <p><a>{item.displayName}</a></p>
		})
	}
	else if(columnItem.key == "date"){
		return <span>{CommonApi.dateConvert(renderedValue)}</span>
	}
	else if(columnItem.headerName.indexOf("Rs") != -1){
		return <span>{CommonApi.amountConvert(renderedValue)}</span>
	}
	else{
		return <span>{renderedValue}</span>
	}
}

    

   

    

    render()
	
    {
		
        return(
		<div className="bgLayout">
		<div>{this.props.tabs.map((item) =>{
		return(<span onClick = {this.changeDisplayType} data-id={item.value} style = {this.props.displayType == item.value ? {backgroundColor:"#ffeccb", border:"solid 1px #f6bf5e"}:null }className = "tab-style">{item.label}</span>)
		})}</div>
		
			<table className = "listTable"><thead><tr>{this.props.tableKeys.map((item, index) => {
			 return this.props.displayType == "open" && item.key == "GRNTotal"?null:<th>{item.headerName}</th>
		 })}</tr></thead>
		 {
			this.props.tableData!= undefined && this.props.tableData.length > 0 ? 
		 <tbody>
		 {this.props.tableData.map((item, index) => {
			return(<tr>
				{/* className={style[columnItem.classN]} */}
			
				{this.props.tableKeys.map((columnItem, subIndex) => {
				 return(this.props.displayType == "open" && columnItem.key == "GRNTotal"?null:<td >{this.renderColumnValue(item, columnItem)}</td>)
			
			 
				})}
			</tr>) 
			 
		 })}
		 </tbody>
		 :null
		}
		 </table>
		 </div>)
    }

    
}
