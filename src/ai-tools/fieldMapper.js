const axios = require('axios');

const universalFields = ["name", "email", "leave_start", "leave_end", "leave_reason"];
let universalEmbeddings = null;

async function fetchEmbeddings(texts) {
  const res = await axios.post('http://localhost:5100/embed', { inputs: texts });
  return res.data.embeddings;
}

async function loadUniversalEmbeddings() {
  if (universalEmbeddings) return universalEmbeddings;

  const vectors = await fetchEmbeddings(universalFields);
  universalEmbeddings = Object.fromEntries(
    universalFields.map((field, idx) => [field, vectors[idx]])
  );

  return universalEmbeddings;
}
  
function cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;
  
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
  
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] ** 2;
      normB += b[i] ** 2;
    }
  
    if (normA === 0 || normB === 0) return 0;
  
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  
  
  
function preprocess(text) {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().trim();
}
  
async function aiMatchField(erpField, universalFields, threshold = 0) {
    const erpVec = (await fetchEmbeddings([preprocess(erpField)]))[0];
    // console.log(erpVec);
    const universalVecs = await loadUniversalEmbeddings();
    // console.log(universalVecs);
  
    let bestField = null;
    let bestScore = -1;
  
      for (const field of universalFields) {
            // console.log(field);
          const score = cosineSimilarity(universalVecs[field], erpVec);
          // console.log(score);
            if (score > bestScore) {
                bestScore = score;
                bestField = field;
            }
    }
    console.log(`Best match for ${erpField}: ${bestField} (${bestScore})`);
    const confidence = Math.round(bestScore * 1000) / 10;
    return bestScore >= threshold ? { match: bestField, confidence } : null;
  }
  
  module.exports = { aiMatchField };
  