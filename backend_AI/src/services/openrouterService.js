// src/services/openrouterService.js
require('dotenv').config();
const fetch = require('node-fetch');

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Calls OpenRouter with a simple chat completion request.
 * @param {string} modelId   e.g. "openai/gpt-4o-mini"
 * @param {Array}  messages  [{role:'user', content:'...'}]
 * @returns {Promise<Object>} JSON response from OpenRouter.
 */
async function callOpenRouter(modelId, messages) {
  if (!API_KEY) {
    throw new Error('OPENROUTER_API_KEY missing in .env');
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      // optional identifier for your app
      'X-Title': 'AI_Mentor_Student',
    },
    body: JSON.stringify({ model: modelId, messages }),
  });

  if (!response.ok) {
    const err = await response.json();
    const msg = err.error?.message || response.statusText;
    throw new Error(`OpenRouter error ${response.status}: ${msg}`);
  }

  return response.json();
}

module.exports = { callOpenRouter };
