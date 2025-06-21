const supabase = require('../supabaseClient');
const axios = require('axios');

exports.verifyImage = async (req, res, io) => {
  const { image_url } = req.body;
  const { id } = req.params;

  if (!image_url) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  const cacheKey = `gemini:image:${image_url}`;

  try {
    const { data: cached } = await supabase
      .from('cache')
      .select('value, expires_at')
      .eq('key', cacheKey)
      .single();

    if (cached && new Date(cached.expires_at) > new Date()) {
      return res.json(cached.value);
    }

    // Step 1: Fetch image and convert to base64
    const imageRes = await axios.get(image_url, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(imageRes.data, 'binary').toString('base64');

    // Step 2: Call Gemini 1.5 Flash API
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: "Analyze this image for disaster authenticity, manipulation, or if it's AI-generated."
              },
              {
                inlineData: {
                  mimeType: "image/jpeg", // you can also support png
                  data: base64Image
                }
              }
            ]
          }
        ]
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const analysis = geminiResponse.data;

    // Cache it
    await supabase.from('cache').upsert([{
      key: cacheKey,
      value: analysis,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }]);

    res.json(analysis);
  } catch (err) {
    console.error("❌ Gemini API Error:", err?.response?.data || err.message);
    res.status(500).json({
      error: "Gemini image verification failed",
      details: err?.response?.data || err.message
    });
  }
};
