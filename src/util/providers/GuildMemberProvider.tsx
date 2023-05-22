import { APIGuildMember } from "discord-api-types/v10";
import React, { createContext, useContext } from "react";

export interface GuildMemberContextValue {
  member: APIGuildMember | null;
  loading: boolean;
  children?: React.ReactNode;
}

const GuildMemberContext = createContext<GuildMemberContextValue>({
  member: null,
  loading: true,
});

export const useGuildMemberContext = () => useContext(GuildMemberContext);

export const GuildMemberProvider: React.FC<GuildMemberContextValue> = ({
  member,
  loading,
  children,
}) => {
  return (
    <GuildMemberContext.Provider value={{ member, loading }}>
      {children}
    </GuildMemberContext.Provider>
  );
};
