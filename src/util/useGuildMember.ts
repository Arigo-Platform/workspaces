import { Database } from "@/types/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { APIGuildMember } from "discord-api-types/v10";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useBotSettings from "./useBotSettings";
import useDiscordServer from "./useDiscordServer";

export default function useGuildMember(
  workspace: Database["public"]["Tables"]["workspaces"]["Row"] | null
) {
  const [member, setMember] = useState<APIGuildMember | null>(null);
  const { botSettings, loading: botSettingsLoading } = useBotSettings(
    workspace?.id
  );
  const server = useDiscordServer(workspace);
  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();
  const [getMember, setGetMember] = useState(false);

  const fetchMember = async () => {
    if (!workspace) return;

    if (!server) {
      toast.error("Server not found");
      return;
    }

    if (!botSettings && !botSettingsLoading) {
      toast.error("Bot not found");
      return;
    }
    const res = await fetch(
      `/api/discord/guilds/${workspace.guild_id}/members/${session?.user?.user_metadata?.provider_id}`,
      {
        headers: {
          Authorization: `Bot ${botSettings!.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setLoading(false);

    if (res.ok) {
      const data = (await res.json()) as APIGuildMember;
      setMember(data);
    } else {
      toast.error("Failed to fetch member");
    }
  };
  useEffect(() => {
    if (!getMember) return;

    fetchMember();
  }, [getMember]);

  useEffect(() => {
    if (!workspace || !session || !server || !botSettings) return;

    setGetMember(true);
  }, [workspace, session, server, botSettings]);

  return useMemo(() => member, [member]);
}
