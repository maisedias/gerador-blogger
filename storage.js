(function (global) {
  'use strict';
  const DB_NAME = 'gerador-blogger-apk-pro';
  const DB_VERSION = 2;
  let dbPromise;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        const db = req.result;
        if (!db.objectStoreNames.contains('postagens')) { const s = db.createObjectStore('postagens', { keyPath: 'id' }); s.createIndex('atualizadoEm', 'atualizadoEm'); }
        if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('historico')) { const h = db.createObjectStore('historico', { keyPath: 'id' }); h.createIndex('postId', 'postId'); }
        if (!db.objectStoreNames.contains('configuracoes')) db.createObjectStore('configuracoes', { keyPath: 'chave' });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
      req.onblocked = function () { reject(new Error('Feche outras abas do gerador para atualizar o banco.')); };
    });
    return dbPromise;
  }

  async function store(name, mode) { return (await open()).transaction(name, mode || 'readonly').objectStore(name); }
  async function request(req) { return new Promise(function (resolve, reject) { req.onsuccess = function () { resolve(req.result); }; req.onerror = function () { reject(req.error); }; }); }
  async function put(name, value) { return request((await store(name, 'readwrite')).put(value)); }
  async function get(name, id) { return request((await store(name)).get(id)); }
  async function all(name) { return request((await store(name)).getAll()); }
  async function remove(name, id) { return request((await store(name, 'readwrite')).delete(id)); }
  async function clear(name) { return request((await store(name, 'readwrite')).clear()); }

  async function historico(postId) {
    const index = (await store('historico')).index('postId');
    const rows = await request(index.getAll(IDBKeyRange.only(postId)));
    return rows.sort(function (a, b) { return b.criadoEm.localeCompare(a.criadoEm); });
  }

  async function exportar() {
    return { app: DB_NAME, schemaVersion: DB_VERSION, exportadoEm: new Date().toISOString(), postagens: await all('postagens'), templates: await all('templates'), historico: await all('historico'), configuracoes: await all('configuracoes') };
  }

  function validarBackup(data) {
    if (!data || data.app !== DB_NAME || !Number.isInteger(data.schemaVersion)) throw new Error('Este arquivo não é um backup válido do Gerador Blogger.');
    ['postagens', 'templates', 'historico', 'configuracoes'].forEach(function (key) { if (!Array.isArray(data[key])) throw new Error('Backup inválido: coleção ' + key + ' ausente.'); });
    if (data.schemaVersion > DB_VERSION) throw new Error('O backup foi criado por uma versão mais nova do aplicativo.');
    return true;
  }

  async function importar(data) {
    validarBackup(data);
    for (const name of ['postagens', 'templates', 'historico', 'configuracoes']) {
      for (const row of data[name]) await put(name, row);
    }
  }

  global.AppDB = { DB_NAME, DB_VERSION, open, put, get, all, remove, clear, historico, exportar, validarBackup, importar };
})(window);
