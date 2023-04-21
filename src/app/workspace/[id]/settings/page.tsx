"use client";

import Button from "@/components/Button";
import { Database } from "@/types/supabase";
import { useWorkspaceContext } from "@/util/providers/WorkspaceProvider";
import * as Form from "@radix-ui/react-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];

export default function SettingsPage({ params }: { params: { id: string } }) {
  const { workspace } = useWorkspaceContext();
  const supabase = useSupabaseClient<Database>();
  const [saving, setSaving] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState<Workspace | null>();

  useEffect(() => {
    if (workspace) {
      setNewWorkspace(workspace);
    }
  }, [workspace]);

  const updateWorkspace = async () => {
    if (newWorkspace) {
      const { error } = await supabase
        .from("workspaces")
        .update({
          ...newWorkspace,
        })
        .eq("id", newWorkspace.id);

      setSaving(false);

      if (error) {
        return Promise.reject(error);
      }
    }
  };

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Workspace Settings
          </p>
        </header>
        {/* Bot Token */}
        <div className="w-full h-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid w-full col-span-4">
              <label
                className="text-lg font-medium contrast-more:text-black"
                htmlFor="workspace-name"
              >
                Workspace Name
              </label>
              <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
                This is the name of your Arigo Workspace, changes will save
                immediately and reflect on all workspace users.
              </h2>

              {workspace && (
                <div>
                  <Form.Root
                    onSubmit={(event) => {
                      event.preventDefault();

                      setSaving(true);

                      toast.promise(updateWorkspace(), {
                        loading: "Updating workspace...",
                        success: "Workspace updated!",
                        error: "Failed to update workspace",
                      });
                    }}
                  >
                    <Form.Field className="grid mb-[10px] pt-6" name="token">
                      <div className="flex items-baseline justify-between">
                        <Form.Message
                          className="text-[13px] text-black dark:text-white opacity-[0.8]"
                          match="valueMissing"
                        >
                          Please enter a workspace name
                        </Form.Message>
                      </div>
                      <Form.Control asChild>
                        <input
                          type="text"
                          id="workspace-name"
                          className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                          required
                          aria-label="Workspace Name"
                          defaultValue={workspace.name!}
                          onChange={(e) => {
                            setNewWorkspace({
                              ...newWorkspace!,
                              name: e.target.value,
                            });
                          }}
                        />
                      </Form.Control>
                    </Form.Field>
                    <Form.Submit asChild>
                      <div className="flex items-center justify-between">
                        <Button saving={saving} aria-label="Save">
                          Save
                        </Button>
                      </div>
                    </Form.Submit>
                  </Form.Root>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
