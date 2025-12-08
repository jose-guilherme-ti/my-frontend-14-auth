import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import ChaptersProgre from "@/app/(protected)/progresso/page";

// Função para mockar comportamento real de scroll
function mockScroll(element: HTMLElement, total: number, visible: number, scrollTop: number) {
    Object.defineProperty(element, "scrollHeight", {
        configurable: true,
        value: total,
    });

    Object.defineProperty(element, "clientHeight", {
        configurable: true,
        value: visible,
    });

    Object.defineProperty(element, "scrollTop", {
        configurable: true,
        writable: true,
        value: scrollTop,
    });
}

describe("ChaptersProgre — Jest + RTL (adaptado para o componente real)", () => {
    beforeEach(() => {
        render(<ChaptersProgre />);
    });

    // ========================================================
    // 1. Renderização inicial
    // ========================================================
    test("Renderiza Capítulo 1 corretamente", () => {
        const titulo = screen.getByTestId("titulo-direito-1");
        expect(titulo).toHaveTextContent("Capítulo 1 – Introdução");

        expect(screen.getByText("0%")).toBeInTheDocument();
    });

    // ========================================================
    // 2. Atualiza progresso no scroll
    // ========================================================
    test("Atualiza progresso ao fazer scroll no capítulo 1", () => {
        const scrollArea = screen.getByTestId("chapter-text-1");

        // Mock das dimensões
        mockScroll(scrollArea, 2000, 1000, 0);

        // Início: 0%
        expect(screen.getByText("0%")).toBeInTheDocument();

        // 50%
        act(() => {
            scrollArea.scrollTop = 1000;
            fireEvent.scroll(scrollArea);
        });

        const pct2 = screen.getByTestId("progress-active").parentElement!.nextSibling!;
        expect(pct2.textContent).not.toBe("0%");

        // 100%
        act(() => {
            scrollArea.scrollTop = 2000;
            fireEvent.scroll(scrollArea);
        });

        expect(screen.getByText("100%")).toBeInTheDocument();

        // Icone de capítulo concluído
        expect(screen.getByTestId("progress-active")).toBeInTheDocument();
    });

    // ========================================================
    // 3. Capítulo 2 desbloqueia após capítulo 1 = 100%
    // ========================================================
    test("Desbloqueia capítulo 2 após capítulo 1 chegar a 100%", () => {
        const scrollArea = screen.getByTestId("chapter-text-1");

        mockScroll(scrollArea, 2000, 1000, 2000);

        act(() => fireEvent.scroll(scrollArea));

        const cap2Btn = screen.getByTestId("button-capitulo-2");

        expect(cap2Btn).toHaveAttribute("data-disabled", "false");
    });

    // ========================================================
    // 4. Clique no capítulo 2 funciona
    // ========================================================
    test("Ao clicar no capítulo 2 desbloqueado, muda para o conteúdo correto", () => {
        const scrollArea = screen.getByTestId("chapter-text-1");

        mockScroll(scrollArea, 2000, 1000, 2000);

        act(() => fireEvent.scroll(scrollArea)); // Completa cap 1

        const cap2Btn = screen.getByTestId("button-capitulo-2");

        fireEvent.click(cap2Btn);

        const titulo2 = screen.getByTestId("titulo-direito-2");
        expect(titulo2).toHaveTextContent("Capítulo 2 – Fundamentos");
    });

    // ========================================================
    // 5. Scroll também funciona no capítulo 2
    // ========================================================
    test("Atualiza progresso ao fazer scroll no capítulo 2", () => {
        const scrollArea1 = screen.getByTestId("chapter-text-1");

        // Mock para completar capítulo 1
        mockScroll(scrollArea1, 2000, 1000, 2000);
        act(() => fireEvent.scroll(scrollArea1));

        // Clica no capítulo 2
        fireEvent.click(screen.getByTestId("button-capitulo-2"));

        const scrollArea2 = screen.getByTestId("chapter-text-2");

        // Inicial: 0%
        expect(screen.getByText("0%")).toBeInTheDocument();

        // Scroll 50%
        mockScroll(scrollArea2, 1500, 1000, 500);
        act(() => fireEvent.scroll(scrollArea2));

        const pct2 = screen.getByTestId("progress-active").parentElement!.nextSibling!;
        expect(pct2.textContent).not.toBe("0%");

        // Scroll total
        mockScroll(scrollArea2, 1500, 1000, 1500);
        act(() => fireEvent.scroll(scrollArea2));

        expect(screen.getByText("100%")).toBeInTheDocument();
    });
});
