// components/MaskedInput.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import IMask from "imask";

interface MaskedFieldProps {
  name: string;
  control: any;
  label?: string;
  mask: string | any; // string ou objeto de máscara do imask
  placeholder?: string;
}

export function MaskedField({ name, control, label, mask, placeholder }: MaskedFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const inputRef = useRef<HTMLInputElement | null>(null);
        const maskRef = useRef<any>(null);

        // cria/atualiza a máscara
        useEffect(() => {
          const el = inputRef.current;
          if (!el) return;

          // se já existe, apenas atualiza options quando necessário
          if (!maskRef.current) {
            maskRef.current = IMask(el, {
              mask,
            });

            // quando máscara aceita valor, atualiza RHF
            maskRef.current.on("accept", () => {
              const v = maskRef.current.value;
              // atualiza react-hook-form
              field.onChange(v);
            });
          } else {
            // se a máscara já existe, atualiza opção (ex: trocar máscara)
            maskRef.current.updateOptions({ mask });
          }

          // sincroniza valor inicial do form para a máscara (evita sobrescrita externa)
          if (typeof field.value !== "undefined" && field.value !== null) {
            // use updateValue para sincronizar sem warnings
            try {
              maskRef.current.updateValue(field.value || "");
            } catch {
              maskRef.current.value = field.value || "";
            }
          }

          return () => {
            try {
              if (maskRef.current) {
                maskRef.current.destroy();
                maskRef.current = null;
              }
            } catch (e) {
              /* ignore */
            }
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mask]); // rebind se a máscara mudar

        // se o valor do form mudar (ex: reset), sincroniza para a máscara
        useEffect(() => {
          const m = maskRef.current;
          if (!m) return;
          const formVal = field.value ?? "";
          if (formVal !== m.value) {
            try {
              m.updateValue(formVal);
            } catch {
              m.value = formVal;
            }
          }
        }, [field.value]);

        return (
          <TextField
            label={label}
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            InputLabelProps={{ shrink: true }}
            // NÃO passar value={field.value} — deixamos o input uncontrolled para o IMask controlar o DOM
            inputRef={inputRef}
            name={name}
            placeholder={placeholder}
            // conecta blur do RHF (importante para validação onBlur)
            onBlur={() => field.onBlur()}
            // onChange não precisa propagar, IMask chamará field.onChange() no 'accept'
            // porém mantemos onInput apenas para ajudar em casos extremos (não sobrescreve o mask)
            onInput={(e) => {
              /* noop: IMask controla e atualiza RHF via 'accept' */
            }}
          />
        );
      }}
    />
  );
}

export default MaskedField;
