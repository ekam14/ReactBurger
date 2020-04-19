import React from 'react';

import classes from './SideDrawer.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop'
import Aux from '../../../hoc/Auxillary/Auxillary'

const sideDrawer = ( props ) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];

  if(props.open){
     attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      // show - false or true
      // closed - function to close the sideDrawer in parent component
      <Backdrop show={props.open}  clicked={props.closed}/>
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <div className={classes.Logo}>
          <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
          <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;
