import React, { Component } from 'react';
import {connect} from 'react-redux';

import Aux from '../Auxillary/Auxillary';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

// Layout all contains the toolbar which has home, burger logo and other links

class Layout extends Component{
  state = {
    showSideDrawer: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({showSideDrawer: false})
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return {showSideDrawer: !prevState.showSideDrawer};
    })
  }

  render(){
    return (
      <Aux>
        <SideDrawer open={this.state.showSideDrawer}
         isAuth={this.props.isAuthenticated}
         closed={this.sideDrawerClosedHandler} />
        <Toolbar
          isAuth={this.props.isAuthenticated}
          drawerToggleClicked={this.sideDrawerToggleHandler}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
}

export default connect(mapStateToProps)(Layout);
