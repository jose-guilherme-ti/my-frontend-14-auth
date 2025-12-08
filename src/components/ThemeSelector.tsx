"use client";

import { useThemeSwitcher } from "@/contexts/ThemeContext";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export function ThemeSelector() {
  const { themeName, setThemeName, themes } = useThemeSwitcher();

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel>Tema</InputLabel>
        <Select
          value={themeName}
          label="Tema"
          onChange={(e) => setThemeName(e.target.value as any)}
          data-cy="theme-select"
        >
          {themes.map((t) => (
            <MenuItem key={t} value={t}>
              {t.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
