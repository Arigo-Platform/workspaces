"use client";
import RealtimeCommands from "@/components/RealtimeCommands";

export default function CommandLog({ params }: { params: { id: string } }) {
  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Command Log
          </p>

          <p className="text-sm italic font-light text-gray-400 dark:text-gray-200">
            Note: User and/or channel names may inaccurate; they're saved on
            command execution to prevent excessive API calls.
          </p>
        </header>
        <div className="w-full col-span-full">
          <RealtimeCommands />
        </div>
      </section>
    </section>
  );
}
