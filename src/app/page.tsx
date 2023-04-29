"use client";
import { Database } from "@/types/supabase";
import { useWorkspacesContext } from "@/util/providers/WorkspacesProvider";
import useRoleInWorkspace from "@/util/useRoleInWorkspace";
import useWorkspaceMemberCount from "@/util/useWorkspaceMemberCount";
import { useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];

export default function Home() {
  const { workspaces, loading } = useWorkspacesContext();
  const user = useUser();
  return (
    <div>
      <section className="p-4">
        <h1 className="pt-5 pb-2 text-4xl font-bold text-black dark:text-white animate-slideLeftAndFade">
          Welcome back, {user?.user_metadata.full_name}! 👋
        </h1>
        <h3 className="flex pb-5 text-lg text-gray-800 dark:text-gray-200 animate-slideLeftAndFade">
          The greatest glory in living lies not in never falling, but in rising
          every time we fall &bull; Nelson Mandela
        </h3>
        <h2 className="pb-2 text-3xl font-bold text-black dark:text-white animate-slideLeftAndFade">
          Your Workspaces
        </h2>
        <div>
          {!loading ? (
            workspaces ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideLeftAndFade">
                {workspaces.map((workspace) => (
                  <WorkspaceCard key={workspace.id} workspace={workspace} />
                ))}

                <Link href="/create" className="w-full h-full max-h-32">
                  <div className="p-4 transition duration-100 bg-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-100 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:shadow-none ">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold rounded-md">
                        <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold bg-green-400 rounded-md text-blue-50">
                          +
                        </div>
                      </div>
                      <div className="flex-1 col-span-4">
                        <h3 className="text-xl font-bold">
                          Create a workspace
                        </h3>
                        <p className="text-gray-500">
                          Get started with Arigo today
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 text-center animate-slideLeftAndFade">
                <h3 className="text-xl font-bold">No workspaces found</h3>
                <p>Get started with Arigo today</p>
                <Link href="/create">
                  <button className="px-4 py-2 font-semibold text-white bg-green-400 rounded-md">
                    Create a workspace
                  </button>
                </Link>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 space-y-4 text-center animate-slideLeftAndFade">
              <h3 className="text-xl font-bold">Loading workspaces...</h3>
            </div>
          )}
        </div>
        <div>
          <h2 className="pt-5 pb-2 text-3xl font-bold text-black dark:text-white animate-slideLeftAndFade">
            Recent News &#38; Updates
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideLeftAndFade">
            <Link
              href={`news.arigoapp.com/news/14772-introducing-arigo-ai---support`}
              className="w-full h-full max-h-32"
            >
              <div className="p-4 transition duration-100 bg-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-100 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:shadow-none ">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold bg-blue-400 rounded-md text-blue-50">
                    🤖
                  </div>
                  <div className="flex-1 col-span-4">
                    <h3 className="text-xl font-bold">Arigo AI</h3>
                    <p className="text-gray-500">
                      Revolutionizing community support
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const { memberCount, loading: memberCountLoading } = useWorkspaceMemberCount(
    workspace.id
  );
  const { role, loading: roleInWorkspaceLoading } = useRoleInWorkspace(
    workspace.id
  );

  return (
    <Link
      href={`/workspace/${workspace.id}`}
      className="w-full h-full max-h-32"
    >
      <div className="p-4 transition duration-100 bg-white border border-gray-600 rounded-md shadow-sm hover:bg-gray-100 dark:bg-black dark:hover:bg-zinc-900 dark:text-white dark:shadow-none ">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold rounded-md">
            {workspace.icon === null ? (
              <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold bg-blue-400 rounded-md text-blue-50">
                {workspace.name?.at(0)?.toUpperCase()}
              </div>
            ) : (
              <Image
                src={workspace.icon}
                alt="Server Icon"
                width={50}
                height={50}
                className="rounded-md"
              />
            )}
          </div>
          <div className="flex-1 col-span-4">
            <h3 className="text-xl font-bold">{workspace.name}</h3>
            {workspace.created_at && (
              <p className="text-gray-500">
                {memberCountLoading ? "..." : memberCount} Member
                {memberCount > 1 ? "s" : ""} &#183;{" "}
                {roleInWorkspaceLoading
                  ? "..."
                  : role
                  ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
                  : role}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
