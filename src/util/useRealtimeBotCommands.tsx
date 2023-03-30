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
    <div>
      <div>
        {commandLog &&
          commandLog.map((command: CommandType) => (
            <div className="w-full h-full col-span-4 p-6 text-4xl bg-white border border-gray-600 rounded-md shadow-sm dark:bg-blackA8 dark:text-white dark:shadow-none ">
              <div className="flex items-center justify-between space-x-4">
                <div className="grid col-span-4">
                  <h3 className="text-sm font-medium contrast-more:text-black">
                    {command?.username} used /${command?.command_name} in $
                    {command?.channel_id} with ID {command?.id}
                  </h3>
                  {/* Success */}
                  <p className="text-sm font-medium text-gray-500 contrast-more:text-black">
                    🟢 | Success
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
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
