import React from 'react';
import classes from './Modal.css'
import Backdrop from '../Backdrop/Backdrop'
import Aux from '../../../hoc/Auxillary/Auxillary'

const modal = (props) => {

  // Will update only if it is shown to boost performance
  /*shouldComponentUpdate(nextProps, nextState){
    return nextProps.show !== props.show || nextProps.children !== props.children;
  }*/

  return (
    <Aux>
      <Backdrop show={props.show} clicked={props.modalClosed}/>
      <div className={classes.Modal}
      style={{
        transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: props.show ? '1' : '0'
      }}>
       {props.children}
      </div>
    </Aux>
  );
}

export default React.memo(modal);
