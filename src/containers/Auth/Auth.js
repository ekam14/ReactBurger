// Login form
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Auth extends Component {
  state = {
    controls: {
      email: {
          elementType: 'input',
          elementConfig: {
              type: 'email',
              placeholder: 'Mail Address'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
      },
      password: {
          elementType: 'input',
          elementConfig: {
              type: 'password',
              placeholder: 'Password'
          },
          value: '',
          validation: {
            required: true,
            minLength: 6
          },
          valid: false,
          touched: false
      }
    },
    isFormValid: false,
    isSignUp: true
  }

  componentDidMount(){
    // want to redirect to base index
    // only if building of burger has not started
    if(!this.props.buildingBurger && this.props.authRedirect !== '/'){
      this.props.onSetAuthRedirectPath();
    }
  }

  // Checks validity of the current value
  checkValidity(value, rules){
      let isValid = true;

      if(rules.required){
        isValid = value.trim() !== '' && isValid;
      }

      if(rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
      }

      return isValid;
  }

  inputChangedHandler(event, controlName){
    event.preventDefault();

    const updatedControls = {
      ...this.state.controls
    }

    const updatedFormElement = {
      ...updatedControls[controlName]
    }

    updatedFormElement.value = event.target.value;

    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedControls[controlName] = updatedFormElement;

    let isFormValid = true;

    for(let key in updatedControls){
      isFormValid = isFormValid && updatedControls[key].valid;
    }

    this.setState({controls: updatedControls, isFormValid: isFormValid})
  }

  switchAuthModeHandler = () => {
    return this.setState(prevState => {
      return {isSignUp: !prevState.isSignUp};
    })
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  }

  render(){
    let formElement = [];
    for(let key in this.state.controls){
      formElement.push({
        key: key,
        elementType: this.state.controls[key].elementType,
        elementConfig: this.state.controls[key].elementConfig,
        valid: this.state.controls[key].valid,
        validation: this.state.controls[key].validation,
        touched: this.state.controls[key].touched
      })
    }

    let form = (
        <form onSubmit={this.submitHandler}>
            {formElement.map((element) => {
              return (
                <Input key={element.key}
                 elementType={element.elementType}
                 elementConfig={element.elementConfig}
                 changed={(event) => this.inputChangedHandler(event, element.key)}
                 invalid={!element.valid}
                 validation={element.validation}
                 touched={element.touched} />
               );
            })}
            <Button btnType="Success"disabled={!this.state.isFormValid}>SUBMIT</Button>
        </form>
    );

    if(this.props.loading){
      form = <Spinner />;
    }

    let errorMessage = null;

    if(this.props.error){
      errorMessage = (
        <p>{this.props.error.message}</p>
      );
    }

    let authRedirect = null;
    if(this.props.isAuthenticated){
      authRedirect = <Redirect to={this.props.authRedirectPath} />
      console.log('From Auth.js; Auth Redirect path is: ', this.props.authRedirectPath);
    }

    return (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        {form}
        <Button btnType="Danger"
         clicked ={this.switchAuthModeHandler}>
         SWITCH TO {!this.state.isSignUp ? 'Sign Up' : 'Sign In'}
         </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath('/'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
