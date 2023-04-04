"use client";
import { Database, Json } from "@/types/supabase";
import { useEffect, useState } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import {
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CommandLineIcon,
  HashtagIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Moment from "react-moment";
import Tooltip from "@/components/Tooltip";

type CommandType = Database["public"]["Tables"]["command_log"]["Row"];
type LogFilter = {
  user?: string;
  channel?: string;
  command?: string;
  failed?: boolean;
  args?: Json[]; // We won't support this yet, in the future we will
  page: number;
  perPage: 0 | 25 | 50 | 75 | 100;
};
export default function RealtimeCommands() {
  const supabase = useSupabaseClient<Database>();
  const [commands, setCommands] = useState<CommandType[]>([]);
  useEffect(() => {
    async function getData() {
      const { data, error } = await supabase
        .from("command_log")
        .select()
        .order("executed_at", { ascending: false });

      if (error) {
        return;
      }

      setCommands(data);
    }

    getData();
  }, []);

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
      {commands &&
        commands.map((command) => (
          <div className="relative flex flex-row flex-wrap items-stretch justify-between max-w-full p-6 text-4xl bg-white border border-gray-600 rounded-md shadow-sm dark:shadow-none gap-x-4 dark:bg-blackA8 dark:text-white">
            <div className="grid w-full max-w-lg grid-cols-4 gap-x-4">
              <h3 className="flex items-center text-sm font-medium gap-x-1">
                <CommandLineIcon className="w-4 h-4" />
                {command?.command_name}
              </h3>

              <div>
                <Tooltip content={command.user_id}>
                  <h3 className="flex items-center text-sm font-medium gap-x-1 text-slate-400">
                    <UserIcon className="w-4 h-4" />
                    {command.username}
                  </h3>
                </Tooltip>
                <Tooltip
                  content={new Date(command.executed_at).toLocaleString()}
                >
                  <h3 className="flex items-center text-sm font-medium gap-x-1 text-slate-400">
                    <CalendarIcon className="w-4 h-4" />
                    <Moment fromNow date={command.executed_at} />
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
          </div>
        ))}
    </div>
  );

  // return <pre>{JSON.stringify(commandLog, null, 2)}</pre>;
}

// WORKING CODE || DO NOT MODIFY BELOW:
// "use client";
// import { Database } from "@/types/supabase";
// import { useEffect } from "react";
// import {
//   useSessionContext,
//   useSupabaseClient,
// } from "@supabase/auth-helpers-react";
// type Post = Database["public"]["Tables"]["posts"]["Row"] | undefined;
// export default function RealtimePosts({
//   serverPosts,
// }: {
//   serverPosts: Post[];
// }) {
//   const supabase = useSupabaseClient<Database>();

//   useEffect(() => {
//     const channel = supabase
//       .channel("realtime posts")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "posts",
//         },
//         (payload) => console.log("PAYLOAD!!", payload)
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [supabase]);

//   return <pre>{JSON.stringify(serverPosts, null, 2)}</pre>;
// }
