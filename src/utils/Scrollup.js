import React from "react";
import style from "../../styles/homepage.css";
import ENV_VARIABLE from "../Util/Environment";
import Scroll from "../Util/Scroll";
export default class ScrollUp extends React.Component{ /*Main component responsible for handling dynamic views*/
	constructor(props){
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(){
		Scroll.scroll('app');
	}	
	render(){
		return (
			<div style={{backgroundImage:'url('+ENV_VARIABLE.IMAGE_URL+'scroll_up.png)'}} className={style.scrollup} onClick={this.handleClick}></div>
		)
	}
	
}