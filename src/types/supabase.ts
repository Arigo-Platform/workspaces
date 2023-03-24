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
      accounts: {
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
      features: {
        Row: {
          created_at: string | null;
          data: Json | null;
          description: string | null;
          global_enabled: boolean;
          id: string;
          name: string;
          user_enabled: boolean;
        };
        Insert: {
          created_at?: string | null;
          data?: Json | null;
          description?: string | null;
          global_enabled?: boolean;
          id?: string;
          name: string;
          user_enabled?: boolean;
        };
        Update: {
          created_at?: string | null;
          data?: Json | null;
          description?: string | null;
          global_enabled?: boolean;
          id?: string;
          name?: string;
          user_enabled?: boolean;
        };
      };
      features_users: {
        Row: {
          feature: string;
          profile: string;
        };
        Insert: {
          feature: string;
          profile: string;
        };
        Update: {
          feature?: string;
          profile?: string;
        };
      };
      waitlist: {
        Row: {
          created_at: string | null;
          id: string;
          invite: string;
          name: string;
          role: string;
          user: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          invite: string;
          name: string;
          role: string;
          user: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          invite?: string;
          name?: string;
          role?: string;
          user?: string;
        };
      };
      workspace_members: {
        Row: {
          created_at: string | null;
          id: string;
          role: Database["public"]["Enums"]["workspace_member_type"];
          user: string;
          workspace: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["workspace_member_type"];
          user: string;
          workspace: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["workspace_member_type"];
          user?: string;
          workspace?: string;
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
      workspace_member_type: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
