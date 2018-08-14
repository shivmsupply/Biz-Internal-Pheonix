import React from "react";
import style from "./loading.css";
export default class Loading extends React.Component{
	constructor(props){
		super(props);
	}	
	render(){

	
		if(this.props.isLoader)document.body.style.overflowY = "hidden";
		else document.body.style.overflowY = ""; 

		return (
			<div>
			{this.props.isLoader?
		<div className={style.loadBg} id="loader">
		    <div className={style['loader']}></div>
		</div>:null}
		</div>
		)
	}
	
}
