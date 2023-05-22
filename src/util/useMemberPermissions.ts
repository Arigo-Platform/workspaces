import { Database } from "@/types/supabase";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useGuildMemberContext } from "./providers/GuildMemberProvider";
import { Workspace } from "./providers/WorkspaceProvider";

export default function useMemberPermissions(workspace: Workspace | null) {
  const { member } = useGuildMemberContext();
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient<Database>();
  const [userPermissions, setUserPermissions] = useState<string[]>();

  useEffect(() => {
    if (!member) return;

    const fetchPermissions = async () => {
      if (!workspace) return;
      const { data, error } = await supabase
        .from("workspace_permissions")
        .select("*")
        .eq("workspace", workspace.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data) return;

      // find the all permissions for the user by their role ids
      // and flatten the array, then remove duplicates so its unique
      const permissions = data
        .filter((p) => member.roles.includes(p.role))
        .map((p) => p.permissions)
        .flat()
        .filter((p, i, a) => a.indexOf(p) === i);

      setUserPermissions(permissions);
      setLoading(false);
    };

    fetchPermissions();
  }, [member, workspace]);

  return useMemo(
    () => ({
      userPermissions,
      loading,
    }),
    [userPermissions, loading]
  );
}
