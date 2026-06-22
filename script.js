const campos = [
  'nome', 'tipo', 'icone', 'categoria', 'avaliacao', 'versao',
  'sistema', 'mod', 'atualizacao', 'descricao', 'download',
  'screenshot1', 'screenshot2', 'screenshot3', 'recursosMod'
];

function obterValor(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function definirValor(id, valor) {
  const el = document.getElementById(id);
  if (el) el.value = valor || '';
}

function obterDadosFormulario() {
  const dados = {};
  campos.forEach(function (campo) {
    dados[campo] = obterValor(campo);
  });
  return dados;
}

function gerarSlug(nome) {
  if (!nome) return '';
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-premium-apk';
}

function gerarSeo(dados) {
  const nome = dados.nome || 'App';
  const versao = dados.versao || '1.0';
  return {
    titulo: nome + ' Premium APK v' + versao + ' Download Android',
    descricao: 'Baixe a versão mais recente de ' + nome + ' para Android. APK atualizado com recursos premium e download rápido.',
    slug: gerarSlug(nome)
  };
}

function escaparHtml(texto) {
  if (!texto) return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function gerarModFeaturesHtml(texto, mod) {
  const linhas = (texto || '').split('\n').filter(function (linha) {
    return linha.trim().length > 0;
  });
  if (linhas.length === 0) {
    if (mod) {
      return '<div class="app-feature">✓ ' + escaparHtml(mod) + '</div>';
    }
    return '';
  }
  let html = '';
  linhas.forEach(function (linha) {
    html += '<div class="app-feature">✓ ' + escaparHtml(linha.trim()) + '</div>\n';
  });
  return html;
}

function gerarScreenshotsHtml(dados) {
  const shots = [dados.screenshot1, dados.screenshot2, dados.screenshot3].filter(Boolean);
  if (shots.length === 0) return '';
  let html = '';
  shots.forEach(function (url) {
    html += '<img alt="' + escaparHtml(dados.nome) + '" src="' + escaparHtml(url) + '" />\n';
  });
  return html;
}

let templateHtml = '';

function carregarTemplate() {
  if (templateHtml) return Promise.resolve(templateHtml);
  return fetch('template.html')
    .then(function (res) {
      if (!res.ok) throw new Error('Não foi possível carregar template.html');
      return res.text();
    })
    .then(function (texto) {
      templateHtml = texto;
      return templateHtml;
    });
}

function substituirPlaceholder(html, chave, valor) {
  return html.split('{{' + chave + '}}').join(valor || '');
}

function gerarHtmlBlogger(dados) {
  if (!templateHtml) return '';

  const isJogo = dados.tipo === 'Jogo';
  const mapa = {
    APP_NAME: escaparHtml(dados.nome),
    APP_ICON: escaparHtml(dados.icone),
    VERSION: escaparHtml(dados.versao),
    CATEGORY: escaparHtml(dados.categoria),
    ANDROID: escaparHtml(dados.sistema),
    MOD: escaparHtml(dados.mod),
    MOD_FEATURES: gerarModFeaturesHtml(dados.recursosMod, dados.mod),
    SCREENSHOTS: gerarScreenshotsHtml(dados),
    DESCRIPTION: escaparHtml(dados.descricao).replace(/\n/g, '<br>'),
    DOWNLOAD_LINK: escaparHtml(dados.download),
    RATING: escaparHtml(dados.avaliacao),
    UPDATE: escaparHtml(dados.atualizacao),
    IMAGENS_TITULO: isJogo ? 'Imagens do jogo' : 'Imagens do aplicativo',
    FRASE_FINAL: isJogo ? 'Abra o jogo e aproveite.' : 'Abra o aplicativo e aproveite.'
  };

  let html = templateHtml;
  Object.keys(mapa).forEach(function (chave) {
    html = substituirPlaceholder(html, chave, mapa[chave]);
  });
  return html;
}

function aplicarSyntaxHighlight(html) {
  return html
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="tag">$2</span>')
    .replace(/(class|href|src|alt|rel|target)(=)/g, '<span class="attr">$1</span>$2')
    .replace(/(&quot;[^&]*&quot;)/g, '<span class="value">$1</span>');
}

function atualizarPreview(dados) {
  const iconEl = document.getElementById('previewIcon');
  const titleEl = document.getElementById('previewTitle');
  const catEl = document.getElementById('previewCategory');
  const versaoEl = document.getElementById('previewVersao');
  const avalEl = document.getElementById('previewAvaliacao');
  const dlEl = document.getElementById('previewDownload');

  if (iconEl) {
    if (dados.icone) {
      iconEl.src = dados.icone;
      iconEl.style.display = 'block';
      iconEl.alt = dados.nome || 'Ícone';
    } else {
      iconEl.style.display = 'none';
    }
  }
  if (titleEl) titleEl.textContent = dados.nome || 'Nome do App';
  if (catEl) catEl.textContent = dados.categoria || 'Categoria';
  if (versaoEl) versaoEl.textContent = dados.versao ? 'v' + dados.versao : 'v1.0';
  if (avalEl) avalEl.textContent = dados.avaliacao ? dados.avaliacao + ' ★' : '— ★';
  if (dlEl) {
    dlEl.href = dados.download || '#';
    if (!dados.download) dlEl.style.opacity = '0.5';
    else dlEl.style.opacity = '1';
  }
}

function atualizarSeo(dados) {
  const seo = gerarSeo(dados);
  definirValor('seoTitulo', seo.titulo);
  definirValor('seoDescricao', seo.descricao);
  definirValor('seoSlug', seo.slug);
}

function atualizarContador(texto) {
  const el = document.getElementById('charCount');
  if (el) el.textContent = texto.length + ' caracteres';
}

function atualizarSaida(html) {
  const codeEl = document.getElementById('htmlCode');
  if (codeEl) {
    codeEl.innerHTML = aplicarSyntaxHighlight(escaparHtml(html));
  }
  atualizarContador(html);
}

function atualizarTudo() {
  const dados = obterDadosFormulario();
  atualizarPreview(dados);
  atualizarSeo(dados);
}

function copiarTexto(texto) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(texto);
  }
  const ta = document.createElement('textarea');
  ta.value = texto;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

function mostrarStatus(mensagem, tipo) {
  const el = document.getElementById('importStatus');
  if (!el) return;
  el.textContent = mensagem;
  el.className = 'status-message show ' + (tipo || '');
}

function limparStatus() {
  const el = document.getElementById('importStatus');
  if (el) el.className = 'status-message';
}

let htmlGerado = '';

function handleGerarHtml() {
  const dados = obterDadosFormulario();
  htmlGerado = gerarHtmlBlogger(dados);
  if (!htmlGerado) {
    mostrarStatus('Aguarde o carregamento do template...', 'loading');
    carregarTemplate().then(function () {
      htmlGerado = gerarHtmlBlogger(dados);
      atualizarSaida(htmlGerado);
      mostrarStatus('HTML gerado com sucesso!', 'success');
      setTimeout(limparStatus, 3000);
    }).catch(function (err) {
      mostrarStatus('Erro: ' + err.message, 'error');
    });
    return;
  }
  atualizarSaida(htmlGerado);
  mostrarStatus('HTML gerado com sucesso!', 'success');
  setTimeout(limparStatus, 3000);
}

function handleCopiarHtml() {
  if (!htmlGerado) {
    const dados = obterDadosFormulario();
    htmlGerado = gerarHtmlBlogger(dados);
  }
  copiarTexto(htmlGerado).then(function () {
    mostrarStatus('HTML copiado para a área de transferência!', 'success');
    setTimeout(limparStatus, 3000);
  });
}

function handleCopiarSeo() {
  const dados = obterDadosFormulario();
  const seo = gerarSeo(dados);
  const texto = 'Título: ' + seo.titulo + '\nSlug: ' + seo.slug + '\nDescrição: ' + seo.descricao;
  copiarTexto(texto).then(function () {
    mostrarStatus('SEO copiado para a área de transferência!', 'success');
    setTimeout(limparStatus, 3000);
  });
}

function handleExportarHtml() {
  if (!htmlGerado) {
    const dados = obterDadosFormulario();
    htmlGerado = gerarHtmlBlogger(dados);
  }
  const blob = new Blob([htmlGerado], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (obterValor('nome') || 'postagem').replace(/\s+/g, '-').toLowerCase() + '.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleExportarTxt() {
  if (!htmlGerado) {
    const dados = obterDadosFormulario();
    htmlGerado = gerarHtmlBlogger(dados);
  }
  const blob = new Blob([htmlGerado], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (obterValor('nome') || 'postagem').replace(/\s+/g, '-').toLowerCase() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleLimpar() {
  campos.forEach(function (campo) {
    definirValor(campo, '');
  });
  definirValor('tipo', 'Aplicativo');
  definirValor('urlImportacao', '');
  htmlGerado = '';
  atualizarTudo();
  atualizarSaida('');
  limparStatus();
}

async function handleImportar() {
  const url = obterValor('urlImportacao');
  if (!url) {
    mostrarStatus('Cole uma URL válida antes de importar.', 'error');
    return;
  }
  mostrarStatus('Importando dados...', 'loading');
  try {
    await carregarTemplate();
    const dados = await importarDados(url);
    preencherFormulario(dados);
    atualizarTudo();
    const dadosAtual = obterDadosFormulario();
    htmlGerado = gerarHtmlBlogger(dadosAtual);
    atualizarSaida(htmlGerado);
    mostrarStatus('Dados importados com sucesso! Preencha Mod, Recursos do Mod e Link Download.', 'success');
  } catch (err) {
    mostrarStatus('Erro ao importar: ' + err.message, 'error');
  }
}

async function handleImportarGooglePlay() {
  const url = obterValor('urlImportacao');
  if (!url) {
    mostrarStatus('Cole uma URL da Google Play antes de importar.', 'error');
    return;
  }
  if (!url.includes('play.google.com')) {
    mostrarStatus('Esta função requer uma URL da Google Play.', 'error');
    return;
  }
  mostrarStatus('Importando da Google Play...', 'loading');
  try {
    await carregarTemplate();
    const dados = await importarGooglePlay(url);
    preencherFormulario(dados);
    atualizarTudo();
    const dadosAtual = obterDadosFormulario();
    htmlGerado = gerarHtmlBlogger(dadosAtual);
    atualizarSaida(htmlGerado);
    mostrarStatus('Dados importados da Google Play! Preencha Mod, Recursos do Mod e Link Download.', 'success');
  } catch (err) {
    mostrarStatus('Erro ao importar: ' + err.message, 'error');
  }
}

function preencherFormulario(dados) {
  if (dados.nome) definirValor('nome', dados.nome);
  if (dados.icone) definirValor('icone', dados.icone);
  if (dados.categoria) definirValor('categoria', dados.categoria);
  if (dados.avaliacao) definirValor('avaliacao', dados.avaliacao);
  if (dados.versao) definirValor('versao', dados.versao);
  if (dados.sistema) definirValor('sistema', dados.sistema);
  if (dados.atualizacao) definirValor('atualizacao', dados.atualizacao);
  if (dados.descricao) definirValor('descricao', dados.descricao);
  if (dados.screenshot1) definirValor('screenshot1', dados.screenshot1);
  if (dados.screenshot2) definirValor('screenshot2', dados.screenshot2);
  if (dados.screenshot3) definirValor('screenshot3', dados.screenshot3);
  if (dados.tipo) definirValor('tipo', dados.tipo);
  if (dados.mod) definirValor('mod', dados.mod);
}

document.addEventListener('DOMContentLoaded', function () {
  carregarTemplate().catch(function () {});

  campos.forEach(function (campo) {
    const el = document.getElementById(campo);
    if (el) {
      el.addEventListener('input', atualizarTudo);
      el.addEventListener('change', atualizarTudo);
    }
  });

  document.getElementById('btnGerar').addEventListener('click', handleGerarHtml);
  document.getElementById('btnCopiarHtml').addEventListener('click', handleCopiarHtml);
  document.getElementById('btnCopiarSeo').addEventListener('click', handleCopiarSeo);
  document.getElementById('btnCopiarOutput').addEventListener('click', handleCopiarHtml);
  document.getElementById('btnExportarHtml').addEventListener('click', handleExportarHtml);
  document.getElementById('btnExportarTxt').addEventListener('click', handleExportarTxt);
  document.getElementById('btnLimpar').addEventListener('click', handleLimpar);
  document.getElementById('btnImportar').addEventListener('click', handleImportar);
  document.getElementById('btnImportarGooglePlay').addEventListener('click', handleImportarGooglePlay);

  atualizarTudo();
});
