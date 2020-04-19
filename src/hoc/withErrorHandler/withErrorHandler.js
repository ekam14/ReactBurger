import React, {useState, useEffect} from 'react';
import Aux from '../Auxillary/Auxillary';
import Modal from '../../components/UI/Modal/Modal';

// higher order function
// that returns a component
const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    /*state = {
      error: null
    }*/
    const [error, setError] = useState(null);

    // see video 8 - 9:10 min
    const reqInterceptor = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    const resInterceptor = axios.interceptors.response.use(res => res, err => {
      setError(err);
    });

    useEffect(() => {
      // same as componentWillUnmount
      // removes unneccasary interceptors
      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      }
    }, [])

    const errorConfirmedHandler = () => {
      //this.setState({error: null});
      setError(null);
    }

    return(
      <Aux>
        <Modal show={error}
          modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    )
  }
}

export default withErrorHandler;
