// 📊 تحديث صفحة Dashboard - app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useProgress } from '@/hooks/useProgress';
import LoadingSpinner from '@/components/LoadingSpinner';

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

  // 🆕 استخدام الهوك الجديد للحصول على البيانات الفعلية
  const { 
    progressData, 
    loading: progressLoading, 
    formatWatchTime,
    getAchievements 
  } = useProgress(user?.id)

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

  if (loading || progressLoading) {
    return <LoadingSpinner fullScreen text="جارٍ تحميل لوحة التحكم..." />
  }

  // 🆕 الحصول على الإنجازات
  const achievements = getAchievements()

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
          
          {/* 🆕 شريط التقدم العام */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-100">التقدم العام</span>
              <span className="text-white font-bold">
                {Math.round(progressData.completionPercentage)}%
              </span>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressData.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid - 🆕 استخدام البيانات الفعلية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* التقدم العام */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">التقدم العام</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(progressData.completionPercentage)}%
                </p>
              </div>
            </div>
          </div>

          {/* الدروس المكتملة - 🆕 بيانات فعلية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الدروس المكتملة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.completedLessons} / {progressData.totalLessons}
                </p>
              </div>
            </div>
          </div>

          {/* الوقت المستغرق - 🆕 بيانات فعلية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الوقت المستغرق</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatWatchTime(progressData.totalWatchTime)}
                </p>
              </div>
            </div>
          </div>

          {/* النقاط - 🆕 بيانات فعلية */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">النقاط</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressData.totalPoints}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 إضافة قسم للإنجازات */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إنجازاتك الأخيرة 🎉</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="text-3xl mr-3">{achievement.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🆕 إضافة معلومات الـ Streak */}
        {progressData.currentStreak > 0 && (
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center">
              <span className="text-4xl mr-4">🔥</span>
              <div>
                <h2 className="text-2xl font-bold">
                  {progressData.currentStreak} أيام متتالية!
                </h2>
                <p className="text-orange-100">
                  أداء رائع! حافظ على هذا الإلتزام المميز
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* ابدأ الكورس */}
          <Link href="/course">
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mr-3">
                  {progressData.completedLessons === 0 ? 'ابدأ الكورس' : 'متابعة التعلم'}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                {progressData.completedLessons === 0 
                  ? 'ابدأ رحلتك في تعلم التسويق الرقمي'
                  : `متابعة من حيث توقفت - ${progressData.completedLessons} دروس مكتملة`
                }
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

        {/* 🆕 Recent Activity - إذا كان هناك تقدم */}
        {progressData.completedLessons > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">النشاط الأخير</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 mr-3">✅</span>
                <div>
                  <p className="text-gray-900 font-medium">أكملت {progressData.completedLessons} درس</p>
                  <p className="text-gray-500 text-sm">إجمالي وقت المشاهدة: {formatWatchTime(progressData.totalWatchTime)}</p>
                </div>
              </div>
              
              {progressData.totalPoints > 0 && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-3">🏆</span>
                  <div>
                    <p className="text-gray-900 font-medium">حصلت على {progressData.totalPoints} نقطة</p>
                    <p className="text-gray-500 text-sm">من خلال حل الاختبارات بنجاح</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}