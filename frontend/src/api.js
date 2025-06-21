import axios from 'axios';

const API = axios.create({
  baseURL: 'https://disaster-response-platform-backend1.vercel.app',
});

export default API;
