import React from 'react'
import FormValidations from "../../utils/FormValidations";

import PropTypes from 'prop-types';


export class Text extends React.Component{
	constructor(props) {/*Component used for input text*/
		super(props);
		this.state = {regexError:false};
		this.handleChange = this.handleChange.bind(this);
	}
	static propTypes = { change:PropTypes.func.isRequired,name:PropTypes.string.isRequired };
	handleChange(e){
		var validations = FormValidations.validate(this.props.validation, e.target.value);
		this.props.change(e,validations);
	}
	render(){
		const starStyle={
            'color':'#ce4646',
            'marginBottom':'4px'
        }
		var labelWid = "0";
		var inlineStyle;
		if(this.props.labelWidth != undefined)
		  {
		  	labelWid = this.props.labelWidth; 
		  	inlineStyle = {
			width : 'calc(100% - ' + (Number(labelWid)+22) + 'px)'
		     }
		  }else{
		  	inlineStyle = {
				width : 'calc(100% - ' + (Number(labelWid)) + 'px)'
		    }
		  }
		var wrapperWid = "100%";
		if(this.props.width != undefined){
			wrapperWid = Number(this.props.width) - 10;
			wrapperWid = wrapperWid + 'px'; 
		}
		console.log("disabled value ------------->", this.props)
		return (
			<div 
				style={this.props.style} 
				className="inputTextWrapper flex flex-center"
			>
				<label 
					style={this.props.labelWidth ? {width:labelWid+'px'} : null} 
					className={(this.props.label!=undefined?"show":"hide")}
				>
					{this.props.label}
					{this.props.mand?<span style={starStyle}>*</span>:null}
				</label>
				<input 
					{...this.props} 
					onKeyPress = {this.props.onKeyPress} 
					type={this.props.type==undefined?"text":this.props.type} 
					onBlur = {this.props.onBlur} 
					required={this.props.mand} 
					className={(this.props.className != undefined ? this.props.className:null)+" "+(this.props.errorMessage!=undefined&&this.props.errorMessage.length>0&&this.props.submitted?"error-border":'')} 
					value={this.props.value} 
					style={inlineStyle} 
					id={this.props.id} 
					name={this.props.name} 
					onChange={this.handleChange} 
					placeholder={this.props.placeholder} 
					tabIndex={this.props.tabindex} 
					maxLength={this.props.maxlength!=undefined?this.props.maxlength:200} 
					readOnly={this.props.readOnly}
				/>
				{/* <div style={{left:labelWid+'px'}} className={(this.props.errorMessage!=undefined&&this.props.errorMessage!='required'&&this.props.errorMessage.length>0&&this.props.submitted?style.toastActive:'')}>
					<p>{this.props.errorMessage}</p>
				</div> */}
				{this.props.errorMessageDisplay!=false?
					<div 
						style={{left:labelWid+'px'}} 
						className={"errorMsg"+ (this.props.errorMessage!=undefined&&this.props.errorMessage!='required'&&this.props.errorMessage.length>0&&this.props.submitted?"toastActive":'')}
					>
					{/* <span className={style.triangle}></span>
					<p>{this.props.errorMessage}</p> */}
					<span>{this.props.errorMessage}</span>
				</div>:null}
			</div>
		)
	}
}
/*Component used for input textarea*/
export class TextArea extends React.Component{
	constructor(props) {/*Component used for input text*/
		super(props);
		this.state = {regexError:false};
		this.handleChange = this.handleChange.bind(this);
	}
	static propTypes = { change:PropTypes.func.isRequired,name:PropTypes.string.isRequired };
	handleChange(e){
		
		var validations = FormValidations.validate(this.props.validation,e.target.value);
		this.props.change(e,validations);
	}
	render(){
		const starStyle={
            'color':'#ce4646',
            'marginBottom':'4px'
        }
		var labelWid = "0";
		var inlineStyle;
		if(this.props.labelWidth != undefined)
		  {
		  	labelWid = this.props.labelWidth; 
		  	inlineStyle = {
			width : 'calc(100% - ' + (Number(labelWid)+22) + 'px)'
		     }
		  }else{
		  	inlineStyle = {
				width : 'calc(100% - ' + (Number(labelWid)) + 'px)'
		    }
		  }
		var wrapperWid = "100%";
		if(this.props.width != undefined){
			wrapperWid = Number(this.props.width) - 10;
			wrapperWid = wrapperWid + 'px'; 
		}
		return (
			
			<div style={this.props.style} className={"inputTextWrapper"+ (this.props.disabled? "disabled":'')}>
				<label 
					style={this.props.labelWidth ? {width:labelWid+'px'} : null} 
					className={(this.props.label!=undefined?"show":"hide")} >
					{this.props.label}{this.props.mand?<span style={starStyle}>*</span>:null}
				</label>
				<textarea 
					disabled={this.props.disable?true:false} 
					value={this.props.value} name={this.props.name} 
					id={this.props.id}  
					onChange={this.handleChange} 
					placeholder={this.props.placeholder} 
					className={(this.props.errorMessage!=undefined && this.props.errorMessage.length>0 && this.props.submitted? 'error-border':'')} />
			</div>
			)
	}
}
/*Component used for Dropdown*/
export class Dropdown extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			dropdownVisible:false	
		}
		this.handleOutsideClick = this.handleOutsideClick.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.renderOptions = this.renderOptions.bind(this);
		this.find = this.find.bind(this);
	}

	find(arr,value){
		for(var i=0;i<arr.length;i++){
			if(arr[i].value === value)
				return arr[i].label;
		}
		return undefined;
	}
	handleOutsideClick(e){
		if(this.node.contains(e.target))
			return;
		this.handleClick();
	}
	handleClick(e){
		if(!this.state.dropdownVisible){
			document.addEventListener('click',this.handleOutsideClick,false);
		}else{
			document.removeEventListener('click',this.handleOutsideClick,false);
		}
		this.setState({dropdownVisible:!this.state.dropdownVisible});
	}

	handleChange(e){
		
		e.target.name = this.props.name;
		e.target.id = this.props.id;
		
		var validation = {data:'',error:'',label:''};
		validation.data = e.target.options[e.target.selectedIndex].value;
		validation.label = e.target.options[e.target.selectedIndex].label;
		this.props.change(e,validation);
		
		
	}

	renderOptions(){
		return this.props.options.map((data,index)=>{
			return (
					<li 
						className={this.props.value===data.value? "dropdownSelected" : ''} 
						key={data.value+''+index} 
						value={index} 
						onClick={this.handleOptionClick}
					>
						{data.label}
					</li>
				)
			}
		)
	}

	render(){
		const starStyle={
            'color':'#ce4646',
            'marginBottom':'4px',
            'fontSize':'17px'
		}


		var labelWid = "0";
		var inlineStyle;
		if(this.props.labelWidth != undefined){	
		    labelWid = Number(this.props.labelWidth);
		   inlineStyle = {
			width : 'calc(100% - ' + (labelWid + 10) + 'px)'
		   }
		}else{
			inlineStyle = {
				width : 'calc(100% - ' + (labelWid) + 'px)'
		   	}
		} 
		return (
			<div 
				style={this.props.style} 
				className={"dropdownWrapper flex flex-center" + (this.props.disabled?mainStyle.disabled:'')}
			>
				<label 
					style={this.props.labelWidth ? {width:labelWid+'px'} : null} 
					className={(this.props.label!=undefined?"show":"hide")}>
						{this.props.label}
						{this.props.mand?<span style={starStyle}>*</span>:null}
				</label>
				
				<select 
					defaultValue ="" 
					value = {this.props.value} 
					style= {{width:"95%"}}  
					disabled={this.props.disabled} 
					name={this.props.name} 
					onChange = {this.handleChange} 
					id="segment" 
					label="Segment" 
					className={(this.props.errorMessage!=undefined&&this.props.errorMessage.length>0&&this.props.submitted?'error-border':'')}
				>
					<option value = "" disabled>Select {this.props.placeholder}</option>
					{this.props.options&&this.props.options.map((element, index) => {
					return <option key = {index} label = {element.label} value= {element.value}>{element.label}</option>
				})
				}
                </select>
			</div>
			)
	}
}

export class File extends React.Component{
	constructor(props){
    	super(props);
    	this.state = {
    		fileSizeError : ''
    	}
    	this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
    	var files = [];
    	if(e.target.files.length + this.props.fileCount > 100){
    		this.props.onFileChange([],'Maximum 5 Files are allowed');
    		return;
    	}
    	for(var i=0;i<e.target.files.length;i++){
    		if(e.target.files[i].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || e.target.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || e.target.files[i].type == 'application/pdf' || e.target.files[i].type == 'image/jpeg' || e.target.files[i].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || e.target.files[i].type == 'application/msword' || e.target.files[i].type == 'application/vnd.ms-excel'){
    			if(e.target.files[i].size < 5242880){
    				files.push(e.target.files[i]);
    				this.props.onFileChange(files,'');
    			}else{
    				this.setState({fileSizeError : 'File size should be less than or equal to 5 MB'});
    				this.props.onFileChange([],'File size should be less than or equal to 5 MB');
    			}
    		}else
    			this.props.onFileChange([],'Please Enter valid file');
    	}
    }

	render(){
		return (
			<div 
				className={"fileWrapper" + (this.props.fileCount===100?"disabled":'')}
			>
			    <label 
				  htmlFor={this.props.id} 
				  className={this.props.submitted&&this.props.fileCount===0?'error-border':''}
				>
				  Browse
				</label>
			    <input 
				  id={this.props.id} 
				  type="file" 
				  onChange={this.handleChange} 
				  onClick={(e)=>{e.target.value=null}} 
				  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,application/pdf"
				/>
			</div>            
			)
	}
}
export class Checkbox extends React.Component{
	render(){
		return (
			  <div 
			  	className={'check-box-wrapper text-center'}
			  >
			   <input 
				   type="checkbox" 
				   id={this.props.id} 
				   name="vehicle" 
				   value={this.props.value} 
				   onChange={this.props.onChange} 
				   checked={this.props.checked} 
				/> 
				<label 
				   	htmlFor={this.props.id}
				>
					{this.props.label}
				</label>
               </div>          
			)
	}
}
export class Radio extends React.Component{
	render(){
		return (
			  <div style={this.props.style}>
               	<input
               	{...this.props}
               	value={this.props.value?this.props.value:null} 
               	type="radio" 
               	id={this.props.id} 
               	onChange={this.props.onChange} checked={this.props.checked}
               />
    			<label htmlFor={this.props.id}>{this.props.label}</label>
               </div>          
			)
	}
}
export class Button extends React.Component{
    constructor(props){
    	super(props);
    }    
	render() {
		if(this.props.display == "1")
			return (
				<button 
					type={this.props.type} 
					style={this.props.style} 
					className={"btn1" +(this.props.disabled?"disabled":'')} 
					onClick={this.props.click}
				>
					{this.props.value}
				</button>
			)
		if(this.props.display == "2")
			return (
				<button 
					type={this.props.type} 
					style={this.props.style} 
					className={"btn2"+ (this.props.disabled?"disabled":'')}
					onClick={this.props.click}
				>
					{this.props.value}
				</button>
			)
	return <span>Please mention button display</span>
	}
}
