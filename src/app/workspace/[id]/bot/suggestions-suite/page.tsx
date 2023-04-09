"use client";
import { Database, Json } from "@/types/supabase";
import { getPagination } from "@/util/pagination";
import useDiscordServer from "@/util/useDiscordServer";
import useWorkspace from "@/util/useWorkspace";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import useBotSettings from "@/util/useBotSettings";

export default function CommandLog({ params }: { params: { id: string } }) {
  const { botSettings, loading: botSettingsLoading } = useBotSettings(
    "c92153c2-e353-4380-a744-7dd8ac75be90"
  );

  return (
    <section id="dashboard" className="p-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:grid-cols-6">
        <header className="col-span-full">
          <p className="text-2xl font-medium dark:text-white animate-slideRightAndFade">
            Suggestions Suite
          </p>
        </header>
        <div className="w-full col-span-full">
          {/* Content */}

          {/*  */}
        </div>
      </section>
    </section>
  );
}
