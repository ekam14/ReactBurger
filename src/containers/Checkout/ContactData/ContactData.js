import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';


class ContactData extends Component {
  state = {
      orderForm: {
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
                  placeholder: 'Your E-Mail'
              },
              value: '',
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
      },
      isFormValid: false
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

        if(rules.maxLength){
          isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    orderHandler = (event) => {
      event.preventDefault();
      this.setState((prevState) => {
        return {loading: true};
      })

      let formData = {};
      for(let inputType in this.state.orderForm){
        formData[inputType] = this.state.orderForm[inputType].value;
      }

      const data = {
        ingredients: this.props.ings,
        price: this.props.price,
        userId: this.props.userId,
        orderData: formData
      }

      this.props.onOrderBurger(data, this.props.token);
    }

    inputChangedHandler = (event, inputId) => {
      const updatedOrderForm = {
        ...this.state.orderForm
      };
      const updatedFormElement = {
        ...updatedOrderForm[inputId]
      }

      updatedFormElement.value = event.target.value;
      updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
      updatedOrderForm[inputId] = updatedFormElement;

      let isFormValid = true;

      for(let key in updatedOrderForm){
        isFormValid = isFormValid && updatedOrderForm[key].valid;
      }

      this.setState({orderForm: updatedOrderForm, isFormValid: isFormValid});
    };

    render () {
        let formElement = [];
        for(let key in this.state.orderForm){
          formElement.push({
            key: key,
            elementType: this.state.orderForm[key].elementType,
            elementConfig: this.state.orderForm[key].elementConfig,
            valid: this.state.orderForm[key].valid,
            validation: this.state.orderForm[key].validation,
            touched: this.state.orderForm[key].touched
          })
        }

        let form = (
            <form onSubmit={this.orderHandler}>
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
                <Button btnType="Success" disabled={!this.state.isFormValid}>ORDER</Button>
            </form>
        );

        if(this.props.loading){
          form = <Spinner />;
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(withRouter(ContactData), axios));
