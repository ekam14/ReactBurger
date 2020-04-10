import * as actionTypes from './actionTypes';
import axios from 'axios';

// used to show loading state
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (token, userId) => {
  // save token into browser localStorage
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  // removes data from storage
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
}

// automatically runs after the token expires
export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000)
  }
}

// Middleware
export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }

    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4fg4eVPl84UlEG-7uzl7atPcgkCwAyJM';

    if(!isSignUp){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4fg4eVPl84UlEG-7uzl7atPcgkCwAyJM'
    }

    axios.post(url, authData)
    .then(response => {
      const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);

      // Browser local storage
      localStorage.setItem('token', response.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userId', response.data.localId);

      dispatch(authSuccess(response.data.idToken, response.data.localId))
      dispatch(checkAuthTimeout(response.data.expiresIn));
    }).catch( error => {
        dispatch(authFail(error.response.data.error));
    });
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  };
}


// First thing that runs to check if there is any current user
// sees local storage
export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if(!token){
      dispatch(logout());
    }else{
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if(expirationDate > new Date()){
        const userId = localStorage.getItem('userId');
        dispatch((authSuccess(token, userId)));
        const timeLeft = (expirationDate.getTime() - new Date().getTime()) / 1000;
        dispatch(checkAuthTimeout(timeLeft));
      }else{
        dispatch(logout());
      }
    }
  }
}
