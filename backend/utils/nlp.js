const stringSimilarity = require("string-similarity");

/* normalize input */
function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/* fuzzy matching for typos & variations */
function fuzzyMatch(input, patterns) {
  if (!input || !patterns || !patterns.length) return false;

  const { bestMatch } = stringSimilarity.findBestMatch(
    input,
    patterns.map(p => cleanText(p))
  );

  return bestMatch.rating >= 0.6; // typo tolerance
}

module.exports = {
  cleanText,
  fuzzyMatch
};
