import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
  },

  component: {
    // Configura o Cypress para usar o dev server do Next.js
    devServer: {
      framework: "next",
      bundler: "webpack",
      // O Cypress detecta automaticamente a configuração do Next.js 
      // (incluindo next.config.js e o uso do SWC) quando 'framework: "next"' é usado.
    },
    // Você pode precisar adicionar a linha abaixo se o seu projeto usa TypeScript/JSX
    // fileServerFolder: '.', 
    // specPattern: 'cypress/component/**/*.{js,jsx,ts,tsx}', // Padrão de onde os testes de componentes estão localizados
  },
});
