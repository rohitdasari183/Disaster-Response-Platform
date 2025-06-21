const supabase = require('../supabaseClient');

exports.createResource = async (req, res) => {
  const { disaster_id, name, location_name, type } = req.body;

  if (!disaster_id || !name || !location_name || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 🌍 Geocode location_name using OpenStreetMap
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location_name)}&format=json&limit=1`);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(400).json({ error: 'Invalid location: not found' });
    }

    const { lat, lon } = geoData[0];

    // ✅ Convert to GeoJSON point (expected by Supabase/PostGIS)
    const location = {
      type: 'Point',
      coordinates: [parseFloat(lon), parseFloat(lat)]
    };

    const { data, error } = await supabase
      .from('resources')
      .insert([{
        disaster_id,
        name,
        location_name,
        location,
        type
      }])
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);

  } catch (err) {
    console.error("❌ Resource insert crash:", err.message);
    res.status(500).json({ error: err.message });
  }
};
