// Login form
import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import classes from './Auth.css';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const auth = (props) => {
  const [controls, setControls] = useState({email: {
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
  }});

  const [isFormValid, setFormValid] = useState(false);
  const [isSignUp, setSignUp] = useState(true);

  useEffect(() => {
    // want to redirect to base index
    // only if building of burger has not started
    if(!props.buildingBurger && props.authRedirect !== '/'){
      props.onSetAuthRedirectPath();
    }
  }, [])

  // Checks validity of the current value
  const checkValidity = (value, rules) => {
      let isValid = true;

      if(rules.required){
        isValid = value.trim() !== '' && isValid;
      }

      if(rules.minLength){
        isValid = value.length >= rules.minLength && isValid;
      }

      return isValid;
  }

  const inputChangedHandler = (event, controlName) => {
    event.preventDefault();

    const updatedControls = {
      ...controls
    }

    const updatedFormElement = {
      ...updatedControls[controlName]
    }

    updatedFormElement.value = event.target.value;

    updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedControls[controlName] = updatedFormElement;

    let isFormValid = true;

    for(let key in updatedControls){
      isFormValid = isFormValid && updatedControls[key].valid;
    }

    setControls(updatedControls);
    setFormValid(isFormValid);
  }

  const switchAuthModeHandler = () => {
    return setSignUp(!isSignUp);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignUp);
  }

  let formElement = [];
  for(let key in controls){
    formElement.push({
      key: key,
      elementType: controls[key].elementType,
      elementConfig: controls[key].elementConfig,
      valid: controls[key].valid,
      validation: controls[key].validation,
      touched: controls[key].touched
    })
  }

  let form = (
      <form onSubmit={submitHandler}>
          {formElement.map((element) => {
            return (
              <Input key={element.key}
               elementType={element.elementType}
               elementConfig={element.elementConfig}
               changed={(event) => inputChangedHandler(event, element.key)}
               invalid={!element.valid}
               validation={element.validation}
               touched={element.touched} />
             );
          })}
          <Button btnType="Success"disabled={!isFormValid}>SUBMIT</Button>
      </form>
  );

  if(props.loading){
    form = <Spinner />;
  }

  let errorMessage = null;

  if(props.error){
    errorMessage = (
      <p>{props.error.message}</p>
    );
  }

  let authRedirect = null;
  if(props.isAuthenticated){
    authRedirect = <Redirect to={props.authRedirectPath} />
    console.log('From Auth.js; Auth Redirect path is: ', props.authRedirectPath);
  }

  return (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      {form}
      <Button btnType="Danger"
       clicked ={switchAuthModeHandler}>
       SWITCH TO {!isSignUp ? 'Sign Up' : 'Sign In'}
       </Button>
    </div>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(auth);
