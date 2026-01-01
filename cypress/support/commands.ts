/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// cypress/support/commands.ts

/// <reference types="cypress" />

import "cypress-localstorage-commands";

Cypress.Commands.add("login", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:3000/api/auth/callback/credentials",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: {
      email: "jose@example.com",
      password: "123123",
      redirect: false, // NECESSÁRIO NO NEXTAUTH V5
    },
    form: true,
  }).then((resp) => {
    const cookies = resp.headers["set-cookie"];
    if (!cookies) throw new Error("Nenhum cookie retornado pelo NextAuth!");

    const session = cookies.find((ck) =>
      ck.includes("authjs.session-token") ||
      ck.includes("next-auth.session-token") ||
      ck.includes("__Secure-next-auth.session-token")
    );

    if (!session) throw new Error("Cookie de sessão não encontrado.");

    const token = session.split(";")[0].split("=")[1];

    cy.setCookie(
      session.split("=")[0], // nome do cookie dinâmico
      token
    );
  });
});

Cypress.Commands.add("paste", { prevSubject: true }, (subject, text) => {
  const clipboardEvent = new Event("paste", { bubbles: true, cancelable: true });
  Object.assign(clipboardEvent, {
    clipboardData: {
      getData: () => text,
    },
  });
  subject[0].dispatchEvent(clipboardEvent);
});


Cypress.Commands.add('loginSession', (email = "admin@example.com", password = "123456") => {
    cy.session([email, password], () => {
        cy.visit("http://localhost:3000/login");

        // Preenchimento do formulário
        cy.get('[data-testid="login-email"]', { timeout: 10000 }).type(email);
        cy.get('[data-testid="login-password"]').type(password);
        cy.get('[data-testid="login-submit"]').click();

        // Validação de sucesso para garantir que a sessão foi estabelecida
        cy.url({ timeout: 10000 }).should("not.include", "/login");
        cy.contains("GraphQL Dashboard", { timeout: 10000 }).should("be.visible");
    }, {
        // Opcional: valida se a sessão ainda é válida antes de reutilizá-la
        validate() {
            cy.visit("http://localhost:3000/"); 
            cy.contains("GraphQL Dashboard").should("be.visible");
        }
    });
});

// Tipagem TS
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      paste(text: string): Chainable<Element>;
      loginSession(email?: string, password?: string): Chainable<void>;
    }
  }
}
