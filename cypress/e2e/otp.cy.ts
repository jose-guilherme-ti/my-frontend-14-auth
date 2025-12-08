describe("OTP Input Component", () => {

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
            /*  cy.visit("/progresso"); */ // ajuste conforme sua rota real
        });
    });

  it("Deve aceitar apenas números e pular para o próximo input", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="nav-otp-input"]').click();
    cy.url().should("include", "/otp_input");

    cy.get('[data-testid="otp-0"]').type("1");
    cy.get('[data-testid="otp-1"]').type("2");
    cy.get('[data-testid="otp-2"]').type("3");
    cy.get('[data-testid="otp-3"]').type("4");
    cy.get('[data-testid="otp-4"]').type("5");
    cy.get('[data-testid="otp-5"]').type("6");

    cy.get('[data-testid="otp-0"]').should("have.value", "1");
    cy.get('[data-testid="otp-1"]').should("have.value", "2");
    cy.get('[data-testid="otp-2"]').should("have.value", "3");
    cy.get('[data-testid="otp-3"]').should("have.value", "4");
    cy.get('[data-testid="otp-4"]').should("have.value", "5");
    cy.get('[data-testid="otp-5"]').should("have.value", "6");
  });

  it("Não deve aceitar letras ou caracteres não numéricos", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="nav-otp-input"]').click();
    cy.url().should("include", "/otp_input");

    cy.get('[data-testid="otp-0"]').type("a");
    cy.get('[data-testid="otp-0"]').type("Z");
    cy.get('[data-testid="otp-0"]').type("-");
    cy.get('[data-testid="otp-0"]').type("@");

    cy.get('[data-testid="otp-0"]').should("have.value", ""); // continua vazio
  });

  it("Deve preencher todos inputs ao colar 6 números", () => {
    cy.visit("http://localhost:3000/");

    cy.get('[data-testid="nav-otp-input"]').click();
    cy.url().should("include", "/otp_input");
    
    cy.get('[data-testid="otp-0"]').paste("123456");

    cy.get('[data-testid="otp-0"]').should("have.value", "1");
    cy.get('[data-testid="otp-1"]').should("have.value", "2");
    cy.get('[data-testid="otp-2"]').should("have.value", "3");
    cy.get('[data-testid="otp-3"]').should("have.value", "4");
    cy.get('[data-testid="otp-4"]').should("have.value", "5");
    cy.get('[data-testid="otp-5"]').should("have.value", "6");
  });

});
