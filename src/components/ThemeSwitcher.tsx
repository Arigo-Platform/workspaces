"use client";
import { useTheme } from "@emotion/react";
import { IconButton } from "@mui/material";
import { createContext, useContext } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "@/app/layout";

export default function ThemeSwitcher() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={colorMode.toggleColorMode}
      color="inherit"
    >
      {theme ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
