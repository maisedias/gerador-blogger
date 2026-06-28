# TAREFA

Crie um projeto web completo chamado **Gerador Blogger APK Pro**.

O projeto deve ser desenvolvido em HTML, CSS e JavaScript puro, sem frameworks e sem dependências obrigatórias.

Entregue um projeto totalmente funcional, pronto para hospedar no Netlify ou GitHub Pages.

Ao final, gere automaticamente um arquivo ZIP contendo:

* index.html
* style.css
* script.js

Não entregue pseudocódigo.

Não omita partes.

Não utilize comentários do tipo "continua aqui" ou "implemente depois".

Todos os arquivos devem estar completos.

---

# OBJETIVO

Criar um sistema profissional para gerar automaticamente postagens HTML para Blogger.

O HTML gerado deve preservar EXATAMENTE as classes do template.

NÃO altere nomes de classes.

NÃO altere a estrutura.

NÃO remova atributos.

---

# TEMPLATE OBRIGATÓRIO

Use exatamente:

```html
<div class="app-post">

  <div class="app-hero">
    <img alt="{NOME}" class="app-icon" src="{ICONE}" />

    <div>
      <h2 class="app-title">{NOME}</h2>
      <div class="app-dev">Blog de Jogos • Android</div>

      <div class="app-meta">
        <span>Android</span>
        <span>{CATEGORIA}</span>
        <span>Apk Mod</span>
        <span>{ATUALIZACAO}</span>
      </div>

      <a class="app-install"
         href="{DOWNLOAD}"
         rel="nofollow noopener"
         target="_blank">
         Baixar Apk
      </a>
    </div>
  </div>

  <div class="app-stats">

    <div class="app-stat">
      <strong>{AVALIACAO} ★</strong>
      <small>Avaliação</small>
    </div>

    <div class="app-stat">
      <strong>Versão</strong>
      <small>{VERSAO}</small>
    </div>

    <div class="app-stat">
      <strong>Android</strong>
      <small>{SISTEMA}</small>
    </div>

    <div class="app-stat">
      <strong>Mod</strong>
      <small>{MOD}</small>
    </div>

  </div>

</div>
```

Após isso, gerar automaticamente todas as seções:

# Sobre este Aplicativo/Jogo

Classe:

```html
<div class="app-section">
```

# Informações do Apk

Classe:

```html
<div class="app-info-grid">
```

# Recursos do Mod

Classe:

```html
<div class="app-feature-list">
```

Cada item:

```html
<div class="app-feature">
✓ Premium
</div>
```

# Screenshots

Classe:

```html
<div class="app-gallery">
```

Cada imagem:

```html
<img class="app-shot">
```

# Aviso

Classe:

```html
<div class="app-warning">
```

# Como instalar

Classe:

```html
<div class="app-install-guide">
```

# Download

Classe:

```html
<div class="app-download-box">
```

Botão:

```html
<a class="app-download-btn">
```

Preserve rigorosamente os nomes das classes.

---

# FORMULÁRIO

Criar campos:

Nome

Tipo

Aplicativo
Jogo

Ícone

Categoria

Avaliação

Versão

Sistema

Mod

Atualização

Descrição

Link Download

Screenshot 1

Screenshot 2

Screenshot 3

Recursos do Mod (textarea)

---

# RECURSOS DO MOD

Exemplo digitado:

Premium
Sem anúncios
Moedas infinitas

Gerar:

```html
<div class="app-feature-list">
<div class="app-feature">✓ Premium</div>
<div class="app-feature">✓ Sem anúncios</div>
<div class="app-feature">✓ Moedas infinitas</div>
</div>
```

---

# COMPORTAMENTO DO TIPO

Se Tipo = Aplicativo:

Gerar:

```html
<h2>Imagens do aplicativo</h2>
```

e:

```html
Abra o aplicativo e aproveite.
```

Se Tipo = Jogo:

Gerar:

```html
<h2>Imagens do jogo</h2>
```

e:

```html
Abra o jogo e aproveite.
```

---

# INTERFACE

Tema claro.

Visual moderno.

Layout dashboard.

Cards.

Responsivo.

Sidebar.

Inputs organizados.

Botões modernos.

Sombras suaves.

Fonte Inter.

Sem Bootstrap.

Sem Tailwind.

CSS puro.

---

# PRÉ-VISUALIZAÇÃO EM TEMPO REAL

Exibir:

Ícone

Título

Categoria

Versão

Avaliação

Botão Download

Atualizar instantaneamente conforme o usuário digita.

---

# SEO AUTOMÁTICO

Gerar:

Título SEO:

```text
{NOME} Premium APK v{VERSAO} Download Android
```

Meta Description:

```text
Baixe a versão mais recente de {NOME} para Android. APK atualizado com recursos premium e download rápido.
```

Slug:

```text
nome-do-app-premium-apk
```

Criar botão:

Copiar SEO.

---

# BOTÕES

Gerar HTML

Copiar HTML

Copiar SEO

Limpar

Exportar TXT

Exportar HTML

---

# ÁREA DE SAÍDA

Editor grande.

Syntax highlighting simples.

Botão copiar.

Contador de caracteres.

---

# JAVASCRIPT

Implementar:

Preview em tempo real.

Gerar slug automaticamente.

Converter recursos em lista HTML.

Gerar HTML completo do Blogger.

Copiar para área de transferência.

Limpar formulário.

Exportar HTML.

Exportar TXT.

Não usar bibliotecas externas.

---

# ESTRUTURA

Entregar:

index.html

style.css

script.js

Todos completos.

Sem trechos omitidos.

Sem pseudocódigo.

Sem abreviações.

Sem "...".

Sem comentários "continua".

Gerar os arquivos integralmente.

Após concluir, criar automaticamente:

```text
Gerador-Blogger-APK-Pro.zip
```

contendo todos os arquivos prontos para publicação.

# IMPORTAÇÃO AUTOMÁTICA DA GOOGLE PLAY

Adicionar uma funcionalidade premium chamada **Importar da Google Play**.

Criar um campo:

```html
URL da Google Play
```

Exemplo:

```text
https://play.google.com/store/apps/details?id=com.spotify.music
```

Criar botão:

```text
Importar Dados
```

Ao clicar, o sistema deve extrair automaticamente da página da Google Play:

* Nome do aplicativo ou jogo
* Ícone
* Categoria
* Avaliação
* Versão
* Atualização
* Descrição completa
* Screenshot 1
* Screenshot 2
* Screenshot 3
* Sistema Android suportado (quando disponível)

Preencher automaticamente os campos do formulário.

O usuário deverá preencher manualmente apenas:

* Mod
* Recursos do Mod
* Link de Download APK

Após importar, atualizar automaticamente:

* Pré-visualização
* SEO
* Slug
* HTML gerado

---

# IMPLEMENTAÇÃO

Criar um módulo:

```text
playstore.js
```

Criar função:

```javascript
async function importarGooglePlay(url)
```

Utilizar uma das abordagens abaixo:

## Opção 1 (Preferencial)

Consumir:

```text
https://play.google.com/store/apps/details?id=
```

Fazer parsing do HTML utilizando DOMParser.

Extrair:

* title
* images
* screenshots
* description
* rating
* category

---

## Opção 2 (Fallback)

Consumir a API:

```text
https://google-play-scraper-api.vercel.app/api?appId=
```

ou

```text
google-play-scraper
```

via Node.js.

---

## Opção 3 (Mais profissional)

Criar backend serverless para Netlify:

```text
/netlify/functions/playstore.js
```

Utilizando:

```bash
google-play-scraper
```

Exemplo:

```javascript
const gplay = require("google-play-scraper");

exports.handler = async(event) => {

const appId = event.queryStringParameters.appId;

const app = await gplay.app({
appId
});

return {
statusCode:200,
body:JSON.stringify(app)
};

}
```

No front-end:

```javascript
fetch("/.netlify/functions/playstore?appId=com.spotify.music")
```

Preencher automaticamente:

```javascript
nome
icone
categoria
avaliacao
versao
descricao
screenshots
```

---

# BOTÕES

Adicionar:

Importar Google Play

Gerar HTML

Copiar HTML

Copiar SEO

Exportar HTML

Exportar TXT

Limpar

---

# EXPERIÊNCIA DE USO

Fluxo desejado:

1. Colar:

```text
https://play.google.com/store/apps/details?id=com.spotify.music
```

2. Clicar:

```text
Importar Google Play
```

3. O sistema busca automaticamente:

✅ Nome

✅ Ícone

✅ Categoria

✅ Avaliação

✅ Descrição

✅ Screenshots

✅ Versão

✅ Atualização

4. Usuário preenche apenas:

* Mod
* Recursos do Mod
* Link do APK

5. Clicar:

```text
Gerar HTML
```

6. Produzir o HTML completo compatível com o Blogger.

---

# IMPORTAÇÃO DE OUTRAS FONTES

Adicionar suporte para:

APKPure

APKMirror

HappyMod

Aptoide

Permitir colar qualquer URL e detectar automaticamente a origem.

Implementar:

```javascript
detectarFonte(url)
```

Retornando:

```javascript
playstore
apkpure
apkmirror
happymod
aptoide
```

Fazer a extração automática correspondente.

---

Entregar tudo completamente implementado, sem pseudocódigo, incluindo:

* index.html
* style.css
* script.js
* playstore.js
* netlify/functions/playstore.js

e gerar automaticamente:

```text
Gerador-Blogger-APK-Pro.zip
```

com todos os arquivos prontos para publicação no Netlify ou GitHub Pages.