const express = require('express');
const supabase = require('../supabaseClient');
const { getNearbyResources, createResource } = require('../controllers/resourceController');

module.exports = (io) => {
  const router = express.Router();

  // Create resource
  router.post('/', createResource);

  // ✅ Get resources by disaster_id
  router.get('/', async (req, res) => {
    const { disaster_id } = req.query;

    if (!disaster_id) return res.status(400).json({ error: 'Missing disaster_id' });

    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('disaster_id', disaster_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // Nearby resources — optional
  router.get('/:id/resources', (req, res) => getNearbyResources(req, res, io));

  return router;
};
