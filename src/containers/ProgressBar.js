import React,{Component} from 'react';
import ReactDom, { render } from 'react-dom';
// import styles from './ProgressBar.css';

export class Saved extends Component
{
    render(){
        return(
                
                <ul className={styles.progessbar}>
                    <li className={styles.oval+' '+styles.alignCenter}>Saved</li>
                    <li><hr className={styles.line}></hr></li>
                    <li title = "Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                    <li><hr className={styles.line}></hr></li>
                    <li title = "Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                    <li><hr className={styles.line}></hr></li>
                    <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
                </ul>

        )
    }
}
export class SentToSupplier extends Component
{
    render(){
        return(
            <ul className={styles.progessbar}>
                <li className={styles.oval+' '+styles.alignCenter}>Sent To Supplier</li>
                <li><hr className={styles.line}></hr></li>
                <li title = "Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title = "Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
            </ul>
        )
    }
}
export class ReadyToShip extends Component
{
    render(){
        return(
                
            <ul className={styles.progessbar}>                
                <li title = "Sent to Supplier" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval+' '+styles.alignCenter}>Ready To Ship</li>
                <li><hr className={styles.line}></hr></li>
                <li title = "Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
            </ul>

        )
    }
}
export class PartialShipped extends Component
{
    render(){
        return(
                
            <ul className={styles.progessbar}>
                
                <li title = "Sent to Supplier" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title ="Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval+' '+styles.alignCenter}>Partially shipped</li>
                <li><hr className={styles.line}></hr></li>
                <li title ="Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
            </ul>

        )
    }
}
export class Shipped extends Component
{
    render(){
        return(
                
            <ul className={styles.progessbar}>
                
                <li title = "Sent to Supplier" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title ="Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li  className={styles.oval+' '+styles.alignCenter}>Shipped</li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
            </ul>

        )
    }
}
export class PartialDelivered extends Component{
    render(){
        return(
                
            <ul className={styles.progessbar}>
                
                <li title = "Sent to Supplier" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title ="Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title = "Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li  className={styles.oval+' '+styles.alignCenter}>Partially Delivered</li>
                <li><hr className={styles.line}></hr></li>
                <li className={styles.oval1+' '+styles.alignCenter}>Delivered</li>
            </ul>

        )
    }
}
export class Delivered extends Component{
    render(){
        return(
                
            <ul className={styles.progessbar}>
                
                <li title = "Sent to Supplier" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title ="Ready To Ship" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li title = "Shipped" className={styles.circle+' '+styles.alignCenter}></li>
                <li><hr className={styles.line}></hr></li>
                <li  className={styles.oval+' '+styles.alignCenter}>Delievered</li>
            </ul>

        )
    }
}
