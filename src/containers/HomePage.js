// IMPORT PACKAGE REFERENCES

import React, {Component} from 'react';
import '../assets/styles/style.css';
// COMPONENT
class HomePage  extends Component{
	constructor(props){
        super(props);
	}
	render(){
		return(
		<main>
			<div className="jumbotron jumbotron-fluid text-dark bg-light animated fadeIn">
				Home		       
			</div>
		</main>
		);
	}
}

export default HomePage;