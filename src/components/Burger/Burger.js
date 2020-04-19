// gives us the burger 

import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = ( props ) => {

    // Get total different ingredients from the states array
    // first convert the object into Array
    // and then reduce it to a single array
    let transformedIngredients = [];

    for(let igKey in props.ingredients){
      let totalQuantity = 0;
      while(totalQuantity < props.ingredients[igKey]){
        transformedIngredients.push(<BurgerIngredient
          key={igKey + totalQuantity}
          type={igKey}/>);
        totalQuantity += 1;
      }
    }

    if (transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>;
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;
