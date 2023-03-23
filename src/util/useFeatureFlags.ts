import { Database, Json } from "@/types/supabase";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

type Feature = Database["public"]["Tables"]["features"]["Row"];

export type FeatureFlags = {
  [key: string]: Json;
};

const useFeatureFlags = () => {
  const [userFeatures, setUserFeatures] = useState<FeatureFlags>();
  const [features, setFeatures] = useState<Feature[]>();
  const { error, isLoading, session } = useSessionContext();
  const supabaseClient = useSupabaseClient<Database>();

  useEffect(() => {
    if (session && !isLoading) {
      supabaseClient
        .from("features")
        .select("*")
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            setFeatures(data as unknown as Feature[]);
          }
        });
    }
  }, [session, isLoading]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }

    if (session && !isLoading) {
      supabaseClient
        .from("features_users")
        .select("*")
        .eq("profile", session.user.id)
        .then(({ data, error }) => {
          if (error) {
            console.error(error);
          } else {
            if (features) {
              const featureFlags: FeatureFlags = {};

              const userHasFeature = (feature: Feature) => {
                return (
                  feature.global_enabled &&
                  (feature.user_enabled ||
                    data.some((f) => f.feature === feature.id))
                );
              };

              (features as unknown as Feature[]).forEach((f) => {
                featureFlags[f.name] = userHasFeature(f)
                  ? f.data ?? true
                  : false;
              });

              setUserFeatures(featureFlags);

              console.log(featureFlags);
            }
          }
        });
    }
  }, [features]);

  return userFeatures;
};

export default useFeatureFlags;
