import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-dbe4f.firebaseio.com/'
});

export default instance;
