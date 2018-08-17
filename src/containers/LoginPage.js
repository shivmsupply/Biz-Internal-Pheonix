import React, { Component,Fragment } from "react";
import { connect } from "react-redux";
import validate from "../utils/validation";
import { authLogin } from "../actions/LoginActions.js" 

import DefaultInput from '../common/FormControls/DefaultInput'
import ButtonSubmit from '../common/FormControls/ButtonSubmit'
import SelectBox from '../common/FormControls/SelectBox'
import '../assets/styles/style.css';
class LoginPage extends Component {
  state = {
  
  controls: {
    email: {
      value: "",
      valid: 0,
      validationRules: {
        isEmail: true
      },
      touched: 0
    },
    password: {
      value: "",
      valid: 0,
      validationRules: {
        minLength: 6
      },
      touched: 0
    },
    confirmPassword: {
      value: "",
      valid: 0,
      validationRules: {
        equalTo: "password"
      },
      touched: 0
    },
    country: {
      value: "",
      valid: 0,
      validationRules: {
        notEmpty: true
      },
      touched: 0
    }
  }
};

constructor(props) {
  super(props);
 
}

loginHandler = () => {
  const authData = {
    email: this.state.controls.email.value,
    password: this.state.controls.password.value
  };
  console.log("authData ========>", authData)
  this.props.onLogin(authData);
  startMainTabs();
};

updateInputState = (key, event) => {
  let connectedValue = {};
  let value = event.target.value
  
  //For Password Equal to validation
  if (this.state.controls[key].validationRules.equalTo) {
    const equalControl = this.state.controls[key].validationRules.equalTo;
    const equalValue = this.state.controls[equalControl].value;
    connectedValue = {
      ...connectedValue,
      equalTo: equalValue
    };
  }

  //If control is input password
  if (key === "password") {
    connectedValue = {
      ...connectedValue,
      equalTo: value
    };
  }

    //Setting Control State of inpul fields
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === "password"
                ? validate(
                    prevState.controls.confirmPassword.value,
                    prevState.controls.confirmPassword.validationRules,
                    connectedValue
                  )
                : prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(
              value,
              prevState.controls[key].validationRules,
              connectedValue
            ),
            touched: 1
          }
        }
      };
    });
  };

  render() {
    let headingText = null;
    let confirmPasswordControl = null;
    let countryOptions = (
      <Fragment>
        <option value="">Select Country</option>
        <option value="India">India</option>
        <option value="Bengladesh">Bengladesh</option>
      </Fragment>
    );
      headingText = (
        <div>
          <h2>Please Log In</h2>
        </div>
      );
  

      confirmPasswordControl = (
        <div>
          <DefaultInput
            type="password"
            className="inputControl"
            placeholder="Confirm Password"
            style={styles.input}
            value={this.state.controls.confirmPassword.value}
            onChange={event => this.updateInputState("confirmPassword", event)}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            
          />

          <SelectBox 
            className="inputControl"
            style={styles.input}
            options={countryOptions} 
            valid={this.state.controls.country.valid}
            touched={this.state.controls.country.touched}
            onChange={event => this.updateInputState("country", event)}
          />


        </div>
      );
  
    return (
      <div className="container-login">
        <div className="login-box">
          {headingText}
        
            
        
            <div style={styles.inputContainer}>
              <DefaultInput
                type="text"
                className="inputControl"
                placeholder="Your E-Mail Address"
                style={styles.input}
                value={this.state.controls.email.value}
                onChange={event => this.updateInputState("email", event)}
                valid={this.state.controls.email.valid? 1 : 0}
                touched={this.state.controls.email.touched}
              />

              <div>
                <div>
                  <DefaultInput
                    type="password"
                    className="inputControl"
                    placeholder="Password"
                    style={styles.input}
                    value={this.state.controls.password.value}
                    onChange={event => this.updateInputState("password", event)}
                    valid={this.state.controls.password.valid? 1: 0}
                    touched={this.state.controls.password.touched}
                
                  />
                </div>
                {confirmPasswordControl}
              </div>
            </div>
     
          <ButtonSubmit
          
            onClick={this.loginHandler}
            disabled={
              !this.state.controls.confirmPassword.valid ||
              !this.state.controls.email.valid ||
              !this.state.controls.password.valid
            }
          >
            Submit
          </ButtonSubmit>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    onLogin: authData => dispatch(authLogin(authData))
  };
};



const styles = {
  container: {
   width: '100%',
   display: 'inline-block',
   padding: '15px'
  },

  inputContainer: {
    width: "80%"
  },
  input: {
    backgroundColor: "#eee",
    borderColor: "#bbb"
  },
  landscapePasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  portraitPasswordContainer: {
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  landscapePasswordWrapper: {
    width: "45%"
  },
  portraitPasswordWrapper: {
    width: "100%"
  }
}

export default connect(null, mapDispatchToProps)(LoginPage);
