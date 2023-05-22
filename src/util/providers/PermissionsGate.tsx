import useMemberPermissions from "../useMemberPermissions";
import { Workspace } from "./WorkspaceProvider";

export default function PermissionsGate({
  workspace,
  fallback,
  failed,
  required,
  children,
}: {
  workspace: Workspace | null;
  fallback?: React.ReactNode;
  failed?: React.ReactNode;
  required: string[];
  children: React.ReactNode;
}) {
  const { userPermissions, loading } = useMemberPermissions(workspace);

  if (loading) {
    return <>{fallback}</>;
  }

  return (
    <>
      {userPermissions &&
      !loading &&
      required.every((permission) => userPermissions.includes(permission)) ? (
        <>{children}</>
      ) : failed ? (
        <>{failed}</>
      ) : (
        <></>
      )}
    </>
  );
}
