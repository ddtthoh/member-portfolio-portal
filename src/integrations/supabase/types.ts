export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      deposit_settings: {
        Row: {
          created_at: string
          id: string
          network: string
          network_label: string
          qr_url: string | null
          updated_at: string
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          network?: string
          network_label?: string
          qr_url?: string | null
          updated_at?: string
          user_id: string
          wallet_address?: string
        }
        Update: {
          created_at?: string
          id?: string
          network?: string
          network_label?: string
          qr_url?: string | null
          updated_at?: string
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      deposits: {
        Row: {
          amount: number | null
          asset: string | null
          created_at: string
          id: string
          network: string | null
          received_at: string
          reference_number: string
          status: string
          transaction_hash: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          asset?: string | null
          created_at?: string
          id?: string
          network?: string | null
          received_at?: string
          reference_number: string
          status?: string
          transaction_hash: string
          user_id: string
        }
        Update: {
          amount?: number | null
          asset?: string | null
          created_at?: string
          id?: string
          network?: string | null
          received_at?: string
          reference_number?: string
          status?: string
          transaction_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_url: string | null
          id: string
          period: string | null
          size_bytes: number | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          file_url?: string | null
          id?: string
          period?: string | null
          size_bytes?: number | null
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string | null
          id?: string
          period?: string | null
          size_bytes?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      holdings: {
        Row: {
          asset_class: string
          asset_name: string
          avg_cost: number
          created_at: string
          currency: string
          current_price: number
          id: string
          quantity: number
          ticker: string | null
          user_id: string
        }
        Insert: {
          asset_class?: string
          asset_name: string
          avg_cost?: number
          created_at?: string
          currency?: string
          current_price?: number
          id?: string
          quantity?: number
          ticker?: string | null
          user_id: string
        }
        Update: {
          asset_class?: string
          asset_name?: string
          avg_cost?: number
          created_at?: string
          currency?: string
          current_price?: number
          id?: string
          quantity?: number
          ticker?: string | null
          user_id?: string
        }
        Relationships: []
      }
      network_contacts: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          firm: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          firm?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_number: string | null
          advisor_name: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          member_since: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          advisor_name?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          member_since?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          advisor_name?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          member_since?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      qna: {
        Row: {
          answer: string | null
          answered_at: string | null
          asked_at: string
          id: string
          question: string
          status: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          asked_at?: string
          id?: string
          question: string
          status?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          asked_at?: string
          id?: string
          question?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_passes: {
        Row: {
          category: string
          id: string
          passed_at: string
          score: number
          total: number
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          passed_at?: string
          score: number
          total: number
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          passed_at?: string
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          category: string
          correct_index: number
          created_at: string
          created_by: string
          id: string
          options: Json
          question: string
        }
        Insert: {
          category: string
          correct_index: number
          created_at?: string
          created_by: string
          id?: string
          options: Json
          question: string
        }
        Update: {
          category?: string
          correct_index?: number
          created_at?: string
          created_by?: string
          id?: string
          options?: Json
          question?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          file_url: string | null
          id: string
          period: string | null
          published_at: string
          summary: string | null
          title: string
          user_id: string
        }
        Insert: {
          file_url?: string | null
          id?: string
          period?: string | null
          published_at?: string
          summary?: string | null
          title: string
          user_id: string
        }
        Update: {
          file_url?: string | null
          id?: string
          period?: string | null
          published_at?: string
          summary?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          asset: string | null
          id: string
          occurred_at: string
          price: number | null
          quantity: number | null
          status: string
          type: string
          user_id: string
        }
        Insert: {
          amount?: number
          asset?: string | null
          id?: string
          occurred_at?: string
          price?: number | null
          quantity?: number | null
          status?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          asset?: string | null
          id?: string
          occurred_at?: string
          price?: number | null
          quantity?: number | null
          status?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          rewards_balance: number
          staking_balance: number
          updated_at: string
          usd_balance: number
          user_id: string
        }
        Insert: {
          rewards_balance?: number
          staking_balance?: number
          updated_at?: string
          usd_balance?: number
          user_id: string
        }
        Update: {
          rewards_balance?: number
          staking_balance?: number
          updated_at?: string
          usd_balance?: number
          user_id?: string
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
