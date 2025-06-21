const supabase = require('../supabaseClient');
const axios = require('axios');

exports.geocodeLocation = async (req, res) => {
  const { locationName } = req.body;
  const cacheKey = `geocode:osm:${locationName}`;

  const { data: cached } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', cacheKey)
    .single();

  if (cached && new Date(cached.expires_at) > new Date()) {
    return res.json(cached.value);
  }

  try {
    const result = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: { q: locationName, format: 'json' },
      headers: { 'User-Agent': 'DisasterResponseApp/1.0' }
    });

    const coordinates = result.data[0];
    await supabase.from('cache').upsert([{
      key: cacheKey,
      value: coordinates,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }]);

    res.json(coordinates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
