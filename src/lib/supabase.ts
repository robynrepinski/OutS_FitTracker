import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          weight: number
          height: number
          fitness_goal: string
          weight_unit: string
          height_unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          gender: string
          weight: number
          height: number
          fitness_goal: string
          weight_unit: string
          height_unit: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          gender?: string
          weight?: number
          height?: number
          fitness_goal?: string
          weight_unit?: string
          height_unit?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}