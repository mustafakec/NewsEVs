export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      electric_vehicles: {
        Row: {
          id: string;
          brand: string;
          model: string;
          year: number;
          type: string;
          range: number;
          battery_capacity: number;
          charging_time: Json;
          performance: Json;
          dimensions: Json;
          efficiency: Json;
          comfort: Json | null;
          price: Json;
          images: string[];
          features: string[];
          extra_features: string[] | null;
          warranty: Json;
          environmental_impact: Json | null;
          heat_pump: string | null;
          v2l: string | null;
          turkey_status: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          brand: string;
          model: string;
          year: number;
          type: string;
          range: number;
          battery_capacity: number;
          charging_time: Json;
          performance: Json;
          dimensions: Json;
          efficiency: Json;
          comfort?: Json | null;
          price: Json;
          images: string[];
          features: string[];
          extra_features?: string[] | null;
          warranty: Json;
          environmental_impact?: Json | null;
          heat_pump?: string | null;
          v2l?: string | null;
          turkey_status?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand?: string;
          model?: string;
          year?: number;
          type?: string;
          range?: number;
          battery_capacity?: number;
          charging_time?: Json;
          performance?: Json;
          dimensions?: Json;
          efficiency?: Json;
          comfort?: Json | null;
          price?: Json;
          images?: string[];
          features?: string[];
          extra_features?: string[] | null;
          warranty?: Json;
          environmental_impact?: Json | null;
          heat_pump?: string | null;
          v2l?: string | null;
          turkey_status?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
  };
} 