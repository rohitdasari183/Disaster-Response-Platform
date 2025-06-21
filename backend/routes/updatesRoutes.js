const express = require('express');
const { getOfficialUpdates } = require('../controllers/updatesController');

module.exports = (io) => {
  const router = express.Router();
  router.get('/:id', (req, res) => getOfficialUpdates(req, res, io));
  return router;
};
