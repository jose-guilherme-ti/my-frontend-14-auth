"use client";

import React from "react";
import Link from "next/link";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from "@mui/icons-material/Logout";

interface NavbarProps {
  loading?: boolean;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export default function Navbar({
  loading = false,
  isLoggedIn = false,
  onLogout,
}: NavbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GraphQL Dashboard
          </Typography>

          {/* Enquanto carrega */}
          {loading ? (
            <div style={{ height: "36.5px" }}></div>
          ) : (
            <>
              {isLoggedIn && (
                <>
                <Button color="inherit" component={Link} href="/carousel" data-testid="nav-otp-carousel">
                    Carousel
                  </Button>
                <Button color="inherit" component={Link} href="/quiz" data-testid="nav-otp-quiz">
                    Quiz
                  </Button>
                <Button color="inherit" component={Link} href="/agenda" data-testid="nav-otp-agenda">
                    Agenda
                  </Button>
                 <Button color="inherit" component={Link} href="/agenda_admin" data-testid="nav-otp-agenda-admin">
                    Agenda Admin
                  </Button>
                  <Button color="inherit" component={Link} href="/otp_input" data-testid="nav-otp-input">
                    OtpInput
                  </Button>
                  <Button color="inherit" component={Link} href="/stepper" data-testid="nav-stepper">
                    Passo a Passo
                  </Button>
                  <Button color="inherit" component={Link} href="/progresso" data-testid="nav-progress">
                    Progresso
                  </Button>
                  <Button color="inherit" component={Link} href="/users">
                    Usuários
                  </Button>
                  <Button color="inherit" component={Link} href="/posts">
                    Posts
                  </Button>
                  <Button color="inherit" component={Link} href="/post_subcription">
                    Posts Sub
                  </Button>
                  <Button color="inherit" component={Link} href="/create_post">
                    Criar Post
                  </Button>

                  <IconButton color="inherit" onClick={onLogout}>
                    <LogoutIcon />
                  </IconButton>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
