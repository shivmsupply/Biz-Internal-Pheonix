import React from "react";

const  invalid = {
  backgroundColor: '#f9c0c0',
  borderColor: "red"
}

const SelectBox = props => (
  <select
    {...props}
    style={!props.valid && props.touched ? invalid : null}
  >
  	{props.options}
  </select>
)

export default SelectBox;