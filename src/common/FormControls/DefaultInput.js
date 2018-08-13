import React from "react";




const  invalid = {
  backgroundColor: '#f9c0c0',
  borderColor: "red"
}


const defaultInput = props => 

 (
  <input
    {...props}
    style={!props.valid && props.touched ? invalid : null}
  />
)



export default defaultInput;
