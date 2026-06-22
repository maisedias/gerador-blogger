function detectarFonte(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes('play.google.com/store/apps')) return 'playstore';
  if (lower.includes('apkpure.com')) return 'apkpure';
  if (lower.includes('apkmirror.com')) return 'apkmirror';
  if (lower.includes('happymod.com')) return 'happymod';
  if (lower.includes('aptoide.com')) return 'aptoide';
  return null;
}

function extrairAppIdGooglePlay(url) {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('id');
  } catch (e) {
    const match = url.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }
}

function normalizarResposta(data) {
  const screenshots = data.screenshots || [];
  return {
    nome: data.nome || data.title || '',
    icone: data.icone || data.icon || '',
    categoria: data.categoria || data.category || data.genre || '',
    avaliacao: data.avaliacao || (data.score ? String(data.score) : '') || (data.rating ? String(data.rating) : ''),
    versao: data.versao || data.version || '',
    sistema: data.sistema || data.androidVersion || data.minAndroid || '',
    atualizacao: data.atualizacao || data.updated || data.updateDate || '',
    descricao: data.descricao || data.description || '',
    screenshot1: data.screenshot1 || screenshots[0] || '',
    screenshot2: data.screenshot2 || screenshots[1] || '',
    screenshot3: data.screenshot3 || screenshots[2] || '',
    tipo: data.tipo || detectarTipo(data.categoria || data.category || data.genre || '')
  };
}

function detectarTipo(categoria) {
  const lower = (categoria || '').toLowerCase();
  const jogos = ['jogo', 'game', 'games', 'arcade', 'action', 'adventure', 'rpg', 'estratégia', 'strategy', 'corrida', 'racing', 'esporte', 'sport'];
  for (let i = 0; i < jogos.length; i++) {
    if (lower.includes(jogos[i])) return 'Jogo';
  }
  return 'Aplicativo';
}

async function fetchComFallback(endpoint) {
  const res = await fetch(endpoint);
  if (!res.ok) {
    const errData = await res.json().catch(function () { return {}; });
    throw new Error(errData.error || 'Erro HTTP ' + res.status);
  }
  return res.json();
}

async function importarGooglePlay(url) {
  const appId = extrairAppIdGooglePlay(url);
  if (!appId) {
    throw new Error('Não foi possível extrair o ID do app da URL.');
  }

  try {
    const data = await fetchComFallback('/.netlify/functions/playstore?appId=' + encodeURIComponent(appId));
    return normalizarResposta(data);
  } catch (backendErr) {
    return importarGooglePlayFallback(url, appId);
  }
}

async function importarGooglePlayFallback(url, appId) {
  try {
    const apiUrl = 'https://google-play-scraper-api.vercel.app/api?appId=' + encodeURIComponent(appId);
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('API fallback indisponível');
    const data = await res.json();
    return normalizarResposta({
      nome: data.title,
      icone: data.icon,
      categoria: data.genre,
      avaliacao: data.score ? data.score.toFixed(1) : '',
      versao: data.version,
      sistema: data.androidVersion,
      atualizacao: data.updated,
      descricao: data.description,
      screenshots: data.screenshots
    });
  } catch (apiErr) {
    throw new Error('Não foi possível importar da Google Play. Verifique a URL ou tente novamente.');
  }
}

async function importarDados(url) {
  const fonte = detectarFonte(url);
  if (!fonte) {
    throw new Error('URL não reconhecida. Use Google Play, APKPure, APKMirror, HappyMod ou Aptoide.');
  }

  if (fonte === 'playstore') {
    return importarGooglePlay(url);
  }

  const endpoint = '/.netlify/functions/' + fonte + '?url=' + encodeURIComponent(url);
  const data = await fetchComFallback(endpoint);
  return normalizarResposta(data);
}
