import React from "react";


const ButtonSubmit = props =>
    (<button
        style={[
          styles.button,
          props.disabled ? styles.disabled : null
        ]}
        {...props}
        disabled={props.disabled}
      >
        <span style={props.disabled ? styles.disabled : null}>{props.children}</span>
      </button>
    );

const styles = {
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black"
  },
  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  disabledText: {
    color: "#aaa"
  }
}

export default ButtonSubmit;
