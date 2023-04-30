"use client";
import "tailwindcss/tailwind.css";

import FeatureFlagsProvider from "@/components/FeatureFlagsProvider";
import Navbar from "@/components/Navbar";
import { Database } from "@/types/supabase";
import { WorkspacesProvider } from "@/util/providers/WorkspacesProvider";
import useDarkMode from "@/util/useDarkMode";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  useSession,
} from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Supabase client
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  const session = useSession();
  const [theme] = useDarkMode();

  useDarkMode();
  return (
    <html lang="en" className="h-screen dark">
      <head>
        <title>Arigo Dashboard</title>
      </head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={session}
      >
        <body className="flex flex-col h-full bg-white dark:bg-blackA12">
          <Navbar />
          <FeatureFlagsProvider>
            <Toaster theme={theme === "light" ? "light" : "dark"} />
            <WorkspacesProvider>
              <main className="flex-grow h-full">{children}</main>
            </WorkspacesProvider>
          </FeatureFlagsProvider>
        </body>
      </SessionContextProvider>
    </html>
  );
}
