import axios from 'axios';

const API = axios.create({
  baseURL: 'https://disaster-response-platform-3.onrender.com',
});

export default API;
