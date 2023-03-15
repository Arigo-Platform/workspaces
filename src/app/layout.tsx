"use client";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

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
import useDarkMode from "@/util/useDarkMode";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Supabase client
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  const user = useUser();
  const session = useSession();
  const [theme, setTheme] = useDarkMode();

  // Initialize router
  const router = useRouter();

  return (
    <html lang="en">
      <head>
        <title>Arigo Dashboard</title>
      </head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={session}
      >
        <body
          className={`${
            theme === "dark" ? "dark" : ""
          } dark:bg-blackA12 bg-white`}
        >
          <Navbar />
          <main>{children}</main>
        </body>
      </SessionContextProvider>
    </html>
  );
}
