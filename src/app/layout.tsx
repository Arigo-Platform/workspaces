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
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize Supabase client
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  const session = useSession();
  useDarkMode();
  return (
    <html lang="en" className="dark">
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
            <Toaster />
            <main>{children}</main>
          </FeatureFlagsProvider>
        </body>
      </SessionContextProvider>
    </html>
  );
}
