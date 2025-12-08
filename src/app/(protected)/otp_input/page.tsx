"use client";

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

type InputProps = {
  variant?: "primary" | "secondary";
  backgroundColor?: string;
  size: 'sm' | 'md' | 'lg';
};

export default function OtpInput({ variant = "primary", backgroundColor, size = 'md' }: InputProps) {
  const inputLength = 6;
  const [values, setValues] = useState(Array(inputLength).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value.slice(-1);

      if (value && index < inputLength - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      return newValues;
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasted.length === inputLength) {
      setValues(pasted.split("").slice(0, inputLength));
      inputsRef.current[inputLength - 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // NOVO — Estilos mais bonitos
  const baseStyle: CSSProperties = {
    textAlign: "center",
    fontSize: "1.8rem",
    width: "70px",
    height: "80px",
    borderRadius: "14px",
    fontWeight: "600",
    transition: "all .25s ease",
  };

  const variantStyles: Record<Required<InputProps>["variant"], CSSProperties> = {
    primary: {
      backgroundColor: "#FFF8E1",
      border: "2px solid #FFC107",
    },
    secondary: {
      backgroundColor: "#ECECEC",
      border: "2px solid #9E9E9E",
    },
  };
  const sizeStyles: Record<Required<InputProps>['size'], CSSProperties> = {
    sm: {
      padding: '0.5rem',
    },
    md: {
      padding: '0.75rem',
    },
    lg: {
      padding: '1rem',
    }
  };

  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        mt: 6,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {values.map((val, index) => (
        <TextField
          key={index}
          value={val}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          inputRef={(el) => (inputsRef.current[index] = el)}
          variant="outlined"
          InputProps={{
            sx: {
              /* ".MuiOutlinedInput-root":{
                position: "unset",
              }, */
              "& input": {
                ...baseStyle,
                ...variantStyles[variant],
                ...sizeStyles[size],
                backgroundColor: backgroundColor || variantStyles[variant].backgroundColor,
                boxShadow: val ? "0 0 12px rgba(255, 193, 7, 0.4)" : "none",
              },

              "& input:focus": {
                borderColor: "#FF9800 !important",
                boxShadow: "0 0 14px rgba(255, 152, 0, 0.6)",
                transform: "scale(1.05)",
              },
              "& fieldset": {
                border: "none", // remove borda
              },
              "&:hover fieldset": {
                border: "none", // remove borda no hover
              },
              "&.Mui-focused fieldset": {
                border: "none", // remove borda no focus
              },
            },
          }}
          inputProps={{
            "data-testid": `otp-${index}`,
            maxLength: 1,
          }}
        />
      ))}
    </Box>
  );
}
