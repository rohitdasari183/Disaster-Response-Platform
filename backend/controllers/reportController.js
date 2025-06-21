const supabase = require('../supabaseClient');

exports.createReport = async (req, res) => {
  const { disaster_id, content, image_url, user_id, verification_status } = req.body;

  if (!disaster_id || !content || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        disaster_id,
        user_id: user_id || null,
        content,
        image_url,
        verification_status: verification_status || 'unverified'
      }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("❌ Report insert error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
