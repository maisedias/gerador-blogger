const { jsonResponse, formatDate } = require('./_helpers');

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }

  const appId = event.queryStringParameters && event.queryStringParameters.appId;

  if (!appId) {
    return jsonResponse(400, { error: 'Parâmetro appId é obrigatório.' });
  }

  try {
    const gplayModule = await import('google-play-scraper');
    const gplay = gplayModule.default || gplayModule;

    const app = await gplay.app({
      appId: appId,
      lang: 'pt',
      country: 'br'
    });

    const screenshots = (app.screenshots || []).slice(0, 3);

    return jsonResponse(200, {
      nome: app.title || '',
      icone: app.icon || '',
      categoria: app.genre || '',
      avaliacao: app.score ? app.score.toFixed(1) : '',
      versao: app.version || app.currentVersion || '',
      sistema: app.androidVersion || app.minAndroidVersion || '',
      atualizacao: formatDate(app.updated),
      descricao: app.description || app.summary || '',
      screenshots: screenshots,
      screenshot1: screenshots[0] || '',
      screenshot2: screenshots[1] || '',
      screenshot3: screenshots[2] || ''
    });
  } catch (err) {
    return jsonResponse(500, { error: err.message || 'Erro ao buscar dados da Google Play.' });
  }
};
