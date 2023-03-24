import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const useWorkspace = (workspaceId: string) => {
  const [workspace, setWorkspace] = useState<
    Database["public"]["Tables"]["workspaces"]["Row"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    if (!session) return;

    const fetchWorkspace = async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", workspaceId)
        .single();

      setLoading(false);

      if (error) {
        console.error(error);
        return;
      }

      setWorkspace(data);
    };

    fetchWorkspace();
  }, [workspaceId, session]);

  return [workspace, loading] as const;
};

export default useWorkspace;
