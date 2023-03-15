import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type Workspaces = Database["public"]["Tables"]["workspaces"]["Row"][];

const useProfile = () => {
  const [workspaces, setWorkspaces] = useState<Workspaces>();
  const { error, isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (session && !isLoading) {
      supabaseClient
        .from("workspaces")
        .select("*")
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setWorkspaces(data);
          }
        });
    }
  }, [session, isLoading]);

  return workspaces;
};

export default useProfile;
