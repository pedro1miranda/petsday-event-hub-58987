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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      colaboradores: {
        Row: {
          auth_uid: string | null
          created_at: string | null
          email: string
          id: string
          nome: string
          senha_hash: string | null
          status: boolean | null
        }
        Insert: {
          auth_uid?: string | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          senha_hash?: string | null
          status?: boolean | null
        }
        Update: {
          auth_uid?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          senha_hash?: string | null
          status?: boolean | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string | null
          data_evento: string | null
          descricao: string | null
          id: string
          local_evento: string | null
          lucky_number_counter: number | null
          nome_evento: string
          whatsapp_link: string | null
        }
        Insert: {
          created_at?: string | null
          data_evento?: string | null
          descricao?: string | null
          id?: string
          local_evento?: string | null
          lucky_number_counter?: number | null
          nome_evento: string
          whatsapp_link?: string | null
        }
        Update: {
          created_at?: string | null
          data_evento?: string | null
          descricao?: string | null
          id?: string
          local_evento?: string | null
          lucky_number_counter?: number | null
          nome_evento?: string
          whatsapp_link?: string | null
        }
        Relationships: []
      }
      lucky_numbers: {
        Row: {
          generated_at: string | null
          id: string
          lucky_number: string
          pet_id: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          lucky_number: string
          pet_id: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          lucky_number?: string
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lucky_numbers_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: true
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      lucky_numbers_tutor: {
        Row: {
          event_id: string
          generated_at: string | null
          id: string
          lucky_number: number
          pet_id: string
        }
        Insert: {
          event_id: string
          generated_at?: string | null
          id?: string
          lucky_number: number
          pet_id: string
        }
        Update: {
          event_id?: string
          generated_at?: string | null
          id?: string
          lucky_number?: number
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lucky_numbers_tutor_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lucky_numbers_tutor_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets_tutor"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          breed: string | null
          created_at: string | null
          id: string
          owner_id: string
          pet_name: string
          species: Database["public"]["Enums"]["pet_species"]
          updated_at: string | null
        }
        Insert: {
          breed?: string | null
          created_at?: string | null
          id?: string
          owner_id: string
          pet_name: string
          species: Database["public"]["Enums"]["pet_species"]
          updated_at?: string | null
        }
        Update: {
          breed?: string | null
          created_at?: string | null
          id?: string
          owner_id?: string
          pet_name?: string
          species?: Database["public"]["Enums"]["pet_species"]
          updated_at?: string | null
        }
        Relationships: []
      }
      pets_tutor: {
        Row: {
          breed: string | null
          created_at: string | null
          especie: string | null
          id: string
          pet_name: string
          tutor_id: string
        }
        Insert: {
          breed?: string | null
          created_at?: string | null
          especie?: string | null
          id?: string
          pet_name: string
          tutor_id: string
        }
        Update: {
          breed?: string | null
          created_at?: string | null
          especie?: string | null
          id?: string
          pet_name?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_tutor_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "tutores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          image_publication_consent: boolean | null
          lgpd_consent: boolean | null
          phone: string | null
          social_media: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          image_publication_consent?: boolean | null
          lgpd_consent?: boolean | null
          phone?: string | null
          social_media?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          image_publication_consent?: boolean | null
          lgpd_consent?: boolean | null
          phone?: string | null
          social_media?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tutores: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          image_publication_consent: boolean | null
          lgpd_consent: boolean | null
          redes_sociais: string | null
          telefone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          image_publication_consent?: boolean | null
          lgpd_consent?: boolean | null
          redes_sociais?: string | null
          telefone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          image_publication_consent?: boolean | null
          lgpd_consent?: boolean | null
          redes_sociais?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buscar_usuarios: {
        Args: { search_term?: string }
        Returns: {
          breed: string
          email: string
          especie: string
          image_publication_consent: boolean
          lgpd_consent: boolean
          numero_sorte: number
          pet_id: string
          pet_nome: string
          redes_sociais: string
          telefone: string
          tutor_id: string
          tutor_nome: string
        }[]
      }
      generate_lucky_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gerar_numero_sorte: {
        Args: { evento_uuid: string; pet_uuid: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "staff" | "tutor"
      pet_species: "dog" | "cat" | "bird" | "other"
      user_status: "active" | "inactive"
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
    Enums: {
      app_role: ["staff", "tutor"],
      pet_species: ["dog", "cat", "bird", "other"],
      user_status: ["active", "inactive"],
    },
  },
} as const
