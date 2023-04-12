import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useWorkspaceMemberCount = (workspaceId: string) => {
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    if (!session) return;

    const fetchMemberCount = async () => {
      const { data, error } = await supabase.rpc("get_workspace_member_count", {
        workspace_id: workspaceId,
      });

      setLoading(false);

      if (error) {
        console.error(error);
        return;
      }

      setMemberCount(data || 0);
    };

    fetchMemberCount();
  }, [workspaceId, session]);

  return useMemo(
    () => ({
      memberCount,
      loading,
    }),
    [memberCount, loading]
  );
};

export default useWorkspaceMemberCount;
