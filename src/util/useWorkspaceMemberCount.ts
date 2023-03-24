import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const useWorkspaceMemberCount = (workspaceId: string) => {
  const [memberCount, setMemberCount] = useState();
  const { session } = useSessionContext();
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    if (!session) return;

    const fetchMemberCount = async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("id", { count: "exact", head: true })
        .eq("workspace", workspaceId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      console.log(data);
    };

    fetchMemberCount();
  }, [workspaceId, session]);

  return memberCount;
};
