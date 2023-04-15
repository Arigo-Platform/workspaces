"use client";
import { Database, Json } from "@/types/supabase";
import useBotSettings from "@/util/useBotSettings";
import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

import ListboxSkeletonLoader from "@/components/ListboxSkeletonLoader";
import { useWorkspaceContext } from "@/util/providers/WorkspaceProvider";
import { CheckIcon } from "@radix-ui/react-icons";
import type { APIChannel, APIRole } from "discord-api-types/v10";
import { toast } from "sonner";

export default function CommandLog({ params }: { params: { id: string } }) {
  const supabase = useSupabaseClient<Database>();
  const {
    botSettings,
    loading: botSettingsLoading,
    refresh,
  } = useBotSettings(params.id);

  const { workspace, loading: workspaceLoading } = useWorkspaceContext();

  const [newBotSettings, setNewBotSettings] =
    useState<Database["public"]["Tables"]["bots"]["Row"]>();

  const [channels, setChannels] = useState<APIChannel[]>();

  const [roles, setRoles] = useState<APIRole[]>();

  const getChannels = async () => {
    if (!workspace || !botSettings) return;
    console.log("Huh", {
      hi: workspace.guild_id,
      hu: botSettings.token,
    });
    const c = await fetch(
      `/api/discord/guilds/${workspace.guild_id}/channels`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${botSettings.token}`,
        },
      }
    ).then((res) => res.json());

    const filtered = c.filter((channel: APIChannel) => {
      return channel.type === 0;
    });

    setChannels(filtered);
  };

  const getRoles = async () => {
    if (!workspace || !botSettings) return;
    const c: APIRole[] = await fetch(
      `/api/discord/guilds/${workspace.guild_id}/roles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${botSettings.token}`,
        },
      }
    ).then((res) => res.json());

    const filtered = c
      .filter((role) => {
        return role.name !== "@everyone";
      })
      .sort((a, b) => {
        return b.position - a.position;
      });

    setRoles(filtered);
  };

  useEffect(() => {
    if (botSettings && workspace) {
      setNewBotSettings(botSettings);

      getChannels();
      getRoles();
    }
  }, [botSettings, workspace]);

  // Suggestions Channel
  const updateChannel = async (value: string | null) => {
    if (newBotSettings) {
      setNewBotSettings({
        ...newBotSettings,
        suggestions_channel: value,
      });

      toast.promise(
        async () => {
          try {
            await supabase
              .from("bots")
              .update({ suggestions_channel: value })
              .eq("id", newBotSettings.id);
          } catch (error) {
            throw error;
          }
        },
        {
          loading: "Saving...",
          success: "Channel updated!",
          error:
            "An error occurred, please try again or contact Arigo Support via the messenger",
        }
      );
    }
  };

  // Suggestions Emoji
  const updateEmoji = async (value: string | null) => {
    if (newBotSettings) {
      setNewBotSettings({
        ...newBotSettings,
        suggestions_emoji: value,
      });

      toast.promise(
        async () => {
          try {
            await supabase
              .from("bots")
              .update({ suggestions_emoji: value })
              .eq("id", newBotSettings.id);
          } catch (error) {
            throw error;
          }
        },
        {
          loading: "Saving...",
          success: "Emoji updated!",
          error:
            "An error occurred, please try again or contact Arigo Support via the messenger",
        }
      );
    }
  };

  const updateModifyRoles = async (value: Json[] | null) => {
    if (newBotSettings) {
      setNewBotSettings({
        ...newBotSettings,
        suggestion_modify_roles: value,
      });
      toast.promise(
        async () => {
          try {
            await supabase
              .from("bots")
              .update({
                suggestion_modify_roles: value,
              })
              .eq("id", newBotSettings.id);
          } catch (error) {
            throw error;
          }
        },
        {
          loading: "Saving...",
          success: "Roles updated!",
          error:
            "An error occurred, please try again or contact Arigo Support via the messenger",
        }
      );
    }
  };

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Suggestions Suite
          </p>
        </header>
        {/* Suggestions Channel */}
        <div className="w-full h-full min-w-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between min-w-full space-x-4">
            <div className="grid min-w-full col-span-4">
              <h3 className="min-w-full text-lg font-medium contrast-more:text-black">
                Suggestions Channel
              </h3>
              <h2 className="pr-4 mt-1 text-sm font-normal contrast-more:text-black">
                The provided channel is where all new suggestions are sent.
              </h2>

              <div className="mt-3">
                {channels ? (
                  <Listbox
                    value={newBotSettings?.suggestions_channel}
                    onChange={(value) => updateChannel(value as string)}
                  >
                    <div className="relative col-span-6">
                      <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {newBotSettings?.suggestions_channel ? (
                            channels.find(
                              (channel) =>
                                channel.id ===
                                newBotSettings?.suggestions_channel
                            )?.name
                          ) : (
                            <span className="text-gray-400">
                              Select a channel
                            </span>
                          )}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-50 grid w-full grid-cols-2 gap-0 px-1 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:bg-black dark:text-white dark:border dark:border-gray-600 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {channels.map((channel, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active, selected }) =>
                                `text-center relative cursor-default select-none rounded-md dark:text-white py-2 px-10 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                                  active
                                    ? "bg-zinc-700 text-white"
                                    : "text-gray-900"
                                } ${
                                  selected
                                    ? "bg-zinc-900 text-white font-bold"
                                    : "font-normal"
                                }`
                              }
                              value={channel.id}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {channel.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800 dark:text-gray-200">
                                      <CheckIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                ) : (
                  // skeleton loader
                  <ListboxSkeletonLoader />
                )}
                <div className="flex items-center justify-between pt-3">
                  <p className="text-sm font-normal text-gray-700 dark:text-white">
                    <Link
                      href="https://google.com"
                      className="flex items-center space-x-1 text-blue-400 gap-x-1"
                      target="_blank"
                    >
                      Learn more about the suggestion channel{" "}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Emoji */}
        <div className="flex items-center w-full h-full min-w-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between min-w-full space-x-4">
            <div className="grid min-w-full col-span-4">
              <h3 className="min-w-full text-lg font-medium contrast-more:text-black">
                Suggestions Emoji
              </h3>
              <h2 className="pr-4 mt-1 text-sm font-normal contrast-more:text-black">
                The selected emoji will be added to new suggestions.
              </h2>

              <div className="mt-3">
                {channels && (
                  <RadioGroup.Root
                    className="flex gap-10"
                    defaultValue={botSettings?.suggestions_emoji ?? undefined}
                    aria-label="Select emoji"
                    onValueChange={(value) => updateEmoji(value)}
                  >
                    {/* 1 */}
                    <div className="flex items-center">
                      <RadioGroup.Item
                        className="bg-white border border-gray-600 shadow-sm dark:bg-black dark:text-white dark:shadow-none w-[25px] h-[25px] rounded-full dark:hover:bg-zinc-700 hover:bg-gray-200 focus:ring-1 ring-blue-500 outline-none cursor-default"
                        value="1"
                        id="1"
                        tabIndex={0}
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-gray-400" />
                      </RadioGroup.Item>
                      <label
                        className="text-white text-[15px] leading-none pl-[15px]"
                        htmlFor="1"
                      >
                        👍 🤷 👎
                      </label>
                    </div>
                    {/* 2 */}
                    <div className="flex items-center">
                      <RadioGroup.Item
                        className="bg-white border border-gray-600 shadow-sm dark:bg-black dark:text-white dark:shadow-none w-[25px] h-[25px] rounded-full dark:hover:bg-zinc-700 hover:bg-gray-200 focus:ring-1 ring-blue-500 outline-none cursor-default"
                        value="2"
                        id="2"
                        tabIndex={1}
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-gray-400" />
                      </RadioGroup.Item>
                      <label
                        className="text-white text-[15px] leading-none pl-[15px]"
                        htmlFor="2"
                      >
                        👍 👎
                      </label>
                    </div>
                    {/* 3 */}
                    <div className="flex items-center">
                      <RadioGroup.Item
                        className="bg-white border border-gray-600 shadow-sm dark:bg-black dark:text-white dark:shadow-none w-[25px] h-[25px] rounded-full dark:hover:bg-zinc-700 hover:bg-gray-200 focus:ring-1 ring-blue-500 outline-none cursor-default"
                        value="3"
                        id="3"
                        tabIndex={2}
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-gray-400" />
                      </RadioGroup.Item>
                      <label
                        className="text-white text-[15px] leading-none pl-[15px]"
                        htmlFor="3"
                      >
                        ✅ ❌
                      </label>
                    </div>
                    {/* 4 */}
                    <div className="flex items-center">
                      <RadioGroup.Item
                        className="bg-white border border-gray-600 shadow-sm dark:bg-black dark:text-white dark:shadow-none w-[25px] h-[25px] rounded-full dark:hover:bg-zinc-700 hover:bg-gray-200 focus:ring-1 ring-blue-500 outline-none cursor-default"
                        value="4"
                        id="4"
                        tabIndex={3}
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-gray-400" />
                      </RadioGroup.Item>
                      <label
                        className="text-white text-[15px] leading-none pl-[15px]"
                        htmlFor="4"
                      >
                        ⬆️ ⬇️
                      </label>
                    </div>
                  </RadioGroup.Root>
                )}
                <div className="flex items-center justify-between pt-3">
                  <p className="text-sm font-normal text-gray-700 dark:text-white">
                    <Link
                      href="https://google.com"
                      className="flex items-center space-x-1 text-blue-400 gap-x-1"
                      target="_blank"
                    >
                      Learn more about the suggestion channel{" "}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions Modify Role */}
        <div className="flex items-center w-full h-full min-w-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between min-w-full space-x-4">
            <div className="grid min-w-full col-span-4">
              <h3 className="min-w-full text-lg font-medium contrast-more:text-black">
                Suggestions Modify Role
              </h3>
              <h2 className="pr-4 mt-1 text-sm font-normal contrast-more:text-black">
                Users with this role can modify the status and comment of
                suggestions.
              </h2>

              <div className="mt-3">
                {roles &&
                newBotSettings &&
                newBotSettings.suggestion_modify_roles ? (
                  <Listbox
                    value={newBotSettings.suggestion_modify_roles}
                    onChange={(value) => updateModifyRoles(value)}
                    multiple
                  >
                    <div className="relative col-span-6">
                      <Listbox.Button className="relative w-full px-10 py-2 pl-3 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {newBotSettings.suggestion_modify_roles &&
                          newBotSettings.suggestion_modify_roles.length > 0
                            ? roles
                                .filter((role) => {
                                  return newBotSettings.suggestion_modify_roles?.includes(
                                    role.id
                                  );
                                })
                                .map((role) => role.name)
                                .join(", ")
                            : "Select roles"}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-50 grid w-full grid-cols-2 gap-0 px-1 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg dark:bg-black dark:text-white dark:border dark:border-gray-600 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {roles.map((role, index) => (
                            <Listbox.Option
                              key={role.id}
                              className={({ active, selected }) =>
                                `text-center relative cursor-default select-none rounded-md dark:text-white py-2 px-10 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                                  active
                                    ? "bg-zinc-700 text-white"
                                    : "text-gray-900"
                                } ${
                                  selected
                                    ? "bg-zinc-900 text-white font-bold"
                                    : "font-normal"
                                }`
                              }
                              value={role.id}
                              id={role.id}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-medium" : "font-normal"
                                    }`}
                                  >
                                    {role.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800 dark:text-gray-200">
                                      <CheckIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                ) : (
                  <ListboxSkeletonLoader />
                )}
                <div className="flex items-center justify-between pt-3">
                  <p className="text-sm font-normal text-gray-700 dark:text-white">
                    <Link
                      href="https://google.com"
                      className="flex items-center space-x-1 text-blue-400 gap-x-1"
                      target="_blank"
                    >
                      Learn more about the suggestion channel{" "}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
