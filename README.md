# Word-Analyzer

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

```
Word-Analyzer
├─ .editorconfig
├─ .oxlintrc.json
├─ .prettierrc.json
├─ client
│  ├─ App.vue
│  ├─ assets
│  │  ├─ base.css
│  │  ├─ logo.svg
│  │  └─ main.css
│  ├─ components
│  │  ├─ AIPanel.vue
│  │  ├─ CharacterDistributionChart.vue
│  │  ├─ FeedbackForm.vue
│  │  └─ WordFrequencyChart.vue
│  ├─ env.d.ts
│  ├─ main.ts
│  ├─ router
│  │  └─ index.ts
│  ├─ services
│  │  ├─ api.ts
│  │  ├─ pdfExport.ts
│  │  └─ textAnalyzer.ts
│  ├─ stores
│  │  ├─ ai.ts
│  │  ├─ analyzer.ts
│  │  └─ counter.ts
│  └─ views
│     ├─ AnalyzerPage.vue
│     └─ HomePage.vue
├─ docs
├─ env.d.ts
├─ eslint.config.ts
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ favicon.ico
├─ README.md
├─ server
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ aiController.js
│  │  ├─ analyzeController.js
│  │  ├─ exportController.js
│  │  ├─ feedbackController.js
│  │  └─ uploadController.js
│  ├─ models
│  │  └─ Feedback.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ ai.js
│  │  ├─ analyze.js
│  │  ├─ export.js
│  │  ├─ feedback.js
│  │  └─ upload.js
│  ├─ server.js
│  ├─ services
│  │  ├─ aiService.js
│  │  └─ textAnalyzer.js
│  └─ utils
│     └─ stopWords.js
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```
```
Word-Analyzer
├─ .editorconfig
├─ .oxlintrc.json
├─ .prettierrc.json
├─ docs
├─ env.d.ts
├─ eslint.config.ts
├─ index.html
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ favicon.ico
├─ README.md
├─ server
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ aiController.js
│  │  ├─ analyzeController.js
│  │  ├─ exportController.js
│  │  ├─ feedbackController.js
│  │  └─ uploadController.js
│  ├─ models
│  │  └─ Feedback.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ ai.js
│  │  ├─ analyze.js
│  │  ├─ export.js
│  │  ├─ feedback.js
│  │  └─ upload.js
│  ├─ server.js
│  ├─ services
│  │  ├─ aiService.js
│  │  └─ textAnalyzer.js
│  └─ utils
│     └─ stopWords.js
├─ src
│  ├─ App.vue
│  ├─ assets
│  │  ├─ base.css
│  │  ├─ logo.svg
│  │  └─ main.css
│  ├─ components
│  │  ├─ AIPanel.vue
│  │  ├─ CharacterDistributionChart.vue
│  │  ├─ FeedbackForm.vue
│  │  └─ WordFrequencyChart.vue
│  ├─ env.d.ts
│  ├─ main.ts
│  ├─ router
│  │  └─ index.ts
│  ├─ services
│  │  ├─ api.ts
│  │  ├─ pdfExport.ts
│  │  └─ textAnalyzer.ts
│  ├─ stores
│  │  ├─ ai.ts
│  │  ├─ analyzer.ts
│  │  └─ counter.ts
│  └─ views
│     ├─ AnalyzerPage.vue
│     └─ HomePage.vue
├─ tailwind.config.js
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vercel.json
└─ vite.config.ts

```