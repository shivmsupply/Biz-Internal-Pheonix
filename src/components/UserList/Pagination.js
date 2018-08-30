import React from "react";
import mainStyle from '../../assets/styles/components/main.css';
import style from "./pagination.css";
import ENV_VARIABLE from "../../utils/Environment";
import PropTypes from 'prop-types';

export default class Pagination extends React.Component{
	constructor(props){
		super(props);
		this.clickOnPage = this.clickOnPage.bind(this);
		this.getPages = this.getPages.bind(this);
		this.getStartPage = this.getStartPage.bind(this);
		this.clickOnLeft = this.clickOnLeft.bind(this);
		this.clickOnRight = this.clickOnRight.bind(this);
	}
	static propTypes = { activePage:PropTypes.number.isRequired,totalPages:PropTypes.number.isRequired };
	clickOnPage(e){
		this.props.clickOnPage(e.target.value);
	}
	getPages(){
        //debugger;
		var pages = [];
		var startPage = (this.props.activePage%4==0?Math.floor(this.props.activePage/4-1)*4:Math.floor(this.props.activePage/4)*4) + 1; 
		var i = startPage;
		while(i < startPage+4){
			if(i<=this.props.totalPages)
				pages.push(i);
			i++;
		}
		return pages.map((element)=>{return <li className={(this.props.activePage===element)?style.active:''} value={element} onClick={this.clickOnPage} key={element}>{element}</li>});
	}
	clickOnLeft(){
		this.props.clickOnPage(this.getStartPage() - 4);
	}
	clickOnRight(){
		this.props.clickOnPage(this.getStartPage() + 4);
	}
	getStartPage(){
		////debugger;
		let t=(this.props.activePage%4==0?Math.floor(this.props.activePage/4-1)*4:Math.floor(this.props.activePage/4)*4) + 1;
		return t;
	}
	render(){
		if(this.props.totalPages <= 1)
			return null;
		return (
			<div className={mainStyle.hideOverflow}>
				<ul className={mainStyle.flex+' '+style.pagination+' '+mainStyle.moveLeft}>
				  <li>
				    <img className={this.props.activePage<4?mainStyle.show:mainStyle.hide} src={ENV_VARIABLE.IMAGE_URL + "arrow-left.png"} />
				    <img onClick={this.clickOnLeft} className={style.rotate+' '+(this.props.activePage<=4?mainStyle.hide:mainStyle.show)} src={ENV_VARIABLE.IMAGE_URL + "arrow-right.png"} />
				  </li>
				  {this.getPages()}
				  <li>
				    {/* <img onClick={this.clickOnRight} className={this.getStartPage()+4<this.props.totalPages?mainStyle.show:mainStyle.hide} src={ENV_VARIABLE.IMAGE_URL + "arrow-right.png"} /> */}
				    <img className={this.getStartPage()+4<this.props.totalPages?mainStyle.hide:mainStyle.show} className={style.rotate} src={ENV_VARIABLE.IMAGE_URL + "arrow-left.png"} />
				  </li>
			    </ul>
			</div> 	
			)
	}
}