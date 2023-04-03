"use client";
import { Database } from "@/types/supabase";
import { useEffect } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
type CommandType =
  | Database["public"]["Tables"]["command_log"]["Row"]
  | undefined;
export default function RealtimePosts({
  commandLog,
}: {
  commandLog: CommandType[];
}) {
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel("realtime commands")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "command_log",
        },
        (payload) => console.log("PAYLOAD!!", payload)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  return (
    <div className="grid gap-4 grid-cols-1">
      {commandLog &&
        commandLog.map((command: CommandType) => (
          <div
            className="gap-2.5 flex flex-wrap justify-between p-6 text-4xl bg-white border border-gray-600 rounded-md shadow-sm dark:bg-blackA8 dark:text-white dark:shadow-none"
            style={{ margin: "10px" }}
          >
            <h3 className="text-sm font-medium contrast-more:text-black mb-2">
              <span className="font-bold">User:</span> {command?.username}
            </h3>
            <h3 className="text-sm font-medium contrast-more:text-black mb-2">
              <span className="font-bold">Command Name:</span> /
              {command?.command_name}
            </h3>
            <h3 className="text-sm font-medium contrast-more:text-black mb-2">
              <span className="font-bold">Channel:</span>{" "}
              {command?.channel_name}
            </h3>
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
