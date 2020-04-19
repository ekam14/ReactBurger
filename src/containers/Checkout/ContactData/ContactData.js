import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';


const contactData = (props) => {
  const [orderForm, setOrderForm] = useState({
      name: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'Your Name'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
      },
      street: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'Street'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
      },
      zipCode: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'ZIP Code'
          },
          value: '',
          validation: {
            required: true,
            minLength: 5,
            maxLength: 8
          },
          valid: false,
          touched: false
      },
      country: {
          elementType: 'input',
          elementConfig: {
              type: 'text',
              placeholder: 'Country'
          },
          value: '',
          validation: {
            required: true
          },
          valid: false,
          touched: false
      },
      email: {
          elementType: 'input',
          elementConfig: {
              type: 'email',
              disabled: true,
              value: localStorage.getItem('email')
          },
          value: localStorage.getItem('email'),
          validation: {
            required: true
          },
          valid: false,
          touched: false
      },
      deliveryMethod: {
          elementType: 'select',
          elementConfig: {
              options: [
                  {value: 'fastest', displayValue: 'Fastest'},
                  {value: 'cheapest', displayValue: 'Cheapest'}
              ]
          },
          value: 'fastest',
          validation: {},
          valid: true
      }
  })

  const [isFormValid, setFormValid] = useState(false);

    // Checks validity of the current value
    const checkValidity = (value, rules) => {
        let isValid = true;

        if(rules.required){
          isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
          isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
          isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    const orderHandler = (event) => {
      event.preventDefault();

      let formData = {};
      for(let inputType in orderForm){
        formData[inputType] = orderForm[inputType].value;
      }

      const data = {
        ingredients: props.ings,
        price: props.price,
        userId: props.userId,
        orderData: formData
      }

      props.onOrderBurger(data, props.token);
    }

    const inputChangedHandler = (event, inputId) => {
      const updatedOrderForm = {
        ...orderForm
      };
      const updatedFormElement = {
        ...updatedOrderForm[inputId]
      }

      updatedFormElement.value = event.target.value;
      updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
      updatedOrderForm[inputId] = updatedFormElement;

      let isFormValid = true;

      for(let key in updatedOrderForm){
        isFormValid = isFormValid && updatedOrderForm[key].valid;
      }

      setOrderForm(updatedOrderForm);
      setFormValid(isFormValid);
    };

    let formElement = [];
    for(let key in orderForm){
      formElement.push({
        key: key,
        elementType: orderForm[key].elementType,
        elementConfig: orderForm[key].elementConfig,
        valid: orderForm[key].valid,
        validation: orderForm[key].validation,
        touched: orderForm[key].touched
      })
    }

    let form = (
        <form onSubmit={orderHandler}>
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
            <Button btnType="Success" disabled={!isFormValid}>ORDER</Button>
        </form>
    );

    if(props.loading){
      form = <Spinner />;
    }

    return (
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
    );
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(contactData), axios));
