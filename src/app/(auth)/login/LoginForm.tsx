"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setErrorMessage(res.error);
      return;
    }

    window.location.href = "/";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3efe7",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "18px",
            background: "#faf6f0",
            border: "3px solid transparent",
            backgroundClip: "padding-box",
            position: "relative",

            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "18px",
              padding: "3px",
              background:
                "linear-gradient(135deg, #c59b5f, #e9d7b7, #b98a46)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              pointerEvents: "none",
              transition: "0.3s ease",
            },

            "&:hover::before": {
              background:
                "linear-gradient(135deg, #eac98b, #f5e4c4, #d4a763)",
              filter: "brightness(1.1)",
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            gutterBottom
          >
            Login
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              data-testid="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              data-testid="login-password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              data-testid="login-submit"
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                height: 45,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #c59b5f, #a67c44)",
                "&:hover": {
                  background: "linear-gradient(135deg, #d6a96a, #c08d4b)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );

}
