"use client";
import * as React from "react";
import { Toaster, toast } from "sonner";
import useWorkspaces from "@/util/useWorkspaces";

export default function Home() {
  const workspaces = useWorkspaces();
  return (
    <div className="">
      <section className="p-4 space-y-6">
        <h2 className="font-bold text-5xl dark:text-white">Workspaces</h2>
        <div className="grid grid-cols-3">
          {workspaces?.map((workspace) => (
            <div className="p-4 w-full h-full max-h-32 border border-gray-200">
              <div className="bg-white rounded-md p-4">
                <div className="grid grid-cols-5 items-center space-x-2">
                  <div className="w-12 h-12 col-span-1 flex font-semibold items-center justify-center rounded-sm bg-blue-400 text-blue-50">
                    {workspace.name?.at(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 col-span-4">
                    <h3 className="font-bold text-xl">{workspace.name}</h3>
                    {workspace.created_at && (
                      <p className="text-gray-500">
                        Created{" "}
                        {new Date(workspace.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
