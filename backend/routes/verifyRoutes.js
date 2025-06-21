const express = require('express');
const { verifyImage } = require('../controllers/verifyController');

module.exports = (io) => {
  const router = express.Router();
  router.post('/:id', (req, res) => verifyImage(req, res, io));
  return router;
};
