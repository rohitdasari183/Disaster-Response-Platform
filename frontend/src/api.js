import axios from 'axios';

const API = axios.create({
  baseURL: 'https://disaster-response-platform-plui.vercel.app',
});

export default API;
