(function (global) {
  'use strict';
  function text(root, selectors) { for (const s of selectors) { const el = root.querySelector(s); if (el && el.textContent.trim()) return el.textContent.trim(); } return ''; }
  function attr(root, selectors, name) { for (const s of selectors) { const el = root.querySelector(s); if (el && el.getAttribute(name)) return el.getAttribute(name); } return ''; }
  function analisar(html) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const root = doc.querySelector('.mod-post-wrapper, .app-post, article, main') || doc.body;
    const meta = Array.from(root.querySelectorAll('.mod-meta-item')).reduce(function (out, el) {
      const label = text(el, ['.mod-meta-label']).toLowerCase(); const value = text(el, ['.mod-meta-value']); if (label) out[label] = value; return out;
    }, {});
    const screenshots = Array.from(root.querySelectorAll('.mod-gallery img, .app-gallery img, [class*="screenshot"] img')).map(function (img) { return img.getAttribute('src') || ''; }).filter(Boolean);
    const data = AppModels.novaPostagem({
      nome: text(root, ['.mod-title', '.app-title', 'h1', 'h2']), icone: attr(root, ['.mod-app-icon', '.app-icon'], 'src'),
      versao: meta['versão'] || meta['versao'] || '', dataAtualizacao: meta.atualizado || meta.atualização || '', sistema: meta.requisitos || '',
      categoria: meta['gênero'] || meta.genero || '', avaliacao: (meta['avaliação'] || meta.avaliacao || '').replace(/[^0-9.,]/g, ''),
      descricaoHtml: (root.querySelector('.mod-desc-text, .app-description, [itemprop="description"]') || {}).innerHTML || '',
      mod: text(root, ['.mod-dl-subtitle', '.mod-info']), linkDownload: attr(root, ['.mod-dl-bar', '.app-install', 'a[href*="download"]'], 'href'),
      screenshots, nomeArquivo: text(root, ['.mod-dl-filename', '.file-name']), htmlOriginalImportado: String(html || ''), status: 'rascunho'
    });
    const faltantes = ['nome', 'versao', 'descricaoHtml', 'linkDownload'].filter(function (key) { return !data[key]; });
    return { data, faltantes };
  }
  global.LegacyImporter = { analisar };
})(window);
