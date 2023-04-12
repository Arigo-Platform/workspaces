import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

const useRoleInWorkspace = (workspaceId: string) => {
  type WorkspaceMembers =
    Database["public"]["Tables"]["workspace_members"]["Row"]["role"];

  const [role, setRole] = useState<WorkspaceMembers>();

  const [loading, setLoading] = useState(true);
  const { session } = useSessionContext();
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    if (!session) return;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("role")
        .eq("workspace", workspaceId)
        .eq("user", session.user.id)
        .single();
      console.log("User ID", session.user.id);
      console.log("Workspace ID", workspaceId);
      if (error) {
        console.error("There was an error!", error);
        return;
      }

      setRole(data.role);
      setLoading(false);
    };

    fetchRole();
  }, [workspaceId, session]);

  return useMemo(
    () => ({
      role,
      loading,
    }),
    [role, loading]
  );
};

export default useRoleInWorkspace;
