import { useEffect, useState } from "react";
import { APIGuild } from "discord-api-types/v10";
import useWorkspace from "./useWorkspace";
import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

const useDiscordServer = (
  workspace: Database["public"]["Tables"]["workspaces"]["Row"]
) => {
  const [server, setServer] = useState<APIGuild | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    const fetchBot = async (): Promise<
      Database["public"]["Tables"]["bots"]["Row"] | null
    > => {
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
      const bot = await fetchBot();

      if (!bot) {
        toast.error("Bot not found");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://discord.com/api/v10/guilds/${workspace.guild_id}?with_counts=true`,
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
      }
    };

    fetchServer();
  }, []);

  return [server, loading] as const;
};

export default useDiscordServer;
