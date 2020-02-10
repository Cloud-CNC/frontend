# Frontend
![status](https://img.shields.io/badge/status-under%20development-yellow)
[![tests](https://img.shields.io/github/workflow/status/Cloud-CNC/frontend/tests)](https://github.com/Cloud-CNC/frontend/actions)
[![issues](https://img.shields.io/github/issues/Cloud-CNC/frontend)](https://github.com/Cloud-CNC/frontend/issues)
[![last commit](https://img.shields.io/github/last-commit/Cloud-CNC/frontend)](https://github.com/Cloud-CNC/frontend/commits/master)

This repository is only intended for developers, end users should probably use the [core repository](https://github.com/cloud-cnc/core) unless you're using a static resource server, then you can build your own frontend using this repository. This is used as a submodule in the [core repository](https://github.com/cloud-cnc/core).

## Development

### Environment Setup
1. Install [Vue CLI](https://cli.vuejs.org/) via `npm i @vue/cli -g`
2. Install dependencies via running `npm i`
3. Setup a core server instance
4. Modify the config file
5. Run Vue CLI via `vue ui`

### Recommended IDE Extensions
Name | VS Code | Atom
--- | --- | ---
ESLint | [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | [ESLint](https://atom.io/packages/eslint)
Spell Checker | [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) (Enable cSpell.allowCompoundWords) | [Spell Check](https://atom.io/packages/spell-check)
Mark code for review, take notes, add todo items, etc. | [Comment Anchors](https://marketplace.visualstudio.com/items?itemName=ExodiusStudios.comment-anchors) | [language-todo-extra-words](https://atom.io/packages/language-todo-extra-words)
Colorize pairs of brackets | [Bracket Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2) | [Bracket Colorizer](https://atom.io/packages/bracket-colorizer)
Help with writing documentation | [GitHub Markdown Preview](https://marketplace.visualstudio.com/items?itemName=bierner.github-markdown-preview) | [Markdown Preview](https://atom.io/packages/markdown-preview)
Vue tooling | [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) | [Vue FMT](https://atom.io/packages/vue-fmt)
Vue boilerplate | [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) | [Vue Snippets](https://atom.io/packages/vue-snippets)

### NPM Scripts
Name | Description
--- | ---
`serve` | Server frontend on a development server
`build` | Build frontend (for production)
`test:unit` | Run unit tests (Mocha & Chai)
`test:e2e` | Run E2E tests (Nightwatch)
`lint` | Lint with ESlint