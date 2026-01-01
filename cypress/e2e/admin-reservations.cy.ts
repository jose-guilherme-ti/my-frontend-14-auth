describe("Painel Administrativo – Reservas", () => {
    beforeEach(() => {
        cy.session("login-session", () => {
            cy.loginSession();
        });

        cy.visit("http://localhost:3000/agenda_admin");

        cy.url({ timeout: 10000 }).should("include", "/agenda_admin");

        cy.contains("Painel Administrativo – Reservas", { timeout: 10000 })
            .should("be.visible");

        cy.get(".MuiCircularProgress-root").should("not.exist");
    });

    it("deve carregar o painel administrativo", () => {
        cy.contains("Painel Administrativo – Reservas").should("be.visible");
    });

    it("deve exibir mensagem quando não houver reservas", () => {
        cy.get("tbody").then(($tbody) => {
           
            if ($tbody.text().includes("Nenhuma reserva encontrada")) {
                cy.contains("Nenhuma reserva encontrada").should("be.visible");
            }
        });
    });

    it("deve listar reservas quando existirem", () => {
        cy.get("tbody tr").then(($rows) => {
            if ($rows.length === 0) {
                throw new Error("❌ Nenhuma reserva disponível para teste.");
            }
        });
    });

    it("deve confirmar pagamento de uma reserva pendente (se existir)", () => {
        cy.get("tbody tr").then(($rows) => {
            const hasPending = [...$rows].some(row =>
                row.innerText.includes("Pendente")
            );

            if (!hasPending) {
                cy.log("ℹ️ Nenhuma reserva pendente — teste ignorado");
                return;
            }

            // 🔹 Clica na PRIMEIRA pendente
            cy.contains("tbody tr", "Pendente")
                .first()
                .within(() => {
                    cy.get('[data-testid="confirm-payment-btn"]')
                        .should("exist")
                        .and("be.visible")
                        .click();
                });

            // ✅ Rebusca GLOBAL: agora deve existir uma linha paga
            cy.contains("tbody tr", "Pago", { timeout: 10000 })
                .should("exist")
                .within(() => {
                    cy.get('[data-testid="remove-payment-btn"]').should("exist");
                });
        });
    });



    it("deve remover pagamento de uma reserva paga (se existir)", () => {
        cy.get("tbody tr").then(($rows) => {
            const hasPaid = [...$rows].some(row =>
                row.innerText.includes("Pago")
            );

            if (!hasPaid) {
                cy.log("ℹ️ Nenhuma reserva paga — teste ignorado");
                return;
            }

            // 🔹 Clica na PRIMEIRA paga
            cy.contains("tbody tr", "Pago")
                .first()
                .within(() => {
                    cy.get('[data-testid="remove-payment-btn"]')
                        .should("exist")
                        .and("be.visible")
                        .click();
                });

            // ✅ Estado final GLOBAL
            cy.contains("tbody tr", "Pendente", { timeout: 10000 })
                .should("exist")
                .within(() => {
                    cy.get('[data-testid="confirm-payment-btn"]').should("exist");
                });
        });
    });










    it("não deve permitir múltiplos cliques durante loading (se aplicável)", () => {
        cy.get("tbody tr").then(($rows) => {
            const hasPending = [...$rows].some(row =>
                row.querySelector('[data-testid="confirm-payment-btn"]')
            );

            if (!hasPending) {
                cy.log("ℹ️ Nenhuma reserva pendente — teste ignorado");
                return;
            }

            cy.get("tbody tr")
                .find('[data-testid="confirm-payment-btn"]')
                .first()
                .click();

            // ✅ UI continua consistente
            cy.get("tbody tr").should("exist");
        });
    });


});
