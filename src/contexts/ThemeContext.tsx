"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const themeList  = {
  medieval: createTheme({
    palette: {
      primary: {
        main: "#8b6a3e", // dourado marrom
      },
      secondary: {
        main: "#ffd700", // ouro
      },
      warning: {
        main: "#ffcb4c",
      },
      background: {
        default: "#f7e7c3",
        paper: "#f3d9a3",
      },
      text: {
        primary: "#4b2900",
        secondary: "#3b2604",
      },
    },

    typography: {
      fontFamily: "'Cormorant Garamond', serif",
      h1: { fontFamily: "'Cinzel', serif", fontWeight: 700, color: "#4b2900" },
      h2: { fontFamily: "'Cinzel', serif", fontWeight: 700, color: "#4b2900" },
      h3: { fontFamily: "'Cinzel', serif", fontWeight: 700, color: "#4b2900" },
      button: {
        fontFamily: "'Cinzel', serif",
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: "linear-gradient(145deg, #f7e7c3, #d9c89a)",
            border: "3px solid #8b6a3e",
            borderRadius: "12px",
            boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "12px",
            border: "2px solid #4b2900",
            background: "linear-gradient(180deg, #ffd56e, #e6b65a)",
            color: "#4b2900",
            boxShadow: "0 3px 5px rgba(0,0,0,0.4)",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(180deg, #ffe08e, #efc46b)",
              boxShadow: "0 4px 7px rgba(0,0,0,0.6)",
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            borderRadius: "8px",
          },
        },
      },
    },
  }),
  dark: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#90caf9" },
      secondary: { main: "#ce93d8" },
    },
  }),

  ocean: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#0077b6" },
      secondary: { main: "#0096c7" },
      background: { default: "#caf0f8" },
    },
  }),
  forest: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#2d6a4f" },
      secondary: { main: "#40916c" },
      background: { default: "#d8f3dc" },
    },
  }),

  midnight: createTheme({
    palette: {
      mode: "dark",
      primary: { main: "#5a189a" },
      secondary: { main: "#9d4edd" },
      background: { default: "#10002b" },
    },
  }),
  light: createTheme({
    palette: {
      mode: "light",
      primary: { main: "#1976d2" },
      secondary: { main: "#9c27b0" },
    },
  }),

};


type ThemeKey = keyof typeof themeList;

interface ThemeContextType {
  themeName: ThemeKey;
  setThemeName: (name: ThemeKey) => void;
  themes: ThemeKey[];
}

const ThemeContext = createContext<ThemeContextType>({
  themeName: "light",
  setThemeName: () => {},
  themes: Object.keys(themeList) as ThemeKey[],
});

export const useThemeSwitcher = () => useContext(ThemeContext);

export function ThemeSwitcherProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeKey>("light");

  // Carrega tema salvo
  useEffect(() => {
    const saved = localStorage.getItem("APP_THEME");
    if (saved && saved in themeList) {
      setThemeName(saved as ThemeKey);
    }
  }, []);

  // Salva sempre que mudar
  useEffect(() => {
    localStorage.setItem("APP_THEME", themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider
      value={{
        themeName,
        setThemeName,
        themes: Object.keys(themeList) as ThemeKey[],
      }}
    >
      <ThemeProvider theme={themeList[themeName]}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}