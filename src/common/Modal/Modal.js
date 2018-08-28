import React, { Component } from 'react';


class Modal extends Component {
    constructor(props){
        super(props)
    }
    closeModal = (event) => {
        console.log("event here ==========>", event)
        debugger;
        event.stopPropagation();
        document.getElementsByTagName('body')[0].style.overflow="auto";
        this.props.onClose();
    }

    close_back_drop = (event) => {
        if(this.props.backDropClose){
            this.props.onClose(event); 
            document.getElementsByTagName('body')[0].style.overflow="auto";
        }  
    }

    render(props) {
         const body = document.getElementsByTagName('body');
        
        const style = {
            'width':this.props.width,
            'height': this.props.height,
            'position':this.props.position
        }

        if(!this.props.isOpen){
            return null
        }
        else{
            return (  
                <div className="modalbody" onClick={this.close_back_drop(this)}>
                    <div className="modal" style={style} onClick={(e)=>{e.stopPropagation()}}>
                        <h2>{this.props.header}</h2>
                        <div>{this.props.children}</div>
                        {this.props.crossBtn?
                            <span 
                                className="crossBtn" 
                                onClick={this.closeModal.bind(this)}>
                                    x
                            </span>
                        :null}
                    </div>                
                </div>
            )
        }
    }
}

export default Modal;