"use client";
import useWorkspace from "@/util/useWorkspace";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { workspace, loading } = useWorkspace(params.id);
  const pathname = usePathname();
  return (
    <section id="bot">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-6 md:grid-cols-8">
        <header className="p-6 border-b py-7 col-span-full border-zinc-200 dark:border-zinc-700">
          <h1 className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Settings
          </h1>
          {/* <p className="text-1xl dark:text-white animate-slideRightAndFade">
            Manage everything related to your custom bot in one place.
          </p> */}
        </header>

        <aside
          id="sidebar"
          className="flex flex-col w-full col-span-2 px-6 space-y-2 dark:text-white"
        >
          <Link
            href={`/workspace/${workspace?.id}/settings`}
            className={`w-full px-3 py-2 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200 ${
              pathname === `/workspace/${workspace?.id}/settings` &&
              "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            General
          </Link>

          <Link
            href={`/workspace/${workspace?.id}/settings/permissions`}
            className={`w-full px-3 py-2 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200 ${
              pathname === `/workspace/${workspace?.id}/settings/permissions` &&
              "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            Permissions
          </Link>

          <Link
            href={`/workspace/${workspace?.id}/settings/billing`}
            className={`w-full px-3 py-2 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200 ${
              pathname === `/workspace/${workspace?.id}/settings/billing` &&
              "bg-zinc-200 dark:bg-zinc-700"
            }`}
          >
            Billing
          </Link>
        </aside>

        <section className="col-span-6 pr-4">{children}</section>
      </section>
    </section>
  );
}
