"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
} from "@mui/material";
import Header from "@/components/Header";

export default function Home() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Conteúdo principal */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao GraphQL Dashboard
        </Typography>
        <Typography variant="body1">
          Use o menu acima para navegar pelas páginas.
        </Typography>
      </Box>
    </Box>

  );
}

