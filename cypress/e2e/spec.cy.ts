describe("Navbar E2E (com login real via GraphQL)", () => {

  const loginMutation = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;

  const credentials = {
    email: "admin@example.com",
    password: "123456",
  };

  function loginViaGraphQL() {
    return cy.request({
      url: "http://localhost:4000/graphql",
      method: "POST",
      body: {
        query: loginMutation,
        variables: credentials,
      },
      failOnStatusCode: false,
    }).then((res) => {
      const token = res.body.data?.login?.token;
      expect(token).to.be.a("string");
      return token;
    });
  }

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.wait(300); // ✔ espera curta entre testes para evitar corridas
  });

  it("mostra Login quando não está logado", () => {
    cy.visit("/");
    cy.wait(500); // ✔ espera a interface estabilizar

    cy.contains("Login").should("exist");
  });

  it("faz login real e mostra menus protegidos", () => {
    loginViaGraphQL().then((token) => {
      cy.wait(500); // ✔ espera o backend responder

      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
        },
      });

      cy.wait(600); // ✔ espera para garantir render do Apollo/Header

      cy.contains("Login").should("not.exist");
      cy.contains("Usuários").should("exist");
      cy.contains("Posts").should("exist");
      cy.contains("Criar Post").should("exist");
      cy.contains("Posts Sub").should("exist");
    });
  });

  it("faz logout corretamente", () => {
    loginViaGraphQL().then((token) => {
      cy.visit("/", {
        onBeforeLoad(win) {
          win.localStorage.setItem("token", token);
        },
      });

      cy.wait(600); // ✔ garante renderização do Header

      cy.get("button").last().click(); // logout

      cy.wait(400); // ✔ espera o estado ser atualizado

      cy.window().then((win) => {
        expect(win.localStorage.getItem("token")).to.be.null;
      });

      cy.contains("Login").should("exist");
    });
  });

});
