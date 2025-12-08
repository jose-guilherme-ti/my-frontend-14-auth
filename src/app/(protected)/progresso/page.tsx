"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Fade,
  useTheme,
  LinearProgress,
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import LockIcon from "@mui/icons-material/Lock";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const sections = [
  {
    id: 1,
    title: "Capítulo 1 – Introdução",
    text: Array(160)
      .fill(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aliquet magna et pulvinar suscipit. Curabitur volutpat porttitor lorem, a facilisis est aliquet sed."
      )
      .join(" "),
  },
  {
    id: 2,
    title: "Capítulo 2 – Fundamentos",
    text: Array(160)
      .fill(
        "Vivamus iaculis libero ac orci maximus, ut sodales risus tempor. Phasellus in elementum leo, nec pharetra lorem. Fusce et odio nec massa facilisis consequat."
      )
      .join(" "),
  },
  {
    id: 3,
    title: "Capítulo 3 – Conceitos Avançados",
    text: Array(160)
      .fill(
        "Morbi eget nulla nec sapien luctus tempor a nec mauris. Integer non magna nec massa fermentum fermentum. Sed auctor arcu non massa interdum volutpat."
      )
      .join(" "),
  },
];

export default function ChaptersProgre() {
  const theme = useTheme();
  const [activeSection, setActiveSection] = useState(1);

  const [progress, setProgress] = useState<any>({
    1: 0,
    2: 0,
    3: 0,
  });

  const rightPanelRef = useRef<HTMLDivElement | any>(null);

  // Atualizar progresso baseado no scroll real
  useEffect(() => {
    const el = rightPanelRef.current;
    if (!el) return;

    function handleScroll() {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const ratio = el.scrollTop / maxScroll;
      const percentage = Math.min(100, Math.round(ratio * 100));

      setProgress((prev: any) => ({
        ...prev,
        [activeSection]: percentage,
      }));
    }

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // regras de desbloqueio
  const unlocked = {
    1: true,
    2: progress[1] === 100,
    3: progress[1] === 100 && progress[2] === 100,
  } as any;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg,#1f1f1f,#333)"
            : "linear-gradient(135deg,#fafafa,#ddd)",
      }}
    >
      {/* --- MENU LATERAL ESQUERDO --- */}
      <Box
        sx={{
          width: { xs: 100, md: 190 },
          p: 2,
          borderRight: "1px solid rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        {sections.map((s) => {
          const isLocked = !unlocked[s.id];
          const isActive = activeSection === s.id;
          const value = progress[s.id];

          return (
            <Box
              key={s.id}
              className={isActive ? "active" : ""}             // ✔ agora tem active
              sx={{
                cursor: isLocked ? "not-allowed" : "pointer",
                opacity: isLocked ? 0.4 : 1,
                textAlign: "center",
              }}
              onClick={() => !isLocked && setActiveSection(s.id)}
              data-testid={`button-capitulo-${s.id}`}
              data-cy={`button-capitulo-${s.id}`}
              data-disabled={isLocked ? "true" : "false"}
            >
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={value}
                  size={85}
                  thickness={2}
                  color={value === 100 ? "success" : "primary"}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isLocked ? (
                    <LockIcon sx={{ fontSize: 36 }} />
                  ) : value === 100 ? (
                    <CheckCircleIcon color="success" sx={{ fontSize: 36 }} />
                  ) : (
                    <MenuBookIcon sx={{ fontSize: 36 }} />
                  )}
                </Box>
              </Box>

              <Typography
                variant="body2"
                fontWeight={isActive ? "bold" : "normal"}
                mt={1}
              >
                {s.title}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* --- CONTEÚDO DA DIREITA --- */}
      <Box sx={{ flex: 1, p: 3 }}>
        <Card
          sx={{
            height: "100%",
            borderRadius: 3,
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            overflow: "hidden",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CardContent
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {/* Barra de progresso horizontal */}
            <Box sx={{ width: "100%", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: "100%", mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress[activeSection]}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                    data-testid="progress-active"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`${Math.round(progress[activeSection])}%`}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {sections.map((sec) => {
              const visible = activeSection === sec.id;

              return (
                <Fade in={visible} mountOnEnter unmountOnExit key={sec.id}>
                  <Box
                    ref={visible ? rightPanelRef : null}
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      pr: 2,
                    }}
                    data-testid={`chapter-text-${sec.id}`} // ✔ AGORA O TESTE ENCONTRA
                    data-cy="body-scroll" 
                  >
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      mb={2}
                      data-testid={`titulo-direito-${sec.id}`}
                      data-cy={`titulo-direito-${sec.id}`}
                    >
                      {sec.title}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{ lineHeight: 1.6 }}
                      data-testid={`texto-secao-${sec.id}`}
                    >
                      {sec.text}
                    </Typography>
                  </Box>
                </Fade>
              );
            })}

          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
