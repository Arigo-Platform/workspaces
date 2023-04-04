"use client";
import { Database, Json } from "@/types/supabase";
import { Fragment, useEffect, useState } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import {
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
} from "@radix-ui/react-icons";

import Moment from "react-moment";
import Tooltip from "@/components/Tooltip";
import { getPagination } from "@/util/pagination";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Listbox, Transition } from "@headlessui/react";

type CommandType = Database["public"]["Tables"]["command_log"]["Row"];
type LogFilter = {
  user?: string;
  channel?: string;
  commands?: string[];
  args?: Json[]; // We won't support this yet, in the future we will
  page: number;
  perPage: 0 | 25 | 50 | 75 | 100;
};

export default function RealtimeCommands() {
  const supabase = useSupabaseClient<Database>();
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [uniqueCommands, setUniqueCommands] = useState<
    Database["public"]["Views"]["unique_commands"]["Row"][]
  >([]);

  const [filter, setFilter] = useState<LogFilter>({
    page: 0,
    perPage: 25,
  });

  async function getData() {
    const { from, to } = getPagination(filter.page, filter.perPage);
    let query = supabase.from("command_log").select();

    if (filter.user) {
      query = query.eq("user_id", filter.user);
    }

    if (filter.channel) {
      query = query.eq("channel_id", filter.channel);
    }

    if (filter.commands && filter.commands.length > 0) {
      query = query.in("command_name", filter.commands);
    }

    if (filter.args && filter.args.length > 0) {
      query = query.in("args", filter.args);
    }

    query = query.order("executed_at", { ascending: false }).range(from, to);

    const { data, error } = await query;

    if (error) {
      return;
    }

    setCommands(data);
  }

  async function getCommandList() {
    const { data, error } = await supabase.from("unique_commands").select();

    if (error) {
      return;
    }

    setUniqueCommands(data);
  }

  useEffect(() => {
    getData();
    getCommandList();
  }, []);

  // debounce the filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 250);

    return () => {
      clearTimeout(timeout);
    };
  }, [filter]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-commands")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "command_log",
        },
        (payload) => {
          setCommands((prev) => [(payload as any).new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  return (
    <div className="grid grid-cols-1 gap-4">
      <Filter
        filter={filter}
        setFilter={setFilter}
        uniqueCommands={uniqueCommands}
      />
      {commands &&
        commands.map((command) => (
          <div className="relative flex flex-row flex-wrap items-stretch justify-between max-w-full p-6 text-4xl bg-white border border-gray-600 rounded-md shadow-sm dark:shadow-none gap-x-4 dark:bg-blackA8 dark:text-white">
            <div className="grid w-full max-w-lg grid-cols-3 gap-x-4">
              <h3 className="flex items-center text-sm font-medium gap-x-1">
                <CommandLineIcon className="w-4 h-4" />
                {command?.command_name}
              </h3>

              <div>
                <Tooltip content={command.user_id}>
                  <h3 className="grid items-center justify-start w-full grid-cols-6 text-sm font-medium gap-x-1 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                    <span className="col-span-5 truncate">
                      {command.username}
                    </span>
                  </h3>
                </Tooltip>
                <Tooltip
                  content={new Date(command.executed_at).toLocaleString()}
                >
                  <h3 className="grid items-center grid-cols-6 text-sm font-medium gap-x-1 text-slate-400">
                    <CalendarIcon className="w-4 h-4" />
                    <Moment
                      fromNow
                      date={command.executed_at}
                      className="col-span-5"
                    />
                  </h3>
                </Tooltip>
              </div>

              <Tooltip content={command.channel_id}>
                <h3 className="flex items-center text-sm font-medium gap-x-1 text-slate-400">
                  <HashtagIcon className="w-4 h-4" />
                  {command.channel_name}
                </h3>
              </Tooltip>
            </div>
            <Dropdown username={command.username} />
          </div>
        ))}
      <div>
        <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
        <div className="flex items-center">
          <p className="text-sm text-white">Rows per page:</p>
          <div>
            {/* Rows Per Page */}
            <div className="px-1 rounded-md outline-none hover:bg-gray-200 dark:hover:bg-black">
              <select
                className="items-center px-2 py-1 text-sm font-normal bg-white border border-gray-600 rounded-md shadow-sm outline-none resize-none dark:bg-black dark:text-white dark:shadow-none"
                defaultValue={10}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    perPage: parseInt(e.target.value) as 0 | 25 | 50 | 75 | 100,
                  }));
                }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={75}>75</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <p className="px-3 text-sm text-gray-200">
            {filter.page * filter.perPage + 1} -{" "}
            {commands.length < filter.page * filter.perPage + filter.perPage
              ? commands.length
              : filter.page * filter.perPage + filter.perPage}{" "}
            of {commands.length}
          </p>
          <div className="flex items-center space-x-2">
            <button
              className="rounded-md p-2 inline-flex items-center justify-center dark:text-white text-black shadow-[0_2px_10px] shadow-blackA7 outline-none border border-gray-600 dark:hover:bg-gray-900 hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-black"
              aria-label="Next Page"
            >
              <ChevronLeftIcon className="w-4 h-4 text-white " />
            </button>
            <button
              className="rounded-md p-2 inline-flex items-center justify-center dark:text-white text-black shadow-[0_2px_10px] shadow-blackA7 outline-none border border-gray-600 dark:hover:bg-gray-900 hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-black"
              aria-label="Next Page"
            >
              <ChevronRightIcon className="w-4 h-4 text-white " />
            </button>
          </div>
        </div>
        <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
      </div>
    </div>
  );
}

const Dropdown = ({ username }: { username: string }) => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-lg w-[35px] h-[35px] inline-flex items-center justify-center dark:text-white text-black shadow-[0_2px_10px] shadow-blackA7 outline-none border border-gray-600 dark:hover:bg-gray-900 hover:bg-gray-200 focus:shadow-[0_0_0_2px] focus:shadow-black"
          aria-label="Customise options"
        >
          <HamburgerMenuIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dark:border dark:border-gray-600 min-w-[220px] dark:bg-black dark:text-white bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="end"
        >
          {/* Ban from bot / Bot ban */}
          <div className="py-1">
            <DropdownMenu.Item className="outline-none">
              <p className="dark:text-white dark:hover:bg-zinc-700 block px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded">
                Issue Bot Ban
              </p>
            </DropdownMenu.Item>
            <div className="flex px-4 py-1 space-x-1">
              <p className="max-w-sm text-xs text-gray-600 truncate outline-none select-none dark:text-gray-300">
                Ban
              </p>
              <p className="max-w-sm text-xs text-gray-600 truncate outline-none select-none dark:text-gray-300">
                {username}
              </p>
              <p className="max-w-sm text-xs text-gray-600 truncate outline-none select-none dark:text-gray-300">
                from your bot
              </p>
            </div>
            {/* Seperator / Divider */}
            <DropdownMenu.Separator className="h-[1px] bg-gray-500 bg-opacity-10 dark:bg-opacity-40 m-[5px]" />
            <DropdownMenu.Item className="outline-none">
              <p className="dark:text-white dark:hover:bg-zinc-700 block px-4 py-2 text-sm hover:bg-gray-200 text-gray-700 outline-none select-none rounded-md data-[highlighted]:bg-gray-200 data-[highlighted]:rounded">
                Report Abuse
              </p>
            </DropdownMenu.Item>
            <p className="px-4 py-1 text-xs text-gray-600 outline-none select-none dark:text-gray-300">
              Notify Arigo's Trust &#38; Safety team about abusive usage
            </p>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

function Filter({
  filter,
  setFilter,
  uniqueCommands,
}: {
  filter: LogFilter;
  setFilter: (filter: LogFilter) => void;
  uniqueCommands: Database["public"]["Views"]["unique_commands"]["Row"][];
}) {
  console.log(filter, uniqueCommands);
  return (
    <div className="">
      <Listbox
        value={filter.commands}
        onChange={(value) => setFilter({ ...filter, commands: value })}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:border-gray-300 focus:dark:border-gray-400 dark:text-white dark:bg-black dark:border dark:border-gray-600 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">
              {filter.commands && filter.commands.length > 0
                ? filter.commands.join(", ")
                : "Select commands"}
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
            <Listbox.Options className="absolute z-50 grid w-full grid-cols-3 gap-2 px-1 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg md:grid-cols-6 dark:bg-black dark:text-white dark:border dark:border-gray-600 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {uniqueCommands.map((cmd, cmdIdx) => (
                <Listbox.Option
                  key={cmdIdx}
                  className={({ active, selected }) =>
                    `relative cursor-default select-none rounded-md dark:text-white py-2 pl-10 pr-4 dark:hover:bg-zinc-700 hover:bg-gray-200 hover:rounded-md ${
                      active ? "bg-zinc-700 text-white" : "text-gray-900"
                    } ${
                      selected
                        ? "bg-zinc-900 text-white font-bold"
                        : "font-normal"
                    }`
                  }
                  value={cmd.command_name}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {cmd.command_name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-800 dark:text-gray-200">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
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
    </div>
  );
}
