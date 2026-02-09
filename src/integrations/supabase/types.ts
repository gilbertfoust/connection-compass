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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      budget_items: {
        Row: {
          actual_amount: number
          budget_id: string
          category: string
          couple_id: string
          created_at: string
          id: string
          name: string
          planned_amount: number
          type: string
        }
        Insert: {
          actual_amount?: number
          budget_id: string
          category: string
          couple_id: string
          created_at?: string
          id?: string
          name: string
          planned_amount?: number
          type?: string
        }
        Update: {
          actual_amount?: number
          budget_id?: string
          category?: string
          couple_id?: string
          created_at?: string
          id?: string
          name?: string
          planned_amount?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_items_budget_id_fkey"
            columns: ["budget_id"]
            isOneToOne: false
            referencedRelation: "budgets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budget_items_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      budgets: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string | null
          id: string
          month: number
          template: string
          total_income: number
          updated_at: string
          year: number
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          month: number
          template?: string
          total_income?: number
          updated_at?: string
          year: number
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          month?: number
          template?: string
          total_income?: number
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "budgets_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          category: string
          completed: boolean
          conversation_prompt: string | null
          couple_id: string
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          recurring: string | null
          time: string | null
          title: string
        }
        Insert: {
          category?: string
          completed?: boolean
          conversation_prompt?: string | null
          couple_id: string
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          recurring?: string | null
          time?: string | null
          title: string
        }
        Update: {
          category?: string
          completed?: boolean
          conversation_prompt?: string | null
          couple_id?: string
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          recurring?: string | null
          time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id?: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string
          completed: boolean
          couple_id: string
          created_at: string
          created_by: string | null
          id: string
          milestones: Json | null
          reflections: Json | null
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          completed?: boolean
          couple_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          milestones?: Json | null
          reflections?: Json | null
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          completed?: boolean
          couple_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          milestones?: Json | null
          reflections?: Json | null
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      love_languages: {
        Row: {
          acts_of_service: number
          couple_id: string
          created_at: string
          id: string
          physical_touch: number
          primary_language: string
          quality_time: number
          receiving_gifts: number
          secondary_language: string
          updated_at: string
          user_id: string
          words_of_affirmation: number
        }
        Insert: {
          acts_of_service?: number
          couple_id: string
          created_at?: string
          id?: string
          physical_touch?: number
          primary_language?: string
          quality_time?: number
          receiving_gifts?: number
          secondary_language?: string
          updated_at?: string
          user_id: string
          words_of_affirmation?: number
        }
        Update: {
          acts_of_service?: number
          couple_id?: string
          created_at?: string
          id?: string
          physical_touch?: number
          primary_language?: string
          quality_time?: number
          receiving_gifts?: number
          secondary_language?: string
          updated_at?: string
          user_id?: string
          words_of_affirmation?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          couple_id: string | null
          created_at: string
          display_name: string | null
          id: string
          invite_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          couple_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          invite_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          couple_id?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          invite_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          category: string
          completed: boolean
          couple_id: string
          created_at: string
          created_by: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string
          completed?: boolean
          couple_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          completed?: boolean
          couple_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      vision_items: {
        Row: {
          color: string | null
          content: string
          couple_id: string
          created_at: string
          created_by: string | null
          id: string
          image_url: string | null
          timeframe: string
          type: string
        }
        Insert: {
          color?: string | null
          content: string
          couple_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          timeframe?: string
          type: string
        }
        Update: {
          color?: string | null
          content?: string
          couple_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          image_url?: string | null
          timeframe?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vision_items_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_couple_id: { Args: { _user_id: string }; Returns: string }
      link_partner: { Args: { partner_invite_code: string }; Returns: Json }
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
