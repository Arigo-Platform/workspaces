"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useDiscordServer from "@/util/useDiscordServer";
import useWorkspace from "@/util/useWorkspace";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type LogFilter = {
  user?: string;
  channel?: string;
  command?: string;
  args?: Json[]; // We won't support this yet, in the future we will
  page: number;
  perPage: 0 | 25 | 50 | 75 | 100;
};

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [workspace, loading] = useWorkspace(params.id);
  const user = useUser();
  const [commandLogs, setCommandLogs] = useState<
    Database["public"]["Tables"]["command_log"]["Row"][] | null
  >();
  const [logFilters, setLogFilters] = useState<LogFilter>({
    page: 0,
    perPage: 25,
  });

  const supabase = useSupabaseClient<Database>();

  async function getCommandLogs(): Promise<void> {
    const { from, to } = getPagination(logFilters.page, logFilters.perPage);
    let query = supabase.from("command_log").select("*");

    query = query.order("executed_at", { ascending: true });

    if (logFilters.user) {
      query = query.eq("user_id", logFilters.user);
    }

    if (logFilters.channel) {
      query = query.eq("channel_id", logFilters.channel);
    }

    if (logFilters.command) {
      query = query.eq("command", logFilters.command);
    }

    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      toast.error("Error fetching command logs");
      return;
    }

    setCommandLogs(data);
  }

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Command Log
          </p>
        </header>
        <div className="w-full h-full col-span-4 p-6 text-4xl bg-white border border-gray-600 rounded-md shadow-sm dark:bg-blackA8 dark:text-white dark:shadow-none ">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-sm font-medium contrast-more:text-black">
                itilva8630
              </h3>
              {/* Success */}
              <p className="text-sm font-medium text-gray-500 contrast-more:text-black">
                🟢 | Success
              </p>
            </div>
            {/* User Image */}
            <div>
              <img
                className="w-8 h-8 rounded-full"
                src={user?.user_metadata.avatar_url}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

function Time() {
  const [date, setDate] = useState(new Date());

  function refreshClock() {
    setDate(new Date());
  }

  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <span>
      {date.toLocaleTimeString(window.navigator.language, {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}
    </span>
  );
}
