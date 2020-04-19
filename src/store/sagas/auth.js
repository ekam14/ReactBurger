import {put, delay} from 'redux-saga/effects';

import axios from 'axios';
import * as actions from '../actions/index';

// works same as async await function
// generator function
export function* logoutSaga(action){
  // removes data from storage
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');
  yield localStorage.removeItem('email');

  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action){
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action){
  yield put(actions.authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  }

  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB4fg4eVPl84UlEG-7uzl7atPcgkCwAyJM';

  if(!action.isSignUp){
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB4fg4eVPl84UlEG-7uzl7atPcgkCwAyJM'
  }

  try{
    // wait for the promise to resolve or reject
    const response = yield axios.post(url, authData);

    const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);

    // Browser local storage
    yield localStorage.setItem('token', response.data.idToken);
    yield localStorage.setItem('expirationDate', expirationDate);
    yield localStorage.setItem('userId', response.data.localId);
    yield localStorage.setItem('email', response.data.email);

    yield put(actions.authSuccess(response.data.idToken, response.data.localId))
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
  } catch(error){
    yield put(actions.authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action){
  const token = yield localStorage.getItem('token');
  if(!token){
    yield put(actions.logout());
  }else{
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if(expirationDate > new Date()){
      const userId = yield localStorage.getItem('userId');
      yield put((actions.authSuccess(token, userId)));
      const timeLeft = (expirationDate.getTime() - new Date().getTime()) / 1000;
      yield put(actions.checkAuthTimeout(timeLeft));
    }else{
      yield put(actions.logout());
    }
  }
}
