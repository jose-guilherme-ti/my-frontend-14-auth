describe("Quiz Page", () => {
  beforeEach(() => {
    cy.session("login-session", () => {
      cy.loginSession();
    });

    cy.visit("http://localhost:3000/quiz");
    cy.url({ timeout: 10000 }).should("include", "/quiz");

    // clock sempre depois do visit
    cy.clock();
  });

  it("Deve iniciar na primeira questão", () => {
    cy.contains("Pergunta 1 de 3").should("be.visible");
    cy.contains("O que é React?").should("be.visible");
  });

  it("Deve responder todas as questões corretamente", () => {
    // Q1
    cy.contains("Uma biblioteca JavaScript para UI").click();
    cy.get("video").should("exist").trigger("ended");
    cy.contains("Próxima questão").click();

    // Q2
    cy.contains("Um framework baseado em React").click();
    cy.get("video").trigger("ended");
    cy.contains("Próxima questão").click();

    // Q3
    cy.contains("Uma biblioteca de componentes React").click();
    cy.get("video").trigger("ended");
    cy.contains("Finalizar Quiz").click();

    cy.contains("Resultado Final").should("be.visible");
    cy.contains("✔️ Acertos: 3").should("be.visible");
    cy.contains("❌ Erros: 0").should("be.visible");
  });

  it("Deve expirar o tempo da questão e permitir avançar", () => {
    // estoura o tempo
    cy.tick(30_000);
    cy.then(() => {});

    // mostra feedback de erro
    cy.contains("❌ Incorreta").should("not.exist");

    // botão aparece
    cy.contains("Próxima questão").should("not.exist");

    // agora sim muda a pergunta
    cy.contains("Pergunta 2 de 3").should("not.exist");
  });


  it("Deve responder todas as questões como respostas incorretas", () => {
    // Q1
    cy.contains("Um banco de dados").click();
    cy.get("video").should("not.exist");
    cy.contains("Próxima questão").click();

    // Q2
    cy.contains("Uma linguagem de programação").click();
     cy.get("video").should("not.exist");
    cy.contains("Próxima questão").click();

    // Q3
    cy.contains("Um ORM").click();
     cy.get("video").should("not.exist");
    cy.contains("Finalizar Quiz").click();

    cy.contains("Resultado Final").should("be.visible");
    cy.contains("✔️ Acertos: 0").should("be.visible");
    cy.contains("❌ Erros: 3").should("be.visible");


    cy.contains("🧠 Feedback").should("be.visible");
    cy.contains("1. O que é React? — Incorreta ❌").should("be.visible");
    cy.contains("2. O que é Next.js? — Incorreta ❌").should("be.visible");
    cy.contains("3. O que é Material UI? — Incorreta ❌").should("be.visible");
  });

 
});
