import React, { useState, useEffect } from 'react';
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
export const burgerBuilder = (props) => {
  // if purchasing
  // give the modal of checkout summary
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.onInitIngredients();
  }, []);

  // updates purchasable
  // true only if atleast one item available
  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map((igKey) => {
      return ingredients[igKey];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0);

    return sum > 0;
  }

  // invoked when order now button is clicked
  const purchaseHandler = () => {
    if(props.isAuthenticated){
      setPurchasing(true);
    }else{
      // this case belongs to the scenario when burger has to start to build
      // and we redirect path after authentication towards checkout
      // so that old build burger keeps intact
      console.log('you are not authenticated');
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
      console.log('Auth Redirect path is: ', props.path);
    }
  }

  // invoked when cancel button on modal is clicked
  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  // headover to the backend
  // go to the checkout page
  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
  }

  const disabledInfo = {
    ...props.ings
  };

  // disable all controls where total quantity is 0
  for(let key in disabledInfo){
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;

  if(props.ings){
    burger = (
        <Aux>
          <Burger ingredients={props.ings}/>
          <BuildControls
            ingredientAdded={props.onIngredientAdded}
            ingredientRemoved={props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={updatePurchaseState(props.ings)}
            price={props.price}
            isAuth={props.isAuthenticated}
            ordered={purchaseHandler}/>
        </Aux>
    );

    orderSummary = (
      <OrderSummary
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        ingredients={props.ings}/>
    );
  }

  /*if(this.state.loading){
    orderSummary = <Spinner />;
  }*/

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(burgerBuilder, axios));
