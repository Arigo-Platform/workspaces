"use client";

import { WorkspaceProvider } from "@/util/providers/WorkspaceProvider";
import useWorkspace from "@/util/useWorkspace";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const { workspace, loading } = useWorkspace(params.id);

  const routes = [
    {
      path: "",
      title: "Dashboard",
    },
    {
      path: "bot",
      title: "Bot",
    },
    {
      path: "settings",
      title: "Settings",
    },
    // {
    //   path: "moderation",
    //   title: "Moderation",
    // },
    // {
    //   path: "utility",
    //   title: "Utility",
    // },
    // {
    //   path: "suggestions",
    //   title: "Suggestions",
    // },
  ];

  const isRouteSelected = (path: string) => {
    const p = pathname.split("/");
    if (path === "") {
      return p[p.length - 1] === params.id;
    }
    return p[p.length - 1] === path || p.includes(path);
  };

  return (
    <div>
      {/* Removed overflow-x-scroll to prevent weird white space */}
      <nav className="flex w-full px-6 pt-2 bg-slate-100 dark:bg-black delay-[5ms]">
        {routes.map((route) => (
          <Link
            href={`/workspace/${params.id}/${route.path}`}
            key={route.path}
            className={`${
              isRouteSelected(route.path)
                ? "before:block before:absolute before:h-0 before:left-2 before:right-2 before:bottom-0 before:border-b-2 befordark:border-white border-black dark:text-white font-bold"
                : "dark:text-slate-400 font-medium"
            } pb-4 relative inline-block text-sm `}
          >
            <span className="px-4 py-2 transition-colors duration-150 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-white">
              {route.title}
            </span>
          </Link>
        ))}
      </nav>
      <WorkspaceProvider workspace={workspace} loading={loading}>
        <div>{children}</div>
      </WorkspaceProvider>
    </div>
  );
}
