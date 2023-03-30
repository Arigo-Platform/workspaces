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
      bot_commands: {
        Row: {
          avatar: string | null;
          channelId: string | null;
          command_name: string | null;
          executed_at: string | null;
          fields: Json | null;
          id: number;
          serverId: string | null;
          userId: string | null;
        };
        Insert: {
          avatar?: string | null;
          channelId?: string | null;
          command_name?: string | null;
          executed_at?: string | null;
          fields?: Json | null;
          id?: number;
          serverId?: string | null;
          userId?: string | null;
        };
        Update: {
          avatar?: string | null;
          channelId?: string | null;
          command_name?: string | null;
          executed_at?: string | null;
          fields?: Json | null;
          id?: number;
          serverId?: string | null;
          userId?: string | null;
        };
      };
      bots: {
        Row: {
          created_at: string | null;
          id: string;
          region: string | null;
          statuses: Json[] | null;
          token: string | null;
          workspace: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          region?: string | null;
          statuses?: Json[] | null;
          token?: string | null;
          workspace?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          region?: string | null;
          statuses?: Json[] | null;
          token?: string | null;
          workspace?: string | null;
        };
      };
      command_log: {
        Row: {
          args: Json[] | null;
          channel_id: string;
          command: string;
          executed_at: string | null;
          guild_id: string | null;
          id: string;
          message_id: string;
          user_id: string;
        };
        Insert: {
          args?: Json[] | null;
          channel_id: string;
          command: string;
          executed_at?: string | null;
          guild_id?: string | null;
          id?: string;
          message_id: string;
          user_id: string;
        };
        Update: {
          args?: Json[] | null;
          channel_id?: string;
          command?: string;
          executed_at?: string | null;
          guild_id?: string | null;
          id?: string;
          message_id?: string;
          user_id?: string;
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
      posts: {
        Row: {
          created_at: string | null;
          id: string;
          title: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          title?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          title?: string | null;
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
          guild_member_count: number | null;
          icon: string | null;
          id: string;
          name: string | null;
          owner: string | null;
        };
        Insert: {
          created_at?: string | null;
          guild_id: string;
          guild_member_count?: number | null;
          icon?: string | null;
          id?: string;
          name?: string | null;
          owner?: string | null;
        };
        Update: {
          created_at?: string | null;
          guild_id?: string;
          guild_member_count?: number | null;
          icon?: string | null;
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
      can_access_workspace: {
        Args: {
          workspaceid: string;
          uid: string;
        };
        Returns: boolean;
      };
      get_workspace_member_count: {
        Args: {
          workspace_id: string;
        };
        Returns: number;
      };
      update_guild: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_workspace_icons: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      workspace_member_type: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
