const { askGemini } = require('../utils/geminiClient');

exports.getInsights = async (req, res) => {
  const { id } = req.params;

  try {
    const prompt = `Provide expert-level safety tips and response strategies for disaster ID: ${id}. Include evacuation, first aid, communication, and local coordination.`;
    const response = await askGemini(prompt);
    res.json({ insights: response });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate disaster insights' });
  }
};
