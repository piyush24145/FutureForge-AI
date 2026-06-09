// src/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const { callOpenRouter } = require('../services/openrouterService');

// Simple GET endpoint to verify OpenRouter connectivity
router.get('/openrouter-test', async (req, res) => {
  try {
    // Use a tiny prompt to keep usage minimal
    const openModel = 'openai/gpt-4o-mini';
    const openResponse = await callOpenRouter(openModel, [{ role: 'user', content: 'Hello from OpenRouter test!' }]);
    res.json({ success: true, response: openResponse });
  } catch (err) {
    console.error('[OpenRouter Test] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
