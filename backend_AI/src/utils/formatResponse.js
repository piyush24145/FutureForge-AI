// src/utils/formatResponse.js
/**
 * Takes raw AI text and returns a nicely formatted Markdown string.
 * - Adds a heading if none exists.
 * - Ensures bullet points start with "- " and are on separate lines.
 */
function formatAIResponse(text) {
  if (!text) return "";
  let trimmed = text.trim();
  // Split lines, keep hyphen bullets, otherwise separate paragraphs.
  const lines = trimmed.split(/\r?\n/).map(l => l.trim());
  const formatted = lines
    .map(l => (l.startsWith('-') ? l : `\n${l}`))
    .join('\n');
  // Prepend a heading if the first line is not a markdown heading.
  if (!/^#/.test(formatted)) {
    return `### Your Mentor's Answer\n${formatted}`;
  }
  return formatted;
}

module.exports = { formatAIResponse };
