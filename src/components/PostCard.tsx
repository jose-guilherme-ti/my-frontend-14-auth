"use client";

import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi"; // Ícone medieval representando selo
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { medievalPostCards } from "@/app/(protected)/posts/styles";

export default function PostCard({ post, highlight }: { post: any; highlight?: boolean }) {
  return (
    <Card
      sx={medievalPostCards().card}
    >
      {highlight && (
        <Chip
          icon={<SportsKabaddiIcon sx={{ color: "#4b2900" }} />}
          label="NOVO!"
          color="warning"
          sx={medievalPostCards().highlight}
        />
      )}

      <CardContent>
        <Typography
          variant="h5"
          sx={medievalPostCards().header}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body1"
          sx={medievalPostCards().content}
        >
          {post.content}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <AccountCircleIcon sx={{ color: "#4b2900", mr: 1 }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 600,
              color: "#4b2900",
            }}
          >
            {post.author?.name}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 600,
            color: post.published ? "#0b5c18" : "#7a0000",
          }}
        >
          {post.published ? "✔ Publicado" : "❌ Não publicado"}
        </Typography>
      </CardContent>
    </Card>
  );
}
