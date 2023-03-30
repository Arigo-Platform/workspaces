import { useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  useUser,
  useSession,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import Link from "next/link";
// import ThemeSwitcher from "./ThemeSwitcher";
import useAccount from "@/util/useAccount";
import WorkspaceSelector from "./WorkspaceSelector";
import UserMenu from "./UserMenu";
import DarkModeSwitch from "./DarkModeSwitch";
import useFeatureFlags from "@/util/useFeatureFlags";
import { usePathname } from "next/navigation";
import useWorkspace from "@/util/useWorkspace";

type Breadcrumb = {
  name: string;
  href: string;
};

export default function Navbar() {
  // Initialize Supabase client
  const { error, isLoading, session, supabaseClient } = useSessionContext();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  const pathname = usePathname();

  const featureFlags = useFeatureFlags();

  const isWorkspace = pathname.split("/")[1] === "workspace";
  const { workspace, loading } = useWorkspace(
    isWorkspace ? pathname.split("/")[2] : ""
  );

  // If the user is not logged in, redirect to the login page
  useEffect(() => {
    if (!session && !isLoading && !error) {
      supabaseClient.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE,
        },
      });
    }
    // Catch any potential errors
    if (error) {
      console.error(error);
    }
  }, [session, isLoading]);

  useEffect(() => {
    if (pathname) {
      const path = pathname.split("/").filter((p) => p);

      // remove first two elements
      path.shift();
      path.shift();

      setBreadcrumbs(
        path.map((p, index) => ({
          name: p
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
          href: `/${path.slice(0, index + 1).join("/")}`,
        }))
      );
    }
  }, [pathname]);

  return (
    <nav className="flex flex-wrap items-center justify-between p-6 mx-auto dark:bg-black bg-slate-100">
      <div className="flex items-center flex-1 space-x-2">
        <Link href="/">
          <span className="px-2 text-xl font-bold text-black dark:text-white">
            A
          </span>
        </Link>

        {isWorkspace && workspace && (
          <>
            <svg
              fill="none"
              className="hidden w-6 h-6 text-black dark:text-white md:block"
              height="32"
              shapeRendering="geometricPrecision"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              viewBox="0 0 24 24"
              width="32"
            >
              <path d="M16.88 3.549L7.12 20.451"></path>
            </svg>

            {featureFlags && featureFlags.NAVBAR_WORKSPACE_SELECTOR ? (
              <WorkspaceSelector />
            ) : (
              <Link
                href={`/workspace/${workspace.id}`}
                className="hidden md:block animate-slideRightAndFade"
              >
                <p className="font-semibold dark:text-white">
                  {workspace?.name || "Workspace"}
                </p>
              </Link>
            )}

            {breadcrumbs.length > 0 &&
              breadcrumbs.map((breadcrumb, index) => (
                <>
                  <svg
                    fill="none"
                    className="hidden w-6 h-6 text-black dark:text-white md:block"
                    height="32"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    width="32"
                  >
                    <path d="M16.88 3.549L7.12 20.451"></path>
                  </svg>

                  <Link
                    href={`/workspace/${workspace.id}${breadcrumb.href}`}
                    className="hidden md:block animate-slideRightAndFade"
                  >
                    <p className="font-semibold capitalize dark:text-white">
                      {breadcrumb.name}
                    </p>
                  </Link>
                </>
              ))}
          </>
        )}
      </div>

      <div className="flex space-x-4 flex-0">
        <UserMenu />
      </div>
    </nav>
  );
}
