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

    const nome = $('h1.title').text().trim()
      || $('.title-main').text().trim()
      || $('meta[property="og:title"]').attr('content')
      || $('h1').first().text().trim();

    const icone = $('.icon img').attr('src')
      || $('img.icon').attr('src')
      || $('meta[property="og:image"]').attr('content');

    const descricao = $('.description .translate-content').text().trim()
      || $('.description').text().trim()
      || $('meta[property="og:description"]').attr('content')
      || $('.p_desc').text().trim();

    const categoria = $('.category a').first().text().trim()
      || $('a[href*="/category/"]').first().text().trim();

    const avaliacao = $('.score').text().trim()
      || $('[itemprop="ratingValue"]').attr('content')
      || '';

    const versao = $('.version').first().text().trim()
      || $('span:contains("Version")').parent().text().replace('Version', '').trim()
      || $('.p_version').text().trim();

    const sistema = $('.p_system').text().trim()
      || $('span:contains("Android")').text().trim()
      || '';

    const atualizacao = $('.p_date').text().trim()
      || $('span:contains("Update")').text().replace('Update', '').trim()
      || '';

    const mod = $('.p_mod').text().trim()
      || $('.mod-info').text().trim()
      || '';

    const screenshots = [];
    $('.screenshot img, .gallery img, .screenshot-list img, .img-list img').each(function () {
      const src = $(this).attr('src') || $(this).attr('data-src') || $(this).attr('data-original');
      if (src && screenshots.length < 3) {
        const fullSrc = src.startsWith('//') ? 'https:' + src : src;
        if (!screenshots.includes(fullSrc)) {
          screenshots.push(fullSrc);
        }
      }
    });

    return jsonResponse(200, {
      nome: nome,
      icone: icone ? (icone.startsWith('//') ? 'https:' + icone : icone) : '',
      categoria: categoria,
      avaliacao: avaliacao,
      versao: versao,
      sistema: sistema,
      atualizacao: atualizacao,
      descricao: descricao,
      mod: mod,
      screenshots: screenshots,
      screenshot1: screenshots[0] || '',
      screenshot2: screenshots[1] || '',
      screenshot3: screenshots[2] || ''
    });
  } catch (err) {
    return jsonResponse(500, { error: err.message || 'Erro ao buscar dados do HappyMod.' });
  }
};
