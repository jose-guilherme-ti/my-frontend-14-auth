describe("ChaptersProgre Page", () => {
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

    /*  it("Deve acessar o progresso", () => {
         cy.visit("http://localhost:3000/");
         cy.get('[data-testid="nav-progress"]').click();
         cy.wait(2000);
         cy.url().should("include", "http://localhost:3000/progresso");
 
         //cy.contains("Super Stepper Final", { timeout: 10000 }).should("exist");
     });
 
     it("Renderiza corretamente e exibe os capítulos", () => {
         cy.visit("http://localhost:3000/");
         cy.get('[data-testid="nav-progress"]').click();
         cy.wait(2000);
         cy.contains("Capítulo 1 – Introdução").should("exist");
         cy.contains("Capítulo 2 – Fundamentos").should("exist");
         cy.contains("Capítulo 3 – Conceitos Avançados").should("exist");
     });
 
     it("Capítulo 1 está desbloqueado e capítulos 2 e 3 estão bloqueados", () => {
         cy.visit("http://localhost:3000/");
         cy.get('[data-testid="nav-progress"]').click();
         cy.wait(2000);
         cy.contains("Capítulo 1 – Introdução")
             .parent()
             .should("have.css", "opacity", "1");
 
         cy.contains("Capítulo 2 – Fundamentos")
             .parent()
             .should("have.css", "opacity", "0.4");
 
         cy.contains("Capítulo 3 – Conceitos Avançados")
             .parent()
             .should("have.css", "opacity", "0.4");
     });
 
     it("Permite clicar no capítulo 1, mas não nos bloqueados", () => {
         // Deve conseguir clicar no capítulo 1
         cy.visit("http://localhost:3000/");
         cy.get('[data-testid="nav-progress"]').click();
         cy.wait(2000);
         cy.contains("Capítulo 1 – Introdução").click();
 
         // Não deve mudar para capítulo 2 porque está bloqueado
         cy.contains("Capítulo 2 – Fundamentos").click();
         cy.contains("Capítulo 2 – Fundamentos").should("not.have.css", "font-weight", "700");
     });
  */
    it("Atualiza progresso ao fazer scroll", () => {
        cy.visit("http://localhost:3000/");
        cy.get('[data-testid="nav-progress"]').click();
        cy.wait(2000);
        // Encontra o painel de scroll visível no capítulo 1
        // Seleciona o painel atual do capítulo (overflow-y: auto)

         cy.get('[data-cy="titulo-direito-1"]').as("tituloDireito1");

        cy.get("@tituloDireito1").should("contain.text", "Capítulo 1 – Introdução");

        cy.get("@tituloDireito1").should("exist");


        cy.contains("0%").should("exist");

        cy.get('[data-testid="MenuBookIcon"]').should("be.visible")

        cy.get('[data-cy="body-scroll"]')
            .first()
            .as("scrollArea");

        // Confirma que progresso inicial é 0%
        cy.contains("0%").should("exist");
        cy.wait(1000);
        // Faz scroll para 50%
        cy.get("@scrollArea").scrollTo("0%", "50%", { duration: 1000});
        cy.wait(1000);
        // O progresso deve estar entre 40% e 60%
        cy.contains(/4\d%|5\d%/).should("exist");

        // Agora scroll total
        cy.get("@scrollArea").scrollTo("bottom", { duration: 1000 });

        // Progresso deve ser 100%
        cy.contains("100%").should("exist");

        cy.get('[data-testid="CheckCircleIcon"]').should("be.visible")
        cy.wait(1000);
        cy.get("@scrollArea").scrollTo("100%", "50%", { easing: 'linear', duration: 1000 })
        
        cy.contains("50%").should("exist");

        cy.get("@scrollArea").scrollTo("50%", "0%", { easing: 'linear', duration: 1000 })

        cy.contains("0%").should("exist");

        cy.get("@scrollArea").scrollTo("bottom", { duration: 1000 });
        
        cy.get('[data-cy="button-capitulo-2"]').click();

        cy.get('[data-cy="titulo-direito-2"]').as("tituloDireito2");

        cy.get("@tituloDireito2").should("contain.text", "Capítulo 2 – Fundamentos");

        cy.get("@tituloDireito2").should("exist");




        // Confirma que progresso inicial é 0%
        cy.contains("0%").should("exist");
        cy.wait(1000);
        // Faz scroll para 50%
        cy.get("@scrollArea").scrollTo("0%", "50%", { duration: 1000});
        cy.wait(1000);
        // O progresso deve estar entre 40% e 60%
        cy.contains(/4\d%|5\d%/).should("exist");

        // Agora scroll total
        cy.get("@scrollArea").scrollTo("bottom", { duration: 1000 });

        // Progresso deve ser 100%
        cy.contains("100%").should("exist");

        cy.get('[data-testid="CheckCircleIcon"]').should("be.visible")
        cy.wait(1000);
        cy.get("@scrollArea").scrollTo("100%", "50%", { easing: 'linear', duration: 1000 })
        
        cy.contains("50%").should("exist");

        cy.get("@scrollArea").scrollTo("50%", "0%", { easing: 'linear', duration: 1000 })

        cy.contains("0%").should("exist");

    });

    /*   it("Ao chegar 100% do capítulo 1, capítulo 2 desbloqueia", () => {
          cy.visit("http://localhost:3000/");
          cy.get('[data-testid="nav-progress"]').click();
          cy.wait(2000);
          cy.get("[style*='overflow-y: auto']").first().scrollTo("bottom");
  
          // Aguarde o update do React
          cy.wait(200);
  
          cy.contains("Capítulo 2 – Fundamentos")
              .parent()
              .should("have.css", "opacity", "1");
      });
  
      it("Capítulo 2 só pode ser acessado após o capítulo 1 estar completo", () => {
          cy.visit("http://localhost:3000/");
          cy.get('[data-testid="nav-progress"]').click();
          cy.wait(2000);
          cy.contains("Capítulo 2 – Fundamentos")
              .parent()
              .should("have.css", "opacity", "0.4");
  
          cy.get("[style*='overflow-y: auto']").first().scrollTo("bottom");
  
          cy.wait(200);
  
          // Agora desbloqueado
          cy.contains("Capítulo 2 – Fundamentos")
              .parent()
              .should("have.css", "opacity", "1");
  
          // Agora pode clicar
          cy.contains("Capítulo 2 – Fundamentos").click();
  
          cy.get("[style*='overflow-y: auto']")
              .first()
              .find("h4")
              .should("contain.text", "Capítulo 2 – Fundamentos");
      }); */
});
