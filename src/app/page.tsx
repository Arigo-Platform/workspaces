"use client";
import useWorkspaces from "@/util/useWorkspaces";
import Link from "next/link";
import Image from "next/image";
import { Database } from "@/types/supabase";
import useWorkspaceMemberCount from "@/util/useWorkspaceMemberCount";
import useRoleInWorkspace from "@/util/useRoleInWorkspace";

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];

export default function Home() {
  const workspaces = useWorkspaces();
  return (
    <div>
      <section className="p-4 space-y-6">
        <h2 className="text-3xl font-bold dark:text-white text-black animate-slideLeftAndFade">
          Workspaces
        </h2>
        <h3 className="text-lg dark:text-white text-black animate-slideLeftAndFade">
          "The greatest glory in living lies not in never falling, but in rising
          every time we fall." - Nelson Mandela
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideLeftAndFade">
          {workspaces?.map((workspace) => (
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
                  <h3 className="text-xl font-bold">Create a workspace</h3>
                  <p>Get started with Arigo today</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  const [memberCount, memberCountLoading] = useWorkspaceMemberCount(
    workspace.id
  );
  const [roleInWorkspace, roleInWorkspaceLoading] = useRoleInWorkspace(
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
                  : roleInWorkspace
                  ? roleInWorkspace.charAt(0).toUpperCase() +
                    roleInWorkspace.slice(1).toLowerCase()
                  : roleInWorkspace}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
