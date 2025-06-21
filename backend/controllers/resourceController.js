const supabase = require('../supabaseClient');

exports.createResource = async (req, res) => {
  const { disaster_id, name, location_name, type } = req.body;

  if (!disaster_id || !name || !location_name || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let location = null;

  try {
    // Geocode with OpenStreetMap
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location_name)}&format=json&limit=1`);
    const geoData = await geoRes.json();

    if (geoData.length > 0) {
      const { lat, lon } = geoData[0];
      location = `SRID=4326;POINT(${lon} ${lat})`;
    }

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

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);

  } catch (err) {
    console.error("❌ Resource insert error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
