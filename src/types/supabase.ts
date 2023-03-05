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
