"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useDiscordServer from "@/util/useDiscordServer";
import useWorkspace from "@/util/useWorkspace";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useBotSettings from "@/util/useBotSettings";
import * as Form from "@radix-ui/react-form";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowTopRightOnSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowPathIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronUpDownIcon,
  CommandLineIcon,
  HashtagIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import type { APIChannel } from "discord-api-types/v10";

export default function CommandLog({ params }: { params: { id: string } }) {
  const supabase = useSupabaseClient<Database>();

  const { botSettings, loading: botSettingsLoading } = useBotSettings(
    "c92153c2-e353-4380-a744-7dd8ac75be90"
  );
  // Suggestion Channel
  const [suggestionChannel, setSuggestionChannel] =
    useState<
      Database["public"]["Tables"]["bots"]["Row"]["suggestions_channel"]
    >();

  const [channels, setChannels] = useState<APIChannel[]>();

  useEffect(() => {
    if (botSettings) {
      setSuggestionChannel(botSettings.suggestions_channel);

      const getChannels = async () => {
        const c = await fetch(`/api/discord/guilds/${params.id}/channels`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bot ${botSettings.token}`,
          },
        }).then((res) => res.json());

        setChannels(c);
      };

      getChannels();
    }
  }, [botSettings]);

  useEffect(() => {}, []);

  const updateChannel = async ({ value }: { value: any }) => {
    console.log("Value Upon Update", value);
    setSuggestionChannel(value);
    const updateData = async () => {
      try {
        const { data, error } = await supabase
          .from("bots")
          .update({ suggestions_channel: value })
          .eq("id", "c92153c2-e353-4380-a744-7dd8ac75be90")
          .select();
        return data;
      } catch (error) {
        throw error;
      }
    };
    toast.promise(updateData(), {
      loading: "Loading...",
      success: (returned) => {
        return `Suggestion Channel successfully updated`;
      },
      error:
        "There was an internal server error, please try again or contact Arigo Support via the messenger",
    });
  };
  const [newBotSettings, setNewBotSettings] =
    useState<Database["public"]["Tables"]["bots"]["Row"]>();

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Bot Settings
          </p>
        </header>
        {/* Suggestions Channel */}
        <div className="w-full h-full min-w-full col-span-5 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none">
          <div className="flex items-center justify-between min-w-full space-x-4">
            <div className="grid min-w-full col-span-4">
              <h3 className="min-w-full text-lg font-medium contrast-more:text-black">
                Suggestions Channel
              </h3>
              <h2 className="mt-1 text-sm font-normal contrast-more:text-black">
                The provided channel is where all new suggestions are sent.
              </h2>

              <div>
                <Listbox
                  value={suggestionChannel}
                  onChange={(value) => updateChannel(value as any)}
                >
                  <div className="relative col-span-6">
                    <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {botSettings?.suggestions_channel !== null
                          ? botSettings?.suggestions_channel
                          : "Select channel"}
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
                        {/* {uniqueCommands.map((cmd, cmdIdx) => ( */}
                        <Listbox.Option
                          // key={cmdIdx}
                          key="0"
                          className={({ active, selected }) =>
                            `text-center relative cursor-default select-none rounded-md dark:text-white py-2 pl-10 pr-4 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                              active
                                ? "bg-zinc-700 text-white"
                                : "text-gray-900"
                            } ${
                              selected
                                ? "bg-zinc-900 text-white font-bold"
                                : "font-normal"
                            }`
                          }
                          // value={cmd.command_name}
                          value="lol"
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {/* {cmd.command_name} */}
                                lol
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
                        {/* ))} */}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <div className="flex items-center justify-between pt-6">
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
