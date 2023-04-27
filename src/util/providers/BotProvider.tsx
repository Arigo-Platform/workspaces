import { Database } from "@/types/supabase";
import React, { createContext, useContext } from "react";

export interface BotContextValue {
  bot: Database["public"]["Tables"]["bots"]["Row"] | null;
  loading: boolean;
  children?: React.ReactNode;
}

const BotContext = createContext<BotContextValue>({
  bot: null,
  loading: true,
});

export const useBotContext = () => useContext(BotContext);

export const BotProvider: React.FC<BotContextValue> = ({
  bot,
  loading,
  children,
}) => {
  return (
    <BotContext.Provider value={{ bot, loading }}>
      {children}
    </BotContext.Provider>
  );
};
