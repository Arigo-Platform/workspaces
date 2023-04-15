"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useDiscordServer from "@/util/useDiscordServer";
import useWorkspace from "@/util/useWorkspace";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage({ params }: { params: { id: string } }) {
  const { workspace } = useWorkspace(params.id);
  const user = useUser();

  const { server: discordServer } = useDiscordServer(workspace);

  const [timeText, setTimeText] = useState("");
  const [greetingHeaderText, setGreetingHeaderText] = useState("");

  useEffect(() => {
    // Greeting Header Text
    const greetingHeaderOptions = [
      "Welcome back",
      "Good to see ya",
      "Howdy",
      "Hey",
    ];
    setGreetingHeaderText(
      greetingHeaderOptions[
        Math.floor(Math.random() * greetingHeaderOptions.length)
      ]
    );

    // Time Text
    const date = new Date();
    const hours = date.getHours();
    const day = date
      .getDay()
      .toString()
      .replaceAll("0", "Sunday")
      .replaceAll("1", "Monday")
      .replaceAll("2", "Tuesday")
      .replaceAll("3", "Wednesday")
      .replaceAll("4", "Thursday")
      .replaceAll("5", "Friday")
      .replaceAll("6", "Saturday");

    if (hours >= 0 && hours < 12) {
      // 12 AM to 12 PM
      const morningTerms = [
        "Good morning!",
        "Have a productive day!",
        "Rise and shine!",
        "Have a great day!",
        `Have a great ${day}!`,
        "Isn't it a beautiful day today?",
        "How are you this fine morning?",
        "Morning!",
        "Enjoy the day to the fullest!",
      ];
      setTimeText(
        `${morningTerms[Math.floor(Math.random() * morningTerms.length)]} ☀️`
      );
    } else if (hours >= 12 && hours < 16) {
      // 12 PM to 4 PM
      const afternoonTerms = [
        "Good afternoon!",
        `Having a good ${day} afternoon?`,
        "Hope you're having a great afternoon!",
        "Having a productive day?",
        "Your community is incredible, we hope you know that",
        "Isn't it a beautiful day today?",
        "Hope the weather today is great!",
      ];
      setTimeText(
        `${
          afternoonTerms[Math.floor(Math.random() * afternoonTerms.length)]
        } 🌻`
      );
    } else if (hours >= 16 && hours < 21) {
      // 4 PM to 9 PM
      const eveningTerms = [
        "Good evening!",
        "Hope you had a great day!",
        "Ready to wind down?",
        "Hope you had a productive day!",
        "Did you do a good deed today?",
        "Sending you lots of good vibes tonight!",
        "Enjoy the evening to the fullest!",
      ];
      setTimeText(
        `${eveningTerms[Math.floor(Math.random() * eveningTerms.length)]} 🌙`
      );
    } else {
      // 9 PM to 12 AM
      const sleepTerms = [
        "Sleep well!",
        "Night night!",
        "See you tomorrow!",
        "Get some rest!",
        "Sweet dreams!",
        "Sleep tight!",
      ];
      if (day === "Sunday") {
        sleepTerms.push("Get some sleep, tomorrow's Monday!");
      }
      if (day === "Friday") {
        sleepTerms.push("It's time for the weekend!");
      }

      setTimeText(
        `${sleepTerms[Math.floor(Math.random() * sleepTerms.length)]} 😴`
      );
    }
  }, []);

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <h1 className="text-4xl font-bold dark:text-white animate-slideRightAndFade">
            {greetingHeaderText}, {user?.user_metadata.full_name} 👋
          </h1>
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Here&apos;s your rundown:
          </p>
        </header>
        <div className="w-full h-full col-span-2 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none ">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-sm font-medium contrast-more:text-black">
                It&apos;s currently
              </h3>
              <Time />
              <span className="text-xs font-light">{timeText}</span>{" "}
            </div>
          </div>
        </div>

        <div className="w-full h-full col-span-2 p-6 text-4xl font-bold bg-white border border-gray-600 rounded-md shadow-sm dark:bg-black dark:text-white dark:shadow-none ">
          <div className="flex items-center justify-between space-x-4">
            <div className="grid col-span-4">
              <h3 className="text-sm font-medium contrast-more:text-black">
                Server Members
              </h3>
              {discordServer ? (
                <span>
                  {discordServer.approximate_member_count?.toLocaleString()}
                </span>
              ) : (
                <span>...</span>
              )}
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
