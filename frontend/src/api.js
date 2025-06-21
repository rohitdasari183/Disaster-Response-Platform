import axios from 'axios';

const API = axios.create({
  baseURL: 'https://disaster-response-platform-1.onrender.com',
});

export default API;
