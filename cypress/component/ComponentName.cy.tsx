import React from "react";
import { mount } from "cypress/react";
import Navbar from "@/components/Header";

// Descreve o conjunto de testes para o componente Navbar
describe("Navbar Component", () => {
  // Executa antes de cada teste individual (it)
  beforeEach(() => {
    // Garante que o localStorage esteja limpo antes de cada teste, 
    // isolando os estados de login entre eles.
    localStorage.clear();
  });

  // Teste 1: Verifica o estado inicial (deslogado)
  it("deve mostrar apenas o botão 'Login' quando NÃO estiver logado", () => {
    // Monta o componente React no ambiente de teste Cypress
    mount(<Navbar />);

    // Verifica se o botão "Login" existe e se os outros menus não existem
    cy.contains("Login").should("exist");
    cy.contains("Usuários").should("not.exist");
    cy.contains("Posts").should("not.exist");
    cy.contains("Criar Post").should("not.exist");
  });

  // Teste 2: Verifica o estado logado
  it("deve mostrar menus quando o usuário estiver logado", () => {
    // Define um token no localStorage ANTES de montar o componente
    localStorage.setItem("token", "123");

    // Monta o componente (que lerá o token no useEffect)
    mount(<Navbar />);

    // Verifica se o botão "Login" não existe e se os menus protegidos existem
    cy.contains("Login").should("not.exist");
    cy.contains("Usuários").should("exist");
    cy.contains("Posts").should("exist");
    cy.contains("Criar Post").should("exist");
    cy.contains("Posts Sub").should("exist");
  });

  // Teste 3: Testa a funcionalidade de logout
  it("deve fazer logout ao clicar no botão e remover token", () => {
    // Configura o estado inicial como logado
    localStorage.setItem("token", "123");
    mount(<Navbar />);

    // Confirma que os itens logados estão visíveis antes do clique
    cy.get("button").contains("Usuários").should("exist");

    // O botão de logout é um IconButton, o último botão da lista quando logado.
    // Clica no botão de logout.
    cy.get("button").last().click();

    // Verifica se o token foi removido do localStorage após o clique
    cy.wrap(localStorage.getItem("token")).should("be.null");

    // Verifica se a interface mudou para o estado deslogado (botão Login visível)
    cy.contains("Login").should("exist");
  });
});
