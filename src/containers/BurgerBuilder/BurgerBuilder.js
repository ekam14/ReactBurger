import React, { Component } from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

// Container, it holds the logic for burger building and the building controls

export class BurgerBuilder extends Component{
  state = {
    purchasing: false
  }

  componentDidMount () {
      this.props.onInitIngredients();
  }

  // updates purchasable
  // true only if atleast one item available
  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map((igKey) => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);

    return sum > 0;
  }

  purchaseHandler = () => {
    if(this.props.isAuthenticated){
      this.setState({purchasing: true});
    }else{
      // this case belongs to the scenario when burger has to start to build
      // and we redirect path after authentication towards checkout
      // so that old build burger keeps intact
      console.log('you are not authenticated');
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
      console.log('Auth Redirect path is: ', this.props.path);
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  // headover to the backend
  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render(){
    const disabledInfo = {
      ...this.props.ings
    };

    for(let key in disabledInfo){
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

    if(this.props.ings){
      burger = (
          <Aux>
            <Burger ingredients={this.props.ings}/>
            <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.price}
            isAuth={this.props.isAuthenticated}
            ordered={this.purchaseHandler}/>
          </Aux>
      );

      orderSummary = (
        <OrderSummary
        price={this.props.price}
        purchaseCancelled={this.purchaseCancelHandler}
        purchaseContinued={this.purchaseContinueHandler}
        ingredients={this.props.ings}/>
      );
    }

    /*if(this.state.loading){
      orderSummary = <Spinner />;
    }*/

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null,
        path: state.auth.authRedirectPath
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
