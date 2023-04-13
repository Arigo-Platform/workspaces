import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useBotSettings = (workspaceId: string) => {
  type BotSettingsConfig = Database["public"]["Tables"]["bots"]["Row"];

  const [botSettings, setBotSettings] = useState<BotSettingsConfig>();

  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();
  const supabase = useSupabaseClient<Database>();

  const fetchBot = async () => {
    const { data, error } = await supabase
      .from("bots")
      .select()
      .eq("workspace", workspaceId)
      .single();

    if (error) {
      console.error("There was an error!", error);
      return;
    }
    setBotSettings(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) return;

    fetchBot();
  }, [workspaceId, session]);

  return {
    ...useMemo(
      () => ({
        botSettings,
        loading,
      }),
      [botSettings, loading]
    ),
    refresh: fetchBot,
  };
};

export default useBotSettings;
