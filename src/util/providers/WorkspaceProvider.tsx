import { Database } from "@/types/supabase";
import React, { createContext, useContext } from "react";

export interface WorkspaceContextValue {
  workspace: Database["public"]["Tables"]["workspaces"]["Row"] | null;
  loading: boolean;
  children?: React.ReactNode;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspace: null,
  loading: true,
});

export const useWorkspaceContext = () => useContext(WorkspaceContext);

export const WorkspaceProvider: React.FC<WorkspaceContextValue> = ({
  workspace,
  loading,
  children,
}) => {
  return (
    <WorkspaceContext.Provider value={{ workspace, loading }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
