import React, { useState } from 'react';
import {connect} from 'react-redux';

import Aux from '../Auxillary/Auxillary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

// Layout all contains the toolbar which has home, burger logo and other links

const layout = (props) => {
  // using react hooks for state management
  const [sideDrawerVisible, setSideDrawerVisible] = useState(false);

  const sideDrawerClosedHandler = () => {
    setSideDrawerVisible(false);
    //this.setState({showSideDrawer: false})
  }

  const sideDrawerToggleHandler = () => {
    /*this.setState((prevState) => {
      return {showSideDrawer: !prevState.showSideDrawer};
    })*/
    setSideDrawerVisible(!sideDrawerVisible);
  }

  // aux used as a encloser

  return (
    <Aux>
      <SideDrawer open={sideDrawerVisible}
       isAuth={props.isAuthenticated}
       closed={sideDrawerClosedHandler} />
      <Toolbar
        isAuth={props.isAuthenticated}
        drawerToggleClicked={sideDrawerToggleHandler}/>
      <main className={classes.Content}>
        {props.children}
      </main>
    </Aux>
  );
}

// maps global state to props
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
}

export default connect(mapStateToProps)(layout);
