"use client";
import useWorkspace from "@/util/useWorkspace";
import Link from "next/link";

export default function BotLayout({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const [workspace, loading] = useWorkspace(params.id);
  return (
    <section id="bot">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-6 md:grid-cols-8">
        <header className="p-6 py-12 border-b col-span-full border-zinc-200 dark:border-zinc-700">
          <h1 className="text-2xl font-bold dark:text-white animate-slideRightAndFade">
            Arigo Bot Settings
          </h1>
          <p className="font-medium text-1xl dark:text-white animate-slideRightAndFade">
            Manage all the setings for your custom bot, right here.
          </p>
        </header>

        {workspace && (
          <>
            <aside
              id="sidebar"
              className="flex flex-col w-full col-span-2 px-6 space-y-2 font-medium dark:text-white"
            >
              <Link
                href={`/workspace/${workspace.id}/bot`}
                className="w-full px-3 py-2 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200"
              >
                General
              </Link>

              <Link
                href={`/workspace/${workspace.id}/bot/command-log`}
                className="w-full px-3 py-2 rounded-md dark:hover:bg-zinc-700 hover:bg-zinc-200"
              >
                Command Log
              </Link>
            </aside>

            <section className="col-span-6">{children}</section>
          </>
        )}
      </section>
    </section>
  );
}
