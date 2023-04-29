import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";

type Workspaces = Database["public"]["Tables"]["workspaces"]["Row"][];

const useProfile = () => {
  const [workspaces, setWorkspaces] = useState<Workspaces>();
  const { error, isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();
  const [workspacesLoading, setWorkspacesLoading] = useState(false);

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (session && !isLoading) {
      setWorkspacesLoading(true);
      supabaseClient
        .from("workspaces")
        .select("*")
        .then(({ data, error }) => {
          setWorkspacesLoading(false);
          if (error) {
            console.error(error);
          } else {
            setWorkspaces(data);
          }
        });
    }
  }, [session, isLoading]);

  return {
    ...useMemo(
      () => ({
        workspaces,
        workspacesLoading,
      }),
      [workspaces, workspacesLoading]
    ),
  };
};

export default useProfile;
