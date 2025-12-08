import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import OtpInput from "@/app/(protected)/otp_input/page";

describe("OTP Input Component", () => {
  // ======== MOCKS NECESSÁRIOS ========
  beforeAll(() => {
    class MockDataTransfer {
      data: Record<string, string> = {};

      getData(type: string) {
        return this.data[type];
      }

      setData(type: string, value: string) {
        this.data[type] = value;
      }
    }

    // @ts-ignore
    global.DataTransfer = MockDataTransfer;

    class MockClipboardEvent extends Event {
      clipboardData: MockDataTransfer;

      constructor(type: string, init: any) {
        super(type, init);
        this.clipboardData = init.clipboardData;
      }
    }

    // @ts-ignore
    global.ClipboardEvent = MockClipboardEvent;
  });

  const getInputs = (container: HTMLElement) => {
    return Array.from({ length: 6 }).map((_, i) =>
      container.querySelector(`[data-testid="otp-${i}"]`) as HTMLInputElement
    );
  };

  // ================================
  // TESTE 1 — DIGITAÇÃO COM NÚMEROS
  // ================================
  test("Deve aceitar apenas números e pular para o próximo input", () => {
    const { container } = render(<OtpInput />);
    
    const inputs = getInputs(container);

    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });

    expect(inputs[0].value).toBe("1");
    expect(inputs[1].value).toBe("2");
  });

  // ================================
  // TESTE 2 — NÃO ACEITAR LETRAS
  // ================================
  test("Não deve aceitar letras", () => {
    const { container } = render(<OtpInput />);
    const inputs = getInputs(container);

    fireEvent.change(inputs[0], { target: { value: "a" } });

    expect(inputs[0].value).toBe("");
  });

  // =============================================
  // TESTE 3 — COLAR 6 DÍGITOS (CORREÇÃO COMPLETA)
  // =============================================
  test("Deve preencher os 6 inputs ao colar sequência numérica", () => {
    const { container } = render(<OtpInput />);
    const inputs = getInputs(container);

    const dt = new DataTransfer();
    dt.setData("text", "123456");

    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    });

    // MUI exige que eventos que alteram estado sejam chamados dentro de act()
    act(() => {
      inputs[0].dispatchEvent(pasteEvent);
    });

    // ASSERTS
    expect(inputs[0].value).toBe("1");
    expect(inputs[1].value).toBe("2");
    expect(inputs[2].value).toBe("3");
    expect(inputs[3].value).toBe("4");
    expect(inputs[4].value).toBe("5");
    expect(inputs[5].value).toBe("6");
  });
});
