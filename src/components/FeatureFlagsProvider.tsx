import useFeatureFlags, { FeatureFlags } from "@/util/useFeatureFlags";
import { createContext } from "react";

// @ts-ignore
const Context = createContext<FeatureFlags | undefined>();

export default function FeatureFlagsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const featureFlags = useFeatureFlags();

  return (
    <Context.Provider value={featureFlags}>
      {featureFlags ? (
        featureFlags.VERSION_2_ACCESS ? (
          children
        ) : (
          <div className="flex flex-col items-center dark:text-white justify-center h-screen">
            <h1 className="text-2xl font-bold">
              You don&apos;t have access to this.
            </h1>
            <p className="text-lg">
              This is a private beta. If you&apos;d like to join, please join
              the waitlist at{" "}
              <a
                href="https://arigoapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                arigoapp.com
              </a>
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center dark:text-white justify-center h-screen">
          <h1 className="text-2xl font-bold">Getting things ready...</h1>
        </div>
      )}
    </Context.Provider>
  );
}
