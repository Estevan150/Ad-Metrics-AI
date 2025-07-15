export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ad_accounts: {
        Row: {
          access_token_encrypted: string | null
          account_id: string
          account_name: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          platform: string
          refresh_token_encrypted: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_encrypted?: string | null
          account_id: string
          account_name: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform: string
          refresh_token_encrypted?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_encrypted?: string | null
          account_id?: string
          account_name?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          platform?: string
          refresh_token_encrypted?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      alert_settings: {
        Row: {
          created_at: string
          email_enabled: boolean
          id: string
          is_enabled: boolean
          push_enabled: boolean
          threshold_value: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          is_enabled?: boolean
          push_enabled?: boolean
          threshold_value?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_enabled?: boolean
          id?: string
          is_enabled?: boolean
          push_enabled?: boolean
          threshold_value?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      automated_reports: {
        Row: {
          created_at: string
          email_recipients: string[] | null
          id: string
          is_active: boolean
          last_sent_at: string | null
          name: string
          schedule_day: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          name: string
          schedule_day?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_recipients?: string[] | null
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          name?: string
          schedule_day?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      automation_rules: {
        Row: {
          action_type: string
          action_value: number | null
          campaigns: string[] | null
          condition_type: string
          condition_value: number
          created_at: string
          id: string
          is_active: boolean
          name: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_type: string
          action_value?: number | null
          campaigns?: string[] | null
          condition_type: string
          condition_value: number
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_type?: string
          action_value?: number | null
          campaigns?: string[] | null
          condition_type?: string
          condition_value?: number
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budget_goals: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          month_year: string
          monthly_budget: number
          target_conversions: number | null
          target_cpc: number | null
          target_ctr: number | null
          target_roas: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          month_year: string
          monthly_budget: number
          target_conversions?: number | null
          target_cpc?: number | null
          target_ctr?: number | null
          target_roas?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          month_year?: string
          monthly_budget?: number
          target_conversions?: number | null
          target_cpc?: number | null
          target_ctr?: number | null
          target_roas?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_goals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_comments: {
        Row: {
          campaign_id: string | null
          comment: string
          created_at: string
          id: string
          is_internal: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          comment: string
          created_at?: string
          id?: string
          is_internal?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          comment?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_comments_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          ad_account_id: string
          budget_amount: number | null
          campaign_id: string
          campaign_name: string
          clicks: number | null
          conversions: number | null
          cost: number | null
          cpc: number | null
          created_at: string
          ctr: number | null
          currency: string | null
          id: string
          impressions: number | null
          last_synced_at: string | null
          platform: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_account_id: string
          budget_amount?: number | null
          campaign_id: string
          campaign_name: string
          clicks?: number | null
          conversions?: number | null
          cost?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          currency?: string | null
          id?: string
          impressions?: number | null
          last_synced_at?: string | null
          platform: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_account_id?: string
          budget_amount?: number | null
          campaign_id?: string
          campaign_name?: string
          clicks?: number | null
          conversions?: number | null
          cost?: number | null
          cpc?: number | null
          created_at?: string
          ctr?: number | null
          currency?: string | null
          id?: string
          impressions?: number | null
          last_synced_at?: string | null
          platform?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_ad_account_id_fkey"
            columns: ["ad_account_id"]
            isOneToOne: false
            referencedRelation: "ad_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      change_history: {
        Row: {
          action: string
          campaign_id: string | null
          created_at: string
          field_changed: string | null
          id: string
          new_value: string | null
          old_value: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          action: string
          campaign_id?: string | null
          created_at?: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          action?: string
          campaign_id?: string | null
          created_at?: string
          field_changed?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "change_history_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          priority: string
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          priority?: string
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          priority?: string
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invited_at: string
          is_active: boolean
          member_id: string
          owner_id: string
          permissions: string[] | null
          role: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          is_active?: boolean
          member_id: string
          owner_id: string
          permissions?: string[] | null
          role: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          is_active?: boolean
          member_id?: string
          owner_id?: string
          permissions?: string[] | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
