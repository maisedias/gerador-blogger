const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

function jsonResponse(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch (e) {
    return String(date);
  }
}

module.exports = { headers, jsonResponse, formatDate };
