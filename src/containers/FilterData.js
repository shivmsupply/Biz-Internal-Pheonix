import React,{ Component } from 'react';
import {Button, Text, Dropdown, Radio} from "../common/FormElements/FormElements";
import DatePicker from "a-react-datepicker";

import {withRouter} from 'react-router-dom';
const queryString = require('query-string');



 class FilterData extends Component{
    constructor(props){
        super(props);
        this.state={
            appliedFilter:{},
			filterInfo : this.props.filterInfo
        } 
		
        var searchUrl=JSON.parse(JSON.stringify(queryString.parse(this.props.location.search)));
        if(this.state.filterInfo!=undefined){
            for(var i=0;i<this.state.filterInfo.length;i++){
                if(searchUrl[this.state.filterInfo[i].key] !== null&&searchUrl[this.state.filterInfo[i].key] !== undefined){
                   if(this.state.filterInfo[i].key == "fromDate" || this.state.filterInfo[i].key == "toDate")
                    this.state.appliedFilter[this.state.filterInfo[i].key]=new Date(searchUrl[this.state.filterInfo[i].key]);
                    else
                    this.state.appliedFilter[this.state.filterInfo[i].key] = searchUrl[this.state.filterInfo[i].key];
                    
                }
                else this.state.appliedFilter[this.state.filterInfo[i].key]='';
            }
			
			if(this.state.appliedFilter.itemsPerPage == undefined)
				this.state.appliedFilter.itemsPerPage = 10;
			if(this.state.appliedFilter.pageNumber == undefined)
				this.state.appliedFilter.pageNumber = 0;
        }
       
		//console.log(this.state.appliedFilter);
		
		
		
        this.handleChange= this.handleChange.bind(this);
        this.applyAction=this.applyAction.bind(this);
		
		this.resetFilter = this.resetFilter.bind(this)
     }
	 
	  componentWillReceiveProps(){
		  var stateData = this.state;
		  stateData.filterInfo = this.props.filterInfo;
		  this.setState(stateData);
		  
	  }

    handleChange(e,data){
		
        var temp=this.state.appliedFilter
        temp[e.target.name]=e.target.value;
        this.setState({appliedFilter:temp});
		if(e.target.name == "companyId"){
			this.props.handleCompanyChange(e.target.value);
		}
	
    }
    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
		var d = inputFormat;
		return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].reverse().join('-');
	}
    resetFilter(){
        var temp=this.state.appliedFilter
        for(var i in this.state.appliedFilter){temp[i]='';}
        this.setState({appliedFilter:temp});
        this.props.resetFilter();
		
    }
    applyAction(){
		
        var t='?'
		
            for(var k in this.state.appliedFilter){
				if(this.state.appliedFilter[k] != ''&&this.state.appliedFilter[k] != null&&this.state.appliedFilter[k] != undefined && typeof this.state.appliedFilter[k].getMonth == "function"){
					t=t.concat('&').concat(k).concat('=').concat(this.convertDate(this.state.appliedFilter[k]));
				}
				else if(this.state.appliedFilter[k] != ''&&this.state.appliedFilter[k] != null&&this.state.appliedFilter[k] != undefined)    
					t=t.concat('&').concat(k).concat('=').concat(this.state.appliedFilter[k]);
				}
        this.props.applyFilter(t);

		//console.log(this.state.appliedFilter);
    }

    renderFilter(){
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
         var mainUl={width:'100%',float:'left', margin: "20px 0px", padding: "20px 20px",background: "#fafafa",display:"flex",alignItems:"center"};
         var mainLi={width:'16%',float:'left'};
		 var mainLiButton={  width: '36%',textAlign: 'right',margin: '1.2% 5px 0'};
		 var mainLiDatePicker = {width:'12%',float:'left',margin:'8px 5px'}
        var applyBtn={border:'1px solid #ffd83d',borderTopRightRadius:"0px",borderBottomRightRadius:"0px"};
        var resetBtn={background:'#fff',border:'1px solid #b5b5b5',borderTopLeftRadius:"0px",borderBottomLeftRadius:"0px"};
        return (<ul className="ListFilter"  style={mainUl}>
            {this.state.filterInfo.map((v,k)=><li key={k} style={v.key == 'fromDate'||v.key == 'toDate' ? mainLiDatePicker : mainLi}>

             {v.key == 'fromDate'||v.key == 'toDate'?<div> <label style = {{fontSize:'14px'}}>{v.label}</label>

            <DatePicker maxDate={currentDate} selected={this.state.appliedFilter[v.key]} name={v.key} onSelect = {(date,name)=>{
                 var submitData = this.state.appliedFilter;
                 submitData[name] = this.convertDate(date);
				
                 this.setState({appliedFilter:submitData});

            }}/></div>:null}  

           {v.key != 'toDate'&&v.key != 'fromDate'?<Dropdown  name={v.key} label={v.label} value ={this.state.appliedFilter[v.key]}  change={this.handleChange} disabled = {v.filterDisabled} options={v.value}  />:null}
           </li>)}
          
		 <li  style={mainLiButton}>
            <Button type="button" display="1" value="Apply" style={applyBtn} click={this.applyAction}/>
            <Button type="button" display="1" value="Reset" style={resetBtn} click={this.resetFilter}/>
        </li>
        </ul>)
    }
    
    render(){

        return <div style={{ margin: '0 auto',width: '98%'}}>
         {this.renderFilter()}
        </div>
    }
}

export default withRouter(FilterData)
