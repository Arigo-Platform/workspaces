import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { APIGuild } from "discord-api-types/v10";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const useDiscordServer = (
  workspace: Database["public"]["Tables"]["workspaces"]["Row"] | null
) => {
  const [server, setServer] = useState<APIGuild | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient<Database>();
  const { session } = useSessionContext();

  useEffect(() => {
    const fetchBot = async (): Promise<
      Database["public"]["Tables"]["bots"]["Row"] | null
    > => {
      if (!workspace) return null;
      const { data, error } = await supabase
        .from("bots")
        .select("*")
        .eq("workspace", workspace.id)
        .single();

      if (error) {
        console.error(error);
        toast.error("Failed to fetch bot");
        return null;
      }

      return data;
    };

    const fetchServer = async () => {
      if (!workspace) return;
      const bot = await fetchBot();

      if (!bot) {
        toast.error("Bot not found");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `/api/discord/guilds/${workspace.guild_id}?with_counts=true`,
        {
          headers: {
            Authorization: `Bot ${bot.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);

      if (res.ok) {
        const server = await res.json();
        setServer(server);
      } else {
        toast.error("Error fetching Discord guild");
      }
    };

    fetchServer();
  }, [session, workspace]);

  return useMemo(
    () => ({
      server,
      loading,
    }),
    [server, loading]
  );
};

export default useDiscordServer;
