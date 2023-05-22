"use client";
import RealtimeCommands from "@/components/RealtimeCommands";
import PermissionsGate from "@/util/providers/PermissionsGate";
import { useWorkspaceContext } from "@/util/providers/WorkspaceProvider";

export default function CommandLog({ params }: { params: { id: string } }) {
  const { workspace } = useWorkspaceContext();
  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Command Log
          </p>

          <p className="text-sm italic font-light text-gray-400 dark:text-gray-200">
            Note: user and/or channel names may inaccurate; they&apos;re saved
            upon command execution for performance purposes.
          </p>
        </header>
        <div className="w-full font-bold text-black col-span-full dark:text-white">
          <PermissionsGate
            required={["arigo.bot.command-log.view"]}
            workspace={workspace}
            fallback={<p>Loading commands...</p>}
            failed={
              <p>You don&apos;t have permission to view the command log.</p>
            }
          >
            <RealtimeCommands />
          </PermissionsGate>
        </div>
      </section>
    </section>
  );
}
