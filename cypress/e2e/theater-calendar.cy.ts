describe("ChaptersProgre Page", () => {
    beforeEach(() => {
          cy.session("login-session", () => {
            cy.loginSession(); 
        });
         cy.visit("http://localhost:3000/agenda");

        cy.url({ timeout: 10000 }).should("include", "/agenda");
    });

    it("deve criar uma reserva com sucesso", () => {
        cy.contains("Agenda do Teatro").should("be.visible");

        // Captura todas as datas disponíveis (verdes)
        cy.get(".MuiPickersDay-root").then(($days) => {
            const availableDays = [...$days].filter((el) => {
                const bg = window.getComputedStyle(el).backgroundColor;

                return bg.includes("200, 230, 201"); // #c8e6c9
            });

            // ❌ Nenhuma data disponível
            if (availableDays.length === 0) {
                throw new Error(
                    "❌ Nenhuma data disponível para reserva. Teste interrompido."
                );
            }
            console.log(`✅ Datas disponíveis encontradas: ${availableDays.length}`);
            console.log(`availableDays:`, availableDays[0]);
            // ✅ Clica na primeira data disponível
            cy.wrap(availableDays[0]).click();
        });

        // Modal deve abrir
        cy.contains("Confirmar Reserva").should("be.visible");

        // Preenche formulário
        cy.get('input[name="clientName"], input')
            .eq(0)
            .type("João da Silva");

        cy.get('input[name="eventName"], input')
            .eq(1)
            .type("Peça de Teatro");

        cy.get('input[type="number"]')
            .clear()
            .type("2");
        // Envia
        cy.contains("Reservar").click();

        // Confirma feedback
        cy.contains("Reserva criada! Aguardando pagamento.")
            .should("be.visible");
    });


    it("deve abrir modal de reserva e está com campos em branco", () => {
        cy.contains("Agenda do Teatro").should("be.visible");

        // Captura todas as datas disponíveis (verdes)
        cy.get(".MuiPickersDay-root").then(($days) => {
            const availableDays = [...$days].filter((el) => {
                const bg = window.getComputedStyle(el).backgroundColor;

                return bg.includes("200, 230, 201"); // #c8e6c9
            });

            // ❌ Nenhuma data disponível
            if (availableDays.length === 0) {
                throw new Error(
                    "❌ Nenhuma data disponível para reserva. Teste interrompido."
                );
            }
            // ✅ Clica na primeira data disponível
            cy.wrap(availableDays[0]).click();
        });

        // Modal deve abrir
        cy.contains("Confirmar Reserva").should("be.visible");

        // Preenche formulário
        cy.get('input[name="clientName"], input')
            .eq(0)
            .type("João da Silva");

        cy.get('input[name="eventName"], input')
            .eq(1)
            .type("Peça de Teatro");

        cy.get('input[type="number"]')
            .clear()
            .type("2");
        // Cancelar e reseta os campos
        cy.contains("Cancelar").click();

        cy.get(".MuiPickersDay-root").then(($days) => {
            const availableDays = [...$days].filter((el) => {
                const bg = window.getComputedStyle(el).backgroundColor;

                return bg.includes("200, 230, 201"); // #c8e6c9
            });

            // ❌ Nenhuma data disponível
            if (availableDays.length === 0) {
                throw new Error(
                    "❌ Nenhuma data disponível para reserva. Teste interrompido."
                );
            }
            // ✅ Clica na primeira data disponível
            cy.wrap(availableDays[0]).click();
        });

        // Modal aberto novamente
        cy.contains("Confirmar Reserva").should("be.visible");

         // Preenche formulário
        cy.get('input[name="clientName"], input')
            .eq(0)
            .should("have.value", "");

        cy.get('input[name="eventName"], input')
            .eq(1)
            .should("have.value", "");

        cy.get('input[type="number"]')
            .clear()
            .should("have.value", "");

    });






    it("não deve permitir reservar data confirmada", () => {
        // Datas confirmadas são vermelhas
        cy.get(".MuiPickersDay-root")
            .filter((_, el) => {
                const bg = window.getComputedStyle(el).backgroundColor;
                return bg.includes("239, 154, 154"); // #ef9a9a
            })
            .first()
            .should("have.css", "cursor", "not-allowed");
    });
});
