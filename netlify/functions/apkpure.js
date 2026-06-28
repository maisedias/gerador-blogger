const axios = require('axios');
const cheerio = require('cheerio');
const { jsonResponse } = require('./_helpers');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    },
    timeout: 15000
  });
  return cheerio.load(response.data);
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' }, body: '' };
  }

  const url = event.queryStringParameters && event.queryStringParameters.url;

  if (!url) {
    return jsonResponse(400, { error: 'Parâmetro url é obrigatório.' });
  }

  try {
    const $ = await fetchPage(url);

    const nome = $('h1.title-like').first().text().trim()
      || $('meta[property="og:title"]').attr('content')
      || $('h1').first().text().trim();

    const icone = $('img.icon').attr('src')
      || $('meta[property="og:image"]').attr('content')
      || $('.icon img').attr('src');

    const descricao = $('.description').text().trim()
      || $('meta[property="og:description"]').attr('content')
      || $('.translate-content').text().trim();

    const categoria = $('.category span').first().text().trim()
      || $('a[href*="/category/"]').first().text().trim();

    const avaliacao = $('.average-rating').text().trim()
      || $('[itemprop="ratingValue"]').attr('content')
      || $('.score').text().trim();

    const versao = $('p.version').text().replace('Version:', '').trim()
      || $('.version').first().text().trim()
      || $('span[data-dt-version]').text().trim();

    const atualizacao = $('p.date').text().replace('Update on:', '').trim()
      || $('.date').first().text().trim();

    const sistema = $('dt:contains("Requires Android")').next('dd').text().trim()
      || $('dt:contains("Android")').next('dd').text().trim()
      || '';

    const screenshots = [];
    $('.screenshot img, .screenshot-img, .gallery-screen img').each(function () {
      const src = $(this).attr('src') || $(this).attr('data-src');
      if (src && screenshots.length < 3) {
        screenshots.push(src.startsWith('//') ? 'https:' + src : src);
      }
    });

    if (screenshots.length === 0) {
      $('img[data-src*="screenshot"], .screenshot .img-responsive').each(function () {
        const src = $(this).attr('src') || $(this).attr('data-src');
        if (src && screenshots.length < 3) {
          screenshots.push(src.startsWith('//') ? 'https:' + src : src);
        }
      });
    }

    return jsonResponse(200, {
      nome: nome,
      icone: icone ? (icone.startsWith('//') ? 'https:' + icone : icone) : '',
      categoria: categoria,
      avaliacao: avaliacao,
      versao: versao,
      sistema: sistema,
      atualizacao: atualizacao,
      descricao: descricao,
      screenshots: screenshots,
      screenshot1: screenshots[0] || '',
      screenshot2: screenshots[1] || '',
      screenshot3: screenshots[2] || ''
    });
  } catch (err) {
    return jsonResponse(500, { error: err.message || 'Erro ao buscar dados do APKPure.' });
  }
};
