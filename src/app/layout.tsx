"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  Session,
  useUser,
  useSession,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Database } from "@/types/supabase";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Supabase client
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  const user = useUser();
  const session = useSession();

  // Initialize router
  const router = useRouter();

  // Dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#844ae0",
          },
          secondary: {
            main: "#f50057",
          },
          background: {
            default: mode === "dark" ? "#0e0e18" : "#f5f5f5",
            paper: mode === "dark" ? "#1d203b" : "#ffffff",
          },
        },
        typography: {
          button: {
            textTransform: "none",
          },
        },
        shape: {
          borderRadius: 12,
        },
        spacing: (factor: number) => `${0.25 * factor}rem`,
      }),
    [mode]
  );

  return (
    <html lang="en">
      <head>
        <title>Arigo Dashboard</title>
      </head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={session}
      >
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <body>
              <Navbar />
              <main>{children}</main>
            </body>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </SessionContextProvider>
    </html>
  );
}
