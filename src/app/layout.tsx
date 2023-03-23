"use client";
import "tailwindcss/tailwind.css";

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
import useFeatureFlags from "@/util/useFeatureFlags";
import FeatureFlagsProvider from "@/components/FeatureFlagsProvider";

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

  return (
    <html lang="en">
      <head>
        <title>Arigo Dashboard</title>
      </head>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={session}
      >
        <body className="bg-white dark:bg-blackA12">
          <Navbar />
          <FeatureFlagsProvider>
            <main>{children}</main>
          </FeatureFlagsProvider>
        </body>
      </SessionContextProvider>
    </html>
  );
}
