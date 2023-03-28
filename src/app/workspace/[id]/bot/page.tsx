"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useBotSettings from "@/util/useBotSettings";
import useWorkspace from "@/util/useWorkspace";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import * as React from "react";
import { once } from "stream";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
type LogFilter = {
  user?: string;
  channel?: string;
  command?: string;
  args?: Json[]; // We won't support this yet, in the future we will
  page: number;
  perPage: 0 | 25 | 50 | 75 | 100;
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [workspace, loading] = useWorkspace(params.id);
  const user = useUser();
  const [commandLogs, setCommandLogs] = useState<
    Database["public"]["Tables"]["command_log"]["Row"][] | null
  >();
  const [logFilters, setLogFilters] = useState<LogFilter>({
    page: 0,
    perPage: 25,
  });

  const supabase = useSupabaseClient<Database>();

  // Bot Settings
  interface Data {
    created_at: string | null;
    id: string;
    prefix: string;
    region: string | null;
    token: string | null;
    workspace: string | null;
  }

  const [botSettings, setBotSettings] = useState<Data>();
  const [botSettingsFromDb, botSettingsFromDbLoading] = useBotSettings(
    "c92153c2-e353-4380-a744-7dd8ac75be90"
  );
  useEffect(() => {
    if (!botSettingsFromDbLoading) {
      setBotSettings(botSettingsFromDb);
    }
  }, [botSettingsFromDb]);

  const updateToken = async () => {
    const updateData = async () => {
      // Validate Token
      // Make a fetch request to Discord
      const res = await fetch("https://discord.com/api/v8/users/@me", {
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
            console.log("what lol", data);
            return data;
          } catch (error) {
            throw error;
          }
        }
        console.log("Response", response);
      });
    };
    toast.promise(updateData(), {
      loading: "Loading...",
      success: (returned) => {
        return `Token successfully updated`;
      },
      error:
        "There was an internal server error, please generate a new token or contact Arigo Support via the messenger",
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
              <h3 className="text-lg font-medium contrast-more:text-black">
                Bot Token
              </h3>
              <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
                Your bot token is used to authenticate your bot with Discord.
                This is how Arigo is able to provide your community with a
                powerhouse of functionality.
              </h2>

              <div>
                <Form.Root
                  onSubmit={(event) => {
                    updateToken();
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
                        className="focus:border-gray-300 dark: dark:focus:border-gray-400 h-max w-full p-2 text-sm font-normal resize-none outline-none bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none"
                        required
                        defaultValue={botSettings?.token || ""}
                        onChange={(e) => {
                          if (botSettings) {
                            const updatedBotSettings = {
                              ...botSettings,
                              token: e.target.value,
                            };
                            setBotSettings(updatedBotSettings);
                          }
                        }}
                      />
                    </Form.Control>
                  </Form.Field>
                  <Form.Submit asChild>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-white font-normal text-sm text-gray-700">
                        <Link
                          href="https://google.com"
                          className="text-blue-400 flex items-center space-x-1 gap-x-1"
                          target="_blank"
                        >
                          Learn more about bot tokens{" "}
                          <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                        </Link>
                      </p>
                      <button className="transition-colors duration-150 border hover:outline-none border-black dark:border-white ml-auto font-medium dark:text-black dark:hover:text-white dark:bg-white dark:hover:bg-opacity-0 hover:bg-opacity-0 bg-black text-white hover:text-black px-5 py-2 text-sm outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded">
                        Save
                      </button>
                    </div>
                  </Form.Submit>
                </Form.Root>
              </div>
            </div>
          </div>
        </div>

        {/* Statuses */}
        <div className="w-full h-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-lg font-medium contrast-more:text-black">
                Statuses
              </h3>
              <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
                Arigo offers extreme customization when it comes to statuses.
                You're able to add up to 5 of your own rotating statuses.
              </h2>

              <div>
                <Form.Root
                  onSubmit={(event) => {
                    updateToken();
                    event.preventDefault();
                  }}
                  className="grid"
                >
                  <Form.Field className="grid mb-[10px] pt-6" name="token">
                    <div className="flex items-baseline justify-between">
                      <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Status
                      </Form.Label>
                      <Form.Message
                        className="text-[13px] text-black dark:text-white opacity-[0.8]"
                        match="valueMissing"
                      >
                        Please enter a bot token
                      </Form.Message>
                    </div>
                    <Form.Control asChild>
                      <textarea
                        className="focus:border-gray-300 dark:focus:border-gray-400 h-max w-full p-2 text-sm font-normal resize-none outline-none bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none"
                        required
                        defaultValue={botSettings?.token || ""}
                        onChange={(e) => {
                          if (botSettings) {
                            const updatedBotSettings = {
                              ...botSettings,
                              token: e.target.value,
                            };
                            setBotSettings(updatedBotSettings);
                          }
                        }}
                      />
                    </Form.Control>
                  </Form.Field>
                  <Form.Submit asChild>
                    <div className="flex items-center justify-between">
                      <p className="dark:text-white font-normal text-sm text-gray-700">
                        <Link
                          href="https://google.com"
                          className="text-blue-400 flex items-center space-x-1 gap-x-1"
                          target="_blank"
                        >
                          Learn more about bot tokens{" "}
                          <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                        </Link>
                      </p>
                      <button className="transition-colors duration-150 border hover:outline-none border-black dark:border-white ml-auto font-medium dark:text-black dark:hover:text-white dark:bg-white dark:hover:bg-opacity-0 hover:bg-opacity-0 bg-black text-white hover:text-black px-5 py-2 text-sm outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded">
                        Save
                      </button>
                    </div>
                  </Form.Submit>
                </Form.Root>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function Time() {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <span>
      {date.toLocaleTimeString(window.navigator.language, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}
    </span>
  );
}
