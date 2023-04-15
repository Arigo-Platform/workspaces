"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useBotSettings from "@/util/useBotSettings";
import useWorkspace from "@/util/useWorkspace";
import {
  SupabaseClient,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import * as React from "react";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/Button";
type LogFilter = {
  user?: string;
  channel?: string;
  command?: string;
  args?: Json[]; // We won't support this yet, in the future we will
  page: number;
  perPage: 0 | 25 | 50 | 75 | 100;
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const supabase = useSupabaseClient<Database>();

  const [newBotSettings, setNewBotSettings] =
    useState<Database["public"]["Tables"]["bots"]["Row"]>();
  const { botSettings, loading: botSettingsLoading } = useBotSettings(
    params.id
  );

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (botSettings) {
      setNewBotSettings(botSettings);
    }
  }, [botSettings]);

  const updateData = async () => {
    setSaving(true);
    // Validate Token
    // Make a fetch request to Discord
    await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bot ${botSettings?.token}`,
      },
    }).then(async (response) => {
      if (response.status === 401) {
        return Promise.reject();
      }
      if (response.status === 200) {
        // Success
        try {
          const { data, error } = await supabase
            .from("bots")
            .update({ token: botSettings?.token })
            .eq("id", "c92153c2-e353-4380-a744-7dd8ac75be90")
            .select();

          if (error) {
            throw error;
          }

          setSaving(false);
          return data;
        } catch (error) {
          throw error;
        }
      }
    });
  };

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Bot Settings
          </p>
        </header>
        {/* Bot Token */}
        <div className="w-full h-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <label
                className="text-lg font-medium contrast-more:text-black"
                htmlFor="token"
              >
                Bot Token
              </label>
              <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
                Your bot token is used to authenticate your bot with Discord.
                This is how Arigo is able to provide your community with a
                powerhouse of functionality.
              </h2>

              <div>
                <Form.Root
                  onSubmit={(event) => {
                    toast.promise(updateData(), {
                      loading: "Loading...",
                      success: "Token updated!",
                      error:
                        "There was an error updating your bot token. Please try again later.",
                    });
                    event.preventDefault();
                  }}
                >
                  <Form.Field className="grid mb-[10px] pt-6" name="token">
                    <div className="flex items-baseline justify-between">
                      <Form.Message
                        className="text-[13px] text-black dark:text-white opacity-[0.8]"
                        match="valueMissing"
                      >
                        Please enter a bot token
                      </Form.Message>
                    </div>
                    <Form.Control asChild>
                      <textarea
                        className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                        required
                        defaultValue={botSettings?.token || ""}
                        id="token"
                        name="token"
                        aria-label="Bot Token"
                        onChange={(e) => {
                          if (botSettings) {
                            const updatedBotSettings = {
                              ...botSettings,
                              token: e.target.value,
                            };
                            setNewBotSettings(updatedBotSettings);
                          }
                        }}
                      />
                    </Form.Control>
                  </Form.Field>
                  <Form.Submit asChild>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-normal text-gray-700 dark:text-white">
                        <Link
                          href="https://google.com"
                          className="flex items-center space-x-1 text-blue-400 gap-x-1"
                          target="_blank"
                        >
                          Learn more about bot tokens{" "}
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </Link>
                      </p>
                      <Button saving={saving} aria-label="Save Button">
                        Save
                      </Button>
                    </div>
                  </Form.Submit>
                </Form.Root>
              </div>
            </div>
          </div>
        </div>

        {/* Statuses */}
        {newBotSettings && (
          <Statuses
            newBotSettings={newBotSettings}
            setNewBotSettings={setNewBotSettings}
            supabase={supabase}
          />
        )}
      </section>
    </section>
  );
}

type Status = { type: number; name: string };

function Statuses({
  newBotSettings,
  setNewBotSettings,
  supabase,
}: {
  newBotSettings: Database["public"]["Tables"]["bots"]["Row"];
  setNewBotSettings: (
    botSettings: Database["public"]["Tables"]["bots"]["Row"]
  ) => void;
  supabase: SupabaseClient<Database>;
}) {
  const [newStatus, setNewStatus] = useState<Status>({
    type: 0,
    name: "",
  });

  // Force rerender
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [change, setChange] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <div className="w-full h-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
      <div className="flex items-center justify-between space-x-4">
        <div className="grid col-span-4">
          <h3 className="text-lg font-medium contrast-more:text-black">
            Statuses
          </h3>
          <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
            Arigo offers extreme customization when it comes to statuses. You're
            able to add up to 5 of your own rotating statuses.
          </h2>

          <div>
            <Form.Root
              onSubmit={(event) => {
                event.preventDefault();

                toast.promise(
                  new Promise(async (res, rej) => {
                    setSaving(true);
                    const { error } = await supabase
                      .from("bots")
                      .update(newBotSettings)
                      .eq("id", newBotSettings.id);

                    setSaving(false);

                    if (error) {
                      rej(error);
                      return;
                    }

                    res(true);
                  }),
                  {
                    success: "Statuses updated!",
                    loading: "Saving changes...",
                    error(error) {
                      return `Error saving changes: ${error}`;
                    },
                  }
                );
                setChange(false);
              }}
              className="grid items-end grid-cols-7 gap-2"
            >
              <Form.Field className="grid col-span-2 pt-2" name="type">
                <div className="flex items-baseline justify-between">
                  <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                    Type
                  </Form.Label>
                </div>
                <Form.Control asChild>
                  <select
                    className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                    defaultValue={0}
                    // value={newStatus.type} -- Doesn't properly update values
                    onChange={(e) => {
                      setNewStatus({
                        ...newStatus,
                        type: parseInt(e.target.value),
                      });
                    }}
                  >
                    <option value={0}>Playing</option>
                    <option value={1}>Streaming</option>
                    <option value={2}>Listening to</option>
                    <option value={3}>Watching</option>
                    <option value={5}>Competing in</option>
                  </select>
                </Form.Control>
              </Form.Field>

              <Form.Field className="grid col-span-4 pt-2" name="status">
                <div className="flex items-baseline justify-between">
                  <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                    Status
                  </Form.Label>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    className="w-full p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                    placeholder="with Arigo!"
                    value={newStatus.name}
                    onChange={(e) => {
                      setNewStatus({
                        ...newStatus,
                        name: e.target.value,
                      });
                    }}
                  />
                </Form.Control>
              </Form.Field>

              <Button
                aria-label="Add Status Button"
                onClick={() => {
                  // Validate Status
                  if (
                    newStatus.name === undefined ||
                    "" ||
                    newStatus.name.replace(/\s/g, "").length === 0
                  ) {
                    // No text provided
                    return toast.error("Please enter a status");
                  }
                  if (newBotSettings) {
                    const updatedBotSettings = {
                      ...newBotSettings,
                      statuses: [
                        ...(newBotSettings.statuses || []),
                        {
                          type: newStatus.type,
                          name: newStatus.name,
                        },
                      ],
                    };

                    setNewBotSettings(updatedBotSettings);
                    setNewStatus({
                      name: "",
                      type: 0,
                    });
                    setChange(true);
                  }
                }}
                disabled={(newBotSettings?.statuses || []).length >= 5}
                className="w-full h-min transition-colors duration-150 border disabled:opacity-75 disabled:cursor-not-allowed dark:hover:disabled:text-black dark:hover:disabled:bg-white hover:outline-none border-black dark:border-white ml-auto font-medium dark:text-black dark:hover:text-white dark:bg-white dark:hover:bg-opacity-0 hover:bg-opacity-0 bg-black text-white hover:text-black px-5 py-2 text-sm outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded"
              >
                Add
              </Button>

              <div className="col-span-full">
                <div className="grid gap-2 mt-4">
                  {(newBotSettings?.statuses || []).map((status, index) => (
                    <div
                      key={index}
                      className="grid items-center grid-cols-7 gap-2"
                    >
                      <select
                        className="w-full col-span-2 p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                        required
                        defaultValue={(status as unknown as Status).type}
                        onChange={(e) => {
                          let statuses = newBotSettings.statuses!;

                          (statuses[index] as unknown as Status).type =
                            parseInt(e.target.value);

                          setNewBotSettings({
                            ...newBotSettings,
                            statuses,
                          });
                          setChange(true);
                        }}
                      >
                        <option value={0}>Playing</option>
                        <option value={1}>Streaming</option>
                        <option value={2}>Listening to</option>
                        <option value={3}>Watching</option>
                        <option value={5}>Competing in</option>
                      </select>

                      <input
                        type="text"
                        className="w-full col-span-4 p-2 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none focus:border-gray-300 dark:focus:border-gray-400 h-max dark:bg-black dark:text-white dark:shadow-none"
                        required
                        defaultValue={(status as unknown as Status).name}
                        onChange={(e) => {
                          let statuses = newBotSettings.statuses!;

                          (statuses[index] as unknown as Status).name =
                            e.target.value;

                          setNewBotSettings({
                            ...newBotSettings,
                            statuses,
                          });
                          setChange(true);
                        }}
                      />

                      {/* icon button to remove */}
                      <button
                        onClick={() => {
                          if (newBotSettings) {
                            let temp = newBotSettings;

                            temp.statuses!.splice(index, 1);
                            setNewBotSettings(temp);
                            forceUpdate();
                            setChange(true);
                          }
                        }}
                        className="flex p-2 transition-colors duration-150 rounded-md w-min h-min dark:hover:bg-slate-900 "
                      >
                        <TrashIcon className="w-5 h-5 dark:text-slate-200 text-slate-800" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Form.Submit asChild className="flex justify-between">
                <div className="flex items-center justify-between col-span-full">
                  <p className="flex text-sm font-normal text-gray-700 dark:text-white">
                    {" "}
                    <Link
                      href="https://google.com"
                      className="flex items-center space-x-1 text-blue-400 gap-x-1"
                      target="_blank"
                    >
                      Learn more about statuses
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                    &nbsp;
                    {change === true ? (
                      <p className="flex items-center justify-between text-sm italic font-normal">
                        &#183; Changes not saved
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </p>
                  <Button saving={saving} aria-label="Save Button">
                    Save
                  </Button>{" "}
                </div>
              </Form.Submit>
            </Form.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
