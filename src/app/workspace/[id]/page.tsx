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

  useEffect(() => {
    getCommandLogs();
  }, [workspace, logFilters]);

  const getTimeText = (date: Date) => {
    if (date.getHours() <= 9) {
      // 9 AM to 12 PM
      const morningTerms = [
        "Good morning!",
        "Have a productive day!",
        "Rise and shine!",
        "Have a great day!",
        "Isn't it a beautiful day today?",
        "How are you this fine morning?",
        "Morning!",
        "Enjoy the day to the fullest!",
      ];
      return `${
        morningTerms[Math.floor(Math.random() * morningTerms.length)]
      } ☀️`;
    }

    if (date.getHours() <= 12 && date.getHours() >= 17) {
      // 12 PM to 5 PM
      const afternoonTerms = [
        "Good afternoon!",
        "Hope you're having a great afternoon!",
        "Having a productive day?",
        "Your community is incredible, we hope you know that",
        "Isn't it a beautiful day today?",
        "Hope the weather today is great!",
      ];
      return `${
        afternoonTerms[Math.floor(Math.random() * afternoonTerms.length)]
      } 🌻`;
    }

    if (date.getHours() <= 17) {
      // 5 PM
      const eveningTerms = [
        "Good evening!",
        "Hope you had a great day!",
        "Ready to wind down?",
        "Hope you had a productive day!",
        "Did you do a good deed today?",
        "Sending you lots of good vibes tonight!",
        "Enjoy the evening to the fullest!",
      ];
      return `${
        eveningTerms[Math.floor(Math.random() * eveningTerms.length)]
      } 🌙`;
    }
    const sleepTerms = [
      // After 5 PM before 9 AM
      "Sleep well!",
      "Night night!",
      "See you tomorrow!",
      "Get some rest!",
      "Sweet dreams!",
      "Sleep tight!",
    ];

    return `${sleepTerms[Math.floor(Math.random() * sleepTerms.length)]} 😴`;
  };

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <h1 className="text-4xl font-bold dark:text-white animate-slideRightAndFade">
            Welcome back, {user?.user_metadata.full_name}.
          </h1>
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Here&apos;s your rundown:
          </p>
        </header>
        <div className="w-full h-full col-span-2 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-blackA8 dark:text-white dark:shadow-none ">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-sm font-medium contrast-more:text-black">
                It&apos;s currently:
              </h3>
              <Time />
              <span className="text-xs font-light">
                {getTimeText(new Date())}
              </span>{" "}
            </div>
          </div>
        </div>

        <div className="w-full h-full col-span-2 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-blackA8 dark:text-white dark:shadow-none ">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-sm font-medium contrast-more:text-black">
                Current Server Members
              </h3>
              <span>1205</span>
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
