/* "use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#c59b5f", // cor dos seus botões
      contrastText: "#fff",
    },
    secondary: {
      main: "#a67c44",
    },
  },

  typography: {
    fontFamily: "Cinzel, Cormorant Garamond, sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 18px",
          boxShadow: "none",
          transition: "0.2s ease",

          "&:hover": {
            boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
          },
        },

        containedPrimary: {
          background:
            "linear-gradient(135deg, #c59b5f 0%, #a67c44 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #d6a96a 0%, #c08d4b 100%)",
          },
        },

        outlined: {
          borderWidth: 2,
          borderColor: "#c59b5f !important",
          "&:hover": {
            borderColor: "#a67c44 !important",
            background: "rgba(197,155,95,0.1)",
          },
        },

        text: {
          "&:hover": {
            background: "rgba(197,155,95,0.15)",
          },
        },
      },
    },
  },
});

export default theme;
 */