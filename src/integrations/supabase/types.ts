export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          estimated_duration: string | null
          freelancer_id: string
          id: string
          project_id: string
          proposed_rate: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          estimated_duration?: string | null
          freelancer_id: string
          id?: string
          project_id: string
          proposed_rate?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          estimated_duration?: string | null
          freelancer_id?: string
          id?: string
          project_id?: string
          proposed_rate?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          active_projects: number | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          rating: number | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          active_projects?: number | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id: string
          industry?: string | null
          rating?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          active_projects?: number | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          rating?: number | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          availability_status: string | null
          completed_projects: number | null
          created_at: string | null
          experience_level: string | null
          hourly_rate: number | null
          id: string
          portfolio_url: string | null
          rating: number | null
          skills: string[] | null
          total_earnings: number | null
          updated_at: string | null
        }
        Insert: {
          availability_status?: string | null
          completed_projects?: number | null
          created_at?: string | null
          experience_level?: string | null
          hourly_rate?: number | null
          id: string
          portfolio_url?: string | null
          rating?: number | null
          skills?: string[] | null
          total_earnings?: number | null
          updated_at?: string | null
        }
        Update: {
          availability_status?: string | null
          completed_projects?: number | null
          created_at?: string | null
          experience_level?: string | null
          hourly_rate?: number | null
          id?: string
          portfolio_url?: string | null
          rating?: number | null
          skills?: string[] | null
          total_earnings?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type: Database["public"]["Enums"]["user_type"]
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"]
          website?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          client_id: string
          created_at: string | null
          deadline: string | null
          description: string
          id: string
          required_skills: string[] | null
          selected_freelancer_id: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          client_id: string
          created_at?: string | null
          deadline?: string | null
          description: string
          id?: string
          required_skills?: string[] | null
          selected_freelancer_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          client_id?: string
          created_at?: string | null
          deadline?: string | null
          description?: string
          id?: string
          required_skills?: string[] | null
          selected_freelancer_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_selected_freelancer_id_fkey"
            columns: ["selected_freelancer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "accepted" | "rejected"
      project_status: "open" | "in_progress" | "completed" | "cancelled"
      user_type: "freelancer" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: ["pending", "accepted", "rejected"],
      project_status: ["open", "in_progress", "completed", "cancelled"],
      user_type: ["freelancer", "client"],
    },
  },
} as const
