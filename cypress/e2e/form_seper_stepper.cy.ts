/// <reference types="cypress" />

describe("Fluxo completo - Login + Formulário Stepper", () => {
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

    it("Deve acessar o formulário", () => {
        cy.get('[data-testid="nav-stepper"]').click();
        cy.wait(2000);
        cy.url().should("include", "http://localhost:3000/stepper");

        //cy.contains("Super Stepper Final", { timeout: 10000 }).should("exist");
    });

    it("Step 1 - Deve preencher dados pessoais", () => {
        // garante que step 1 foi montado
        cy.wait(2000);
        cy.contains("Dados pessoais", { timeout: 10000 }).should("exist");

        cy.get('input[name="name"]', { timeout: 10000 })
            .should("be.visible")
            .type("José Guilherme");
        cy.get('[data-cy="nome-paciente-input"] input').type('ana')
        cy.get('input[name="email"]').type("jose@example.com");
        cy.get('input[name="cpf"]').type("123.456.789-09");
        cy.get('input[name="phone"]').type("(11) 99999-9999");

        cy.contains("Próximo").click();
    });

    it("Step 2 - Deve preencher endereço", () => {
        //cy.contains("Endereço").should("exist");

        cy.get('input[name="cep"]').type("01001-000");

        cy.get('input[name="street"]', { timeout: 10000 })
            .should("be.visible");

        cy.get('input[name="street"]').type("Praça da Sé");
        cy.get('input[name="district"]').type("Centro");
        cy.get('input[name="city"]').type("São Paulo");

        cy.contains("Próximo").click();
    });

    it("Step 3 - Deve finalizar", () => {
        //cy.contains("Confirmação").should("exist");

        cy.get('input[name="occupation"]').type("Desenvolvedor");
        cy.get('input[name="income"]').type("4500");
        cy.get('textarea[name="description"]').type("Teste completo");

        cy.contains("Finalizar").click();

        cy.on("window:alert", (txt) => {
            expect(txt).to.contains("Finalizado");
        });

        cy.contains("Prévia do objeto final").should("exist");
    });
});
