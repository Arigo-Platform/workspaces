"use client";
import * as React from "react";
import { Toaster, toast } from "sonner";
import useWorkspaces from "@/util/useWorkspaces";
import Link from "next/link";

export default function Home() {
  const workspaces = useWorkspaces();
  return (
    <div>
      <section className="p-4 space-y-6">
        <h2 className="text-5xl font-bold dark:text-white text-blackA12 animate-slideLeftAndFade">
          Workspaces
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-slideLeftAndFade">
          {workspaces?.map((workspace) => (
            <Link
              href={`/workspace/${workspace.id}`}
              className="w-full h-full max-h-32"
            >
              <div className="p-4 transition duration-100 bg-white border rounded-md shadow-md hover:bg-gray-100 dark:bg-blackA8 dark:hover:bg-blackA9 dark:text-white dark:shadow-none dark:border-none">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold bg-blue-400 rounded-md text-blue-50">
                    {workspace.name?.at(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 col-span-4">
                    <h3 className="text-xl font-bold">{workspace.name}</h3>
                    {workspace.created_at && (
                      <p className="text-gray-500">
                        Created{" "}
                        {new Date(workspace.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <Link href="/create" className="w-full h-full max-h-32">
            <div className="p-4 transition duration-100 bg-white border rounded-md shadow-md hover:bg-gray-100 dark:bg-blackA8 dark:hover:bg-blackA9 dark:text-white dark:shadow-none dark:border-none">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center justify-center w-12 h-12 col-span-1 font-semibold bg-green-400 rounded-md text-green-50">
                  +
                </div>
                <div className="flex-1 col-span-4">
                  <h3 className="text-xl font-bold">Create a new workspace</h3>
                  <p className="text-gray-500">
                    Create a new workspace to get started
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
