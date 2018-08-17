import React,{Component} from 'react';
import ReactDom, { render } from 'react-dom';
// import styles from './ProgressBar.css';

export class Saved extends Component
{
    render(){
        return(
                
                <ul className="progessbar">
                    <li className="oval alignCenter">Saved</li>
                    <li><hr className="line"></hr></li>
                    <li title = "Ready To Ship" className="circle alignCenter"></li>
                    <li><hr className="line"></hr></li>
                    <li title = "Shipped" className="circle alignCenter"></li>
                    <li><hr className="line"></hr></li>
                    <li className="oval1 alignCenter">Delivered</li>
                </ul>

        )
    }
}
export class SentToSupplier extends Component
{
    render(){
        return(
            <ul className="progessbar">
                <li className="oval alignCenter">Sent To Supplier</li>
                <li><hr className="line"></hr></li>
                <li title = "Ready To Ship" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title = "Shipped" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li className="oval1 alignCenter">Delivered</li>
            </ul>
        )
    }
}
export class ReadyToShip extends Component
{
    render(){
        return(
                
            <ul className="progessbar">                
                <li title = "Sent to Supplier" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li className="oval alignCenter">Ready To Ship</li>
                <li><hr className="line"></hr></li>
                <li title = "Shipped" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li className="oval1 alignCenter">Delivered</li>
            </ul>

        )
    }
}
export class PartialShipped extends Component
{
    render(){
        return(
                
            <ul className="progessbar">
                
                <li title = "Sent to Supplier" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title ="Ready To Ship" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li className="oval alignCenter">Partially shipped</li>
                <li><hr className="line"></hr></li>
                <li title ="Shipped" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li className="oval1 alignCenter">Delivered</li>
            </ul>

        )
    }
}
export class Shipped extends Component
{
    render(){
        return(
                
            <ul className="progessbar">
                
                <li title = "Sent to Supplier" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title ="Ready To Ship" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li  className="oval  alignCenter">Shipped</li>
                <li><hr className="line"></hr></li>
                <li className="oval1 alignCenter">Delivered</li>
            </ul>

        )
    }
}
export class PartialDelivered extends Component{
    render(){
        return(
                
            <ul className="progessbar">
                
                <li title = "Sent to Supplier" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title ="Ready To Ship" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title = "Shipped" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li  className="oval alignCenter">Partially Delivered</li>
                <li><hr className="line"></hr></li>
                <li className="oval1 alignCenter">Delivered</li>
            </ul>

        )
    }
}
export class Delivered extends Component{
    render(){
        return(
                
            <ul className="progessbar">
                
                <li title = "Sent to Supplier" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title ="Ready To Ship" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li title = "Shipped" className="circle alignCenter"></li>
                <li><hr className="line"></hr></li>
                <li  className="oval alignCenter">Delievered</li>
            </ul>

        )
    }
}
