(function (global) {
  'use strict';
  const OBRIGATORIAS = ['nome', 'versao', 'descricaoHtml', 'linkDownload'];
  const CONHECIDAS = ['nome', 'tipo', 'icone', 'categoria', 'avaliacao', 'versao', 'sistema', 'dataAtualizacao', 'descricaoHtml', 'mod', 'linkDownload', 'nomeArquivo', 'slug', 'postId', 'tituloSeo', 'metaDescription', 'screenshots', 'recursosModHtml', 'tamanhoArquivo', 'imagensTitulo', 'fraseFinal', 'downloadHref', 'downloadEstado'];

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function get(data, path) {
    if (path === 'this') return data.this;
    return path.split('.').reduce(function (value, key) { return value == null ? '' : value[key]; }, data);
  }

  function render(template, input) {
    const data = Object.assign({}, input);
    let html = String(template || '');
    html = html.replace(/{{#each\s+([\w.]+)}}([\s\S]*?){{\/each}}/g, function (_, key, block) {
      const list = get(data, key);
      return Array.isArray(list) ? list.map(function (item) {
        return block.replace(/{{this}}/g, escapeHtml(item)).replace(/{{\.\.\/([\w.]+)}}/g, function (m, parent) { return escapeHtml(get(data, parent)); });
      }).join('') : '';
    });
    html = html.replace(/{{#if\s+([\w.]+)}}([\s\S]*?){{\/if}}/g, function (_, key, block) { return get(data, key) ? block : ''; });
    html = html.replace(/{{{\s*([\w.]+)\s*}}}/g, function (_, key) { return String(get(data, key) || ''); });
    html = html.replace(/{{\s*([\w.]+)\s*}}/g, function (_, key) { return escapeHtml(get(data, key)); });
    return html;
  }

  function analisar(conteudo) {
    const found = new Set();
    String(conteudo || '').replace(/{{{?\s*(?:#(?:if|each)\s+|\.\.\/)?([\w.]+|this)/g, function (_, key) { if (key !== 'this') found.add(key); return _; });
    const encontradas = Array.from(found).sort();
    return {
      encontradas,
      ausentes: OBRIGATORIAS.filter(function (key) { return !found.has(key); }),
      desconhecidas: encontradas.filter(function (key) { return !CONHECIDAS.includes(key); })
    };
  }

  global.TemplateEngine = { OBRIGATORIAS, CONHECIDAS, escapeHtml, render, analisar };
})(typeof window !== 'undefined' ? window : globalThis);
