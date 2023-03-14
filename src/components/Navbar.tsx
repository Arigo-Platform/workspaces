import { useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useUser,
  useSession,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
// import ThemeSwitcher from "./ThemeSwitcher";
import useProfile from "@/util/useProfile";

type Route = {
  name: string;
  path: string;
};

const pages: Route[] = [
  {
    name: "Workspaces",
    path: "/workspaces",
  },
];

export default function Navbar() {
  // Initialize Supabase client
  const { error, isLoading, session, supabaseClient } = useSessionContext();
  const user = useUser();
  const profile = useProfile();

  // If the user is not logged in, redirect to the login page
  useEffect(() => {
    if (!session && !isLoading && !error) {
      supabaseClient.auth.signInWithOAuth({
        provider: "discord",
      });
    }
    // Catch any potential errors
    if (error) {
      console.error(error);
    }
  }, [session, isLoading]);

  return (
    <nav className="flex flex-wrap items-center justify-between p-6 mx-auto dark:bg-black">
      <div className="flex-1">
        <img></img> {/* Logo */}
        <span className="text-gray-400">
          <svg
            fill="none"
            height="32"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            viewBox="0 0 24 24"
            width="32"
          >
            <path d="M16.88 3.549L7.12 20.451"></path>
          </svg>
        </span>
      </div>

      <div className="flex-0"></div>
    </nav>
  );
}
