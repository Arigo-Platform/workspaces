export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      bots: {
        Row: {
          created_at: string | null;
          id: string;
          prefix: string;
          region: string | null;
          token: string | null;
          workspace: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          prefix?: string;
          region?: string | null;
          token?: string | null;
          workspace?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          prefix?: string;
          region?: string | null;
          token?: string | null;
          workspace?: string | null;
        };
      };
      profiles: {
        Row: {
          discord_id: string | null;
          id: string;
          registered: string;
          support_access: boolean;
          suspended: boolean;
          username: string;
        };
        Insert: {
          discord_id?: string | null;
          id: string;
          registered?: string;
          support_access?: boolean;
          suspended?: boolean;
          username: string;
        };
        Update: {
          discord_id?: string | null;
          id?: string;
          registered?: string;
          support_access?: boolean;
          suspended?: boolean;
          username?: string;
        };
      };
      workspaces: {
        Row: {
          created_at: string | null;
          guild_id: string;
          id: string;
          name: string | null;
          owner: string | null;
        };
        Insert: {
          created_at?: string | null;
          guild_id: string;
          id?: string;
          name?: string | null;
          owner?: string | null;
        };
        Update: {
          created_at?: string | null;
          guild_id?: string;
          id?: string;
          name?: string | null;
          owner?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
