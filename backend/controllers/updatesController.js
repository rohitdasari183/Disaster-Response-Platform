const supabase = require('../supabaseClient');
const axios = require('axios');
const cheerio = require('cheerio');

exports.getOfficialUpdates = async (req, res, io) => {
  const cacheKey = `browse:fema:${req.params.id}`;

  const { data: cached } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', cacheKey)
    .single();

  if (cached && new Date(cached.expires_at) > new Date()) {
    return res.json(cached.value);
  }

  try {
    const { data: html } = await axios.get('https://www.fema.gov/disaster-feed'); // Example URL
    const $ = cheerio.load(html);

    const updates = [];
    $('.disaster-update').each((i, el) => {
      updates.push({
        title: $(el).find('h3').text(),
        date: $(el).find('.date').text(),
        summary: $(el).find('p').text()
      });
    });

    await supabase.from('cache').upsert([{
      key: cacheKey,
      value: updates,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }]);

    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
