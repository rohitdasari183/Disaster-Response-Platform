const express = require('express');
const supabase = require('../supabaseClient');
const { createReport } = require('../controllers/reportController');

const router = express.Router();

// Create a new report
router.post('/', createReport);

// ✅ Get reports by disaster_id
router.get('/', async (req, res) => {
  const { disaster_id } = req.query;

  if (!disaster_id) return res.status(400).json({ error: 'Missing disaster_id' });

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('disaster_id', disaster_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
