// 🔧 إعداد Supabase مُصحح - lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ✅ للاستخدام العام (استخدم هذا في الصفحات التي لا تحتاج مصادقة)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ✅ مهم لحفظ الجلسة
    storageKey: 'sb-auth-token', // ✅ مهم للكوكيز
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  }
})

// ✅ للاستخدام في المكونات (استخدم هذا في الصفحات التي تحتاج مصادقة)
export const createSupabaseClient = () => {
  return createClientComponentClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  })
}

// Database Types (محدثة)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url?: string
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          avatar_url?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string
          subscription_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description?: string
          thumbnail_url?: string
          price: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          thumbnail_url?: string
          price?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string
          price?: number
          is_active?: boolean
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          title: string
          description?: string
          order_index: number
          is_active: boolean
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string
          order_index: number
          is_active?: boolean
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          order_index?: number
          is_active?: boolean
        }
      }
      lessons: {
        Row: {
          id: string
          chapter_id: string
          title: string
          description?: string
          video_url: string
          duration: number
          order_index: number
          is_free: boolean
          notes?: string
          tips?: string
        }
        Insert: {
          id?: string
          chapter_id: string
          title: string
          description?: string
          video_url: string
          duration?: number
          order_index: number
          is_free?: boolean
          notes?: string
          tips?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          title?: string
          description?: string
          video_url?: string
          duration?: number
          order_index?: number
          is_free?: boolean
          notes?: string
          tips?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          last_position: number
          watch_time: number
          quiz_score: number
          quiz_attempts: number
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          last_position?: number
          watch_time?: number
          quiz_score?: number
          quiz_attempts?: number
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          last_position?: number
          watch_time?: number
          quiz_score?: number
          quiz_attempts?: number
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}