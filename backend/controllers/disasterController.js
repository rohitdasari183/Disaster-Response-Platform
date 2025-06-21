const supabase = require('../supabaseClient');
const axios = require('axios');

// ✅ Create Disaster
exports.createDisaster = async (req, res, io) => {
  try {
    const { title, location_name, description, tags, owner_id } = req.body;

    if (!title || !location_name || !description || !tags) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🌐 Geocode location using OpenStreetMap
    let location = null;
    try {
      const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: location_name,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'Disaster-Response-App'
        }
      });

      if (Array.isArray(geoRes.data) && geoRes.data.length > 0) {
        const { lat, lon } = geoRes.data[0];
        location = `SRID=4326;POINT(${lon} ${lat})`; // WKT format for PostGIS
      } else {
        console.warn("📍 No geocoding result for:", location_name);
      }
    } catch (geoErr) {
      console.warn("❌ Geocoding failed:", geoErr.message);
    }

    const auditTrail = [{
      action: "create",
      user_id: owner_id || 'anonymous',
      timestamp: new Date().toISOString()
    }];

    const { data, error } = await supabase
      .from('disasters')
      .insert([{
        title,
        location_name,
        location,
        description,
        tags,
        owner_id: owner_id || null,
        created_at: new Date().toISOString(),
        audit_trail: auditTrail
      }])
      .select();

    if (error) {
      console.error("🔥 Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    io.emit('disaster_updated', data[0]);
    res.status(201).json(data[0]);

  } catch (err) {
    console.error("❌ Unexpected error in createDisaster:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Disasters
exports.getDisasters = async (req, res) => {
  try {
    const { tag } = req.query;
    let query = supabase.from('disasters').select('*').order('created_at', { ascending: false });

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    const { data, error } = await query;
    if (error) {
      console.error("🔥 Supabase select error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("❌ Unexpected error in getDisasters:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Disaster
exports.updateDisaster = async (req, res, io) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const audit = {
      action: "update",
      user_id: updates.owner_id || 'anonymous',
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('disasters')
      .update({
        ...updates,
        audit_trail: [audit]
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error("🔥 Supabase update error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    io.emit('disaster_updated', data[0]);
    res.json(data[0]);

  } catch (err) {
    console.error("❌ Unexpected error in updateDisaster:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Disaster
exports.deleteDisaster = async (req, res, io) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('disasters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("🔥 Supabase delete error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    io.emit('disaster_updated', { deleted: true, id });
    res.sendStatus(204);

  } catch (err) {
    console.error("❌ Unexpected error in deleteDisaster:", err.message);
    res.status(500).json({ error: err.message });
  }
};
