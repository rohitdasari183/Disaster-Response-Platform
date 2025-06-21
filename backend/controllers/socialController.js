const supabase = require('../supabaseClient');
const axios = require('axios');

exports.getSocialMediaReports = async (req, res, io) => {
  const { id } = req.params;

  const cacheKey = `twitter:disaster:${id}`;
  const now = new Date().toISOString();

  const { data: cached, error: cacheError } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', cacheKey)
    .single();

  if (cached && new Date(cached.expires_at) > new Date()) {
    return res.json(cached.value);
  }

  try {
    const twitterResponse = await axios.get('https://api.twitter.com/2/tweets/search/recent', {
      headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` },
      params: {
        query: `#floodrelief OR #earthquake`,
        max_results: 10
      }
    });

    const tweets = twitterResponse.data.data || [];

    await supabase.from('cache').upsert([{
      key: cacheKey,
      value: tweets,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }]);

    io.emit('social_media_updated', tweets);
    res.json(tweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
