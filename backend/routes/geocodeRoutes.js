const express = require('express');
const { geocodeLocation } = require('../controllers/geocodeController');

module.exports = () => {
  const router = express.Router();
  router.post('/', geocodeLocation);
  return router;
};
