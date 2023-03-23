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
import WorkspaceSelector from "./WorkspaceSelector";
import UserMenu from "./UserMenu";
import DarkModeSwitch from "./DarkModeSwitch";
import useFeatureFlags from "@/util/useFeatureFlags";

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
  const featureFlags = useFeatureFlags();

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
    <nav className="flex flex-wrap items-center justify-between p-6 mx-auto dark:bg-black bg-slate-100">
      <div className="flex items-center flex-1 space-x-2">
        <Link href="/">
          <span className="px-2 text-xl font-bold text-black dark:text-white">
            A
          </span>
        </Link>
      </div>

      <div className="flex space-x-4 flex-0">
        <UserMenu />
      </div>
    </nav>
  );
}
