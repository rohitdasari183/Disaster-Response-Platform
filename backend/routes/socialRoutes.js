const express = require('express');
const { getSocialMediaReports } = require('../controllers/socialController');

module.exports = (io) => {
  const router = express.Router();
  router.get('/:id', (req, res) => getSocialMediaReports(req, res, io));
  return router;
};
