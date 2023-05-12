import { Database } from "@/types/supabase";
import React, { createContext, useContext } from "react";
import useWorkspaces from "../useWorkspaces";

export interface WorkspacesContextValue {
  workspaces:
    | Database["public"]["Tables"]["workspaces"]["Row"][]
    | null
    | undefined;
  loading: boolean;
  children?: React.ReactNode;
}

const WorkspacesContext = createContext<WorkspacesContextValue>({
  workspaces: null,
  loading: true,
});

export const useWorkspacesContext = () => useContext(WorkspacesContext);

export const WorkspacesProvider: React.FC<Partial<WorkspacesContextValue>> = ({
  children,
}) => {
  const { workspaces, workspacesLoading } = useWorkspaces();

  return (
    <WorkspacesContext.Provider
      value={{ workspaces, loading: workspacesLoading }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
