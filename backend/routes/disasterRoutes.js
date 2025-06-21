const express = require('express');
const {
  createDisaster,
  getDisasters,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');

module.exports = (io) => {
  const router = express.Router();

  router.post('/', (req, res) => createDisaster(req, res, io));
  router.get('/', getDisasters);
  router.put('/:id', (req, res) => updateDisaster(req, res, io));
  router.delete('/:id', (req, res) => deleteDisaster(req, res, io));

  return router;
};
