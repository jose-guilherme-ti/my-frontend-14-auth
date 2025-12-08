/// <reference types="cypress" />

describe("Fluxo completo: Login + Navegação pelo Header", () => {

  //
  // ================================
  // 🔐 SESSION (evita re-login)
  // ================================
  //
  beforeEach(() => {
    cy.session("login-session", () => {
      cy.visit("http://localhost:3000/login");

      // Verifica se carregou inputs (evita hydration error)
      cy.get('[data-testid="login-email"]', { timeout: 8000 }).should("exist");
      cy.get('[data-testid="login-password"]').should("exist");

      // Preenche login
      cy.get('[data-testid="login-email"]').type("admin@example.com");
      cy.get('[data-testid="login-password"]').type("123456");

      cy.get('[data-testid="login-submit"]').click();

      // Login não deve falhar
      cy.url().should("not.include", "/login");
      cy.contains("GraphQL Dashboard", { timeout: 8000 }).should("exist");
    });
  });

  //
  // ================================
  // 📌 TESTE FINAL: Navegação HEADER
  // ================================
  //
  it("Testa navegação do Header - esquerda → direita", () => {
    cy.visit("http://localhost:3000/");

    // Aguarda Header montar
    cy.contains("GraphQL Dashboard", { timeout: 8000 }).should("exist");

    //
    // ORDEM DA ESQUERDA → DIREITA
    //




    cy.get('[data-testid="nav-stepper"]').click();
    cy.url().should("include", "/stepper");
    //cy.wait(2000);
    cy.contains("Dados pessoais").should("exist");

    //Select
    cy.get('[data-cy="theme-select"]').click();
    cy.get('li[role="option"]').contains('MEDIEVAL').click();
    cy.get('[data-cy="theme-select"]').should('contain', 'MEDIEVAL');
    cy.wait(2000);
    cy.get('[data-cy="theme-select"]').click();
    cy.get('li[role="option"]').contains('DARK').click();
    cy.get('[data-cy="theme-select"]').should('contain', 'DARK');
    cy.wait(2000);
    cy.get('[data-cy="theme-select"]').click();
    cy.get('li[role="option"]').contains('LIGHT').click();
    cy.get('[data-cy="theme-select"]').should('contain', 'LIGHT');


    // Seleciona o input de arquivo e anexa a imagem do fixtures
    cy.get('input[type="file"]')
      .selectFile('cypress/fixtures/foto2.png', { force: true });

    // Asserção: verifique se o nome do arquivo aparece na interface do usuário (depende da sua aplicação)
    //cy.contains('foto2.png').should('be.visible');

    cy.get('input[name="name"]')
      .should("be.visible")
      .type("José Guilherme");


    cy.get('input[name="email"]').type("jose@example.com");
    cy.get('input[name="cpf"]').type("123.456.789-09");
    cy.get('input[name="phone"]').type("(11) 99999-9999");
    cy.contains("Próximo").click();

    cy.get('input[name="cep"]').type("01001-000");


    cy.get('input[name="street"]').type("Praça da Sé");
    cy.get('input[name="district"]').type("Centro");
    cy.get('input[name="city"]').type("São Paulo");

    cy.contains("Próximo").click();

    cy.get('input[name="occupation"]').type("Desenvolvedor");
    cy.get('input[name="income"]').type("4500");
    cy.get('textarea[name="description"]').type("Teste completo");

    cy.contains("Finalizar").click();

    cy.on("window:alert", (txt) => {
      expect(txt).to.contains("Finalizado");
    });

    cy.contains("Prévia do objeto final").should("exist");

    cy.contains("Resetar").click();
    cy.get('[data-cy="progress"]').should('contain', '0%');
    cy.wait(2000);

    // Asserção 2: O input deve estar vazio
    cy.get('input[name="name"]')
      .should('be.empty');
    cy.get('input[name="email"]')
      .should('be.empty');
    cy.get('input[name="cpf"]')
      .should('be.empty');
    cy.get('input[name="phone"]')
      .should('be.empty');
    /*    
       cy.go("back");
   
       cy.get('[data-testid="nav-progress"]').click();
       cy.url().should("include", "/progresso");
       cy.go("back");
   
       cy.get('[data-testid="nav-users"]').click();
       cy.url().should("include", "/users");
       cy.go("back");
   
       cy.get('[data-testid="nav-posts"]').click();
       cy.url().should("include", "/posts");
       cy.wait(2000);
       cy.go("back");
   
       cy.get('[data-testid="nav-post-sub"]').should('exist').click();
       cy.get('[data-testid="nav-post-sub"]').click();
       cy.url().should("include", "/post_subcription");
       cy.go("back");
   
       cy.get('[data-testid="nav-create-post"]').should('exist').click();
       cy.get('[data-testid="nav-create-post"]').click();
       cy.url().should("include", "/create_post");
       cy.go("back");
   
       // Logout sempre por último
       cy.get('[data-testid="nav-logout"]').click();
       cy.url().should("include", "/login"); */
  });
});
