import { Database } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const useProfile = () => {
  const [profile, setProfile] = useState<Profile>();
  const { error, isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (session && !isLoading) {
      supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setProfile(data);
          }
        });
    }
  }, [session, isLoading]);

  return profile;
};

export default useProfile;
