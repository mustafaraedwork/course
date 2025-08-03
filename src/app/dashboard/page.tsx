// 📊 لوحة التحكم البسيطة - app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LoadingSpinner from '@/components/LoadingSpinner'

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
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    let isMounted = true

    const checkUserAccess = async () => {
      try {
        console.log('🔍 Dashboard - checking user access...')
        
        // انتظار قصير للسماح للجلسة بالتحميل
        await new Promise(resolve => setTimeout(resolve, 200))

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('خطأ في الجلسة')
        }

        if (!isMounted) return

        if (!session?.user) {
          console.log('❌ No user session, redirecting to auth...')
          // استخدام window.location بدلاً من router.push
          window.location.href = '/auth?redirectTo=/dashboard'
          return
        }
        
        console.log('✅ User session found:', session.user.email)
        setUser(session.user as User)
        
      } catch (error) {
        console.error('خطأ في التحقق من المستخدم:', error)
        if (isMounted) {
          setError('خطأ في التحقق من صحة الدخول')
          // في حالة الخطأ، إعادة توجيه للمصادقة
          setTimeout(() => {
            window.location.href = '/auth?redirectTo=/dashboard'
          }, 2000)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkUserAccess()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      
      // مسح أي بيانات محلية
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      
      // إعادة توجيه للصفحة الرئيسية
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/'
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen text="جارٍ تحميل لوحة التحكم..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-4">سيتم إعادة توجيهك لصفحة تسجيل الدخول...</p>
          <Link href="/auth" className="text-blue-600 hover:text-blue-800">
            انقر هنا إذا لم يتم التوجيه تلقائياً
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
          
          {/* شريط التقدم العام */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100">التقدم العام</span>
              <span className="text-white font-bold">0%</span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              />
            </div>
          </div>
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
                <p className="text-2xl font-bold text-gray-900">0 دقيقة</p>
              </div>
            </div>
          </div>

          {/* النقاط */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">النقاط</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* ابدأ الكورس */}
          <Link href="/course">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mr-3">ابدأ الكورس</h3>
              </div>
              <p className="text-gray-600 text-sm">
                ابدأ رحلتك في تعلم التسويق الرقمي
              </p>
            </div>
          </Link>

          {/* مكتبة الاستراتيجيات */}
          <Link href="/strategies">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mr-3">مكتبة الاستراتيجيات</h3>
              </div>
              <p className="text-gray-600 text-sm">
                استراتيجيات جاهزة للتطبيق في مشاريعك
              </p>
            </div>
          </Link>

          {/* الملف الشخصي */}
          <Link href="/profile">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mr-3">الملف الشخصي</h3>
              </div>
              <p className="text-gray-600 text-sm">
                إعدادات الحساب وإحصائيات التعلم
              </p>
            </div>
          </Link>
        </div>

        {/* إرشادات للبداية */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">مرحباً بك في أكاديمية التسويق الرقمي! 🎉</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">خطوات البداية:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>1. ابدأ بالفصل الأول: مقدمة في التسويق الرقمي</li>
                <li>2. اتبع الدروس بالترتيب للحصول على أفضل النتائج</li>
                <li>3. لا تنس حل الاختبارات في نهاية كل درس</li>
                <li>4. طبق ما تعلمته باستخدام الاستراتيجيات المقدمة</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">نصائح للنجاح:</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• خصص وقتاً ثابتاً يومياً للتعلم</li>
                <li>• دون الملاحظات المهمة أثناء المشاهدة</li>
                <li>• لا تتردد في إعادة مشاهدة الدروس</li>
                <li>• طبق ما تعلمته على مشاريع حقيقية</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}