'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/auth'
        return
      }
      
      setUser(user as User)
    } catch (error) {
      console.error('خطأ في التحقق من المستخدم:', error)
      window.location.href = '/auth'
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                أكاديمية التسويق الرقمي
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                مرحباً، {user?.user_metadata?.full_name || user?.email}
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            مرحباً بك، {user?.user_metadata?.full_name || 'صديقي'}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            جاهز لمتابعة رحلتك التعليمية في التسويق الرقمي؟
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* التقدم العام */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">التقدم العام</p>
                <p className="text-2xl font-bold text-gray-900">0%</p>
              </div>
            </div>
          </div>

          {/* الدروس المكتملة */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الدروس المكتملة</p>
                <p className="text-2xl font-bold text-gray-900">0 / 18</p>
              </div>
            </div>
          </div>

          {/* الوقت المستغرق */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الوقت المستغرق</p>
                <p className="text-2xl font-bold text-gray-900">0 ساعة</p>
              </div>
            </div>
          </div>

          {/* النقاط */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">النقاط</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* متابعة التعلم */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              متابعة التعلم
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  ابدأ رحلتك التعليمية
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  مرحباً بك في أكاديمية التسويق الرقمي! ابدأ بالفصل الأول لتتعلم أساسيات التسويق الرقمي.
                </p>
                <Link 
                  href="/course"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ابدأ الكورس
                  <span className="mr-2">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* الفصول */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              فصول الكورس
            </h3>
            <div className="space-y-3">
              {[
                { id: 1, title: 'مقدمة في التسويق الرقمي', lessons: 3, progress: 0 },
                { id: 2, title: 'Facebook و Instagram Ads', lessons: 5, progress: 0 },
                { id: 3, title: 'تحسين الحملات', lessons: 4, progress: 0 },
                { id: 4, title: 'الاستراتيجيات المتقدمة', lessons: 6, progress: 0 }
              ].map((chapter) => (
                <div key={chapter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                    <p className="text-sm text-gray-600">{chapter.lessons} دروس</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${chapter.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">{chapter.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/course" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <span className="text-4xl mb-4 block">📚</span>
              <h3 className="font-semibold text-gray-900 mb-2">الكورس الكامل</h3>
              <p className="text-gray-600 text-sm">اطلع على جميع فصول ودروس الكورس</p>
            </div>
          </Link>

          <Link 
            href="/strategies" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="font-semibold text-gray-900 mb-2">الاستراتيجيات</h3>
              <p className="text-gray-600 text-sm">استراتيجيات جاهزة للتطبيق</p>
            </div>
          </Link>

          <Link 
            href="/profile" 
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <span className="text-4xl mb-4 block">👤</span>
              <h3 className="font-semibold text-gray-900 mb-2">الملف الشخصي</h3>
              <p className="text-gray-600 text-sm">إدارة حسابك وإعداداتك</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}