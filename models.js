(function (global) {
  'use strict';

  const TEMPLATE_PADRAO_ID = 'template-apk-padrao';
  const CAMPOS_PROTEGIVEIS = ['nome', 'descricaoHtml', 'mod', 'icone', 'screenshots', 'linkDownload', 'seo', 'categoria'];

  function uuid() {
    if (global.crypto && global.crypto.randomUUID) return global.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }

  function slugify(value) {
    return String(value || '').toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }

  function safeVersion(value) {
    return String(value || '1.0').replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  }

  function gerarNomeArquivo(nome, versao, mod) {
    return [slugify(nome) || 'aplicativo', 'v' + safeVersion(versao), mod ? 'mod' : ''].filter(Boolean).join('-') + '.apk';
  }

  function seoAutomatico(dados) {
    const nome = dados.nome || 'Aplicativo';
    const versao = dados.versao || '1.0';
    return {
      tituloSeo: nome + ' APK v' + versao + (dados.mod ? ' MOD' : '') + ' para Android',
      metaDescription: 'Baixe ' + nome + ' v' + versao + ' para Android. Versão atualizada, informações e download em APK.',
      slug: slugify(nome)
    };
  }

  function novaPostagem(input) {
    const now = new Date().toISOString();
    const data = Object.assign({
      id: uuid(), nome: '', tipo: 'Aplicativo', categoria: '', icone: '', avaliacao: '',
      versao: '', sistema: '', dataAtualizacao: '', descricaoHtml: '', mod: '', recursosMod: '',
      linkDownload: '', screenshots: [], templateId: TEMPLATE_PADRAO_ID, tituloSeo: '', slug: '',
      metaDescription: '', nomeArquivo: '', tamanhoArquivo: '', urlFonte: '', status: 'rascunho',
      htmlGerado: '', criadoEm: now, atualizadoEm: now, seoTituloAutomatico: true,
      seoDescricaoAutomatica: true, nomeArquivoAutomatico: true, camposProtegidos: [], novidadesVersao: ''
    }, input || {});
    const seo = seoAutomatico(data);
    if (!data.tituloSeo) data.tituloSeo = seo.tituloSeo;
    if (!data.metaDescription) data.metaDescription = seo.metaDescription;
    if (!data.slug) data.slug = seo.slug;
    if (!data.nomeArquivo) data.nomeArquivo = gerarNomeArquivo(data.nome, data.versao, data.mod);
    data.screenshots = Array.isArray(data.screenshots) ? data.screenshots.filter(Boolean) : [];
    return data;
  }

  function atualizarAutomaticos(data, anterior) {
    const seo = seoAutomatico(data);
    if (data.seoTituloAutomatico !== false) data.tituloSeo = seo.tituloSeo;
    else if (anterior && anterior.versao && data.tituloSeo === anterior.tituloSeo) data.tituloSeo = anterior.tituloSeo;
    if (data.seoDescricaoAutomatica !== false) data.metaDescription = seo.metaDescription;
    if (data.nomeArquivoAutomatico !== false) data.nomeArquivo = gerarNomeArquivo(data.nome, data.versao, data.mod);
    if (!data.slug) data.slug = seo.slug;
    return data;
  }

  function validarUrl(value) {
    if (!value) return false;
    try { const u = new URL(value); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (_) { return false; }
  }

  function validarPostagem(data, template, templateReport) {
    const erros = [], avisos = [];
    if (!data.nome) erros.push('O nome é obrigatório.');
    if (!data.versao) erros.push('A versão é obrigatória.');
    if (!data.linkDownload) erros.push('O link de download não foi informado.');
    else if (!validarUrl(data.linkDownload)) erros.push('O link de download é inválido.');
    if (data.icone && !validarUrl(data.icone)) erros.push('A URL do ícone é inválida.');
    const seen = new Set();
    (data.screenshots || []).forEach(function (url) {
      if (!validarUrl(url)) erros.push('Screenshot inválida: ' + url);
      if (seen.has(url)) avisos.push('Há screenshots duplicadas.');
      seen.add(url);
    });
    if (!template) erros.push('O template selecionado não existe.');
    else if (!template.ativo) erros.push('O template selecionado está inativo.');
    if (templateReport && templateReport.ausentes.length) erros.push('Variáveis obrigatórias ausentes: ' + templateReport.ausentes.join(', '));
    if ((data.tituloSeo || '').length > 60) avisos.push('O título SEO excede 60 caracteres.');
    if ((data.metaDescription || '').length > 160) avisos.push('A meta description excede 160 caracteres.');
    if (data.slug !== slugify(data.slug)) erros.push('O slug contém caracteres inválidos.');
    if (/[\\/:*?"<>|]/.test(data.nomeArquivo || '')) erros.push('O nome do arquivo contém caracteres inválidos.');
    return { erros: Array.from(new Set(erros)), avisos: Array.from(new Set(avisos)) };
  }

  global.AppModels = { TEMPLATE_PADRAO_ID, CAMPOS_PROTEGIVEIS, uuid, slugify, gerarNomeArquivo, seoAutomatico, novaPostagem, atualizarAutomaticos, validarUrl, validarPostagem };
})(typeof window !== 'undefined' ? window : globalThis);
