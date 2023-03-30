"use client";
import { Database } from "@/types/supabase";
import { useEffect } from "react";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
type Post = Database["public"]["Tables"]["command_log"]["Row"] | undefined;
export default function RealtimePosts({
  serverPosts,
}: {
  serverPosts: Post[];
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

  return <pre>{JSON.stringify(serverPosts, null, 2)}</pre>;
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
