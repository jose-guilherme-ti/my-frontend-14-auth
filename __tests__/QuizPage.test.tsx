import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuizPage from "@/app/(protected)/quiz/page";


jest.useFakeTimers();

describe("Quiz Page", () => {
    beforeEach(() => {
        jest.clearAllTimers();
    });

    const advanceTime = (ms: number) => {
        act(() => {
            jest.advanceTimersByTime(ms);
        });
    };

    it("Deve iniciar na primeira questão", () => {
        render(<QuizPage />);

        expect(
            screen.getByText("Pergunta 1 de 3")
        ).toBeInTheDocument();

        expect(
            screen.getByText("O que é React?")
        ).toBeInTheDocument();
    });

    it("Deve responder todas as questões corretamente", () => {
        render(<QuizPage />);

        // Q1
        fireEvent.click(
            screen.getByLabelText("Uma biblioteca JavaScript para UI")
        );

        const video1 = screen.getByTestId("quiz-video");
        screen.debug(video1); // Imprime apenas o HTML da tag <video>
 
        act(() => fireEvent.ended(video1));

        fireEvent.click(screen.getByText("Próxima questão"));

        // Q2
        fireEvent.click(
            screen.getByLabelText("Um framework baseado em React")
        );

        const video2 = screen.getByTestId("quiz-video");
        act(() => fireEvent.ended(video2));

        fireEvent.click(screen.getByText("Próxima questão"));

        // Q3
        fireEvent.click(
            screen.getByLabelText("Uma biblioteca de componentes React")
        );

        const video3 = screen.getByTestId("quiz-video");
        act(() => fireEvent.ended(video3));

        fireEvent.click(screen.getByText("Finalizar Quiz"));

        expect(
            screen.getByText("Resultado Final")
        ).toBeInTheDocument();

        expect(
            screen.getByText("✔️ Acertos: 3")
        ).toBeInTheDocument();

        expect(
            screen.getByText("❌ Erros: 0")
        ).toBeInTheDocument();
    });

    it("Deve expirar o tempo da questão e permitir avançar", () => {
        render(<QuizPage />);

        advanceTime(30_000);

        // não avança automaticamente
        expect(
            screen.queryByText("Pergunta 2 de 3")
        ).not.toBeInTheDocument();

        // vídeo não aparece
        expect(
            screen.queryByTestId("quiz-video")
        ).not.toBeInTheDocument();

        // botão aparece
        expect(
            screen.getByText("Próxima questão")
        ).toBeInTheDocument();
    });

    it("Deve responder todas as questões incorretamente", () => {
        render(<QuizPage />);

        // Q1
        fireEvent.click(screen.getByLabelText("Um banco de dados"));
        fireEvent.click(screen.getByText("Próxima questão"));

        // Q2
        fireEvent.click(
            screen.getByLabelText("Uma linguagem de programação")
        );
        fireEvent.click(screen.getByText("Próxima questão"));

        // Q3
        fireEvent.click(screen.getByLabelText("Um ORM"));
        fireEvent.click(screen.getByText("Finalizar Quiz"));

        expect(
            screen.getByText("Resultado Final")
        ).toBeInTheDocument();

        expect(
            screen.getByText("✔️ Acertos: 0")
        ).toBeInTheDocument();

        expect(
            screen.getByText("❌ Erros: 3")
        ).toBeInTheDocument();

        expect(
            screen.getByText("🧠 Feedback")
        ).toBeInTheDocument();

        expect(
            screen.getByText("1. O que é React? — Incorreta ❌")
        ).toBeInTheDocument();

        expect(
            screen.getByText("2. O que é Next.js? — Incorreta ❌")
        ).toBeInTheDocument();

        expect(
            screen.getByText("3. O que é Material UI? — Incorreta ❌")
        ).toBeInTheDocument();
    });
});
