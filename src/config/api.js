import axios from 'axios';

const api = axios.create({
  baseURL: 'https://maiconkf.herokuapp.com/'
});

export default api;