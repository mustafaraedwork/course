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

interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
  isLocked: boolean
}

interface Chapter {
  id: number
  title: string
  description: string
  lessons: Lesson[]
  totalLessons: number
  completedLessons: number
  progress: number
  isExpanded: boolean
}

export default function CoursePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    checkUser()
    loadCourseData()
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

  const loadCourseData = () => {
    // بيانات تجريبية للكورس
    const courseData: Chapter[] = [
      {
        id: 1,
        title: 'مقدمة في التسويق الرقمي',
        description: 'تعرف على أساسيات التسويق الرقمي ومنصاته المختلفة',
        totalLessons: 3,
        completedLessons: 0,
        progress: 0,
        isExpanded: true,
        lessons: [
          { id: 1, title: 'ما هو التسويق الرقمي؟', duration: '15:30', completed: false, isLocked: false },
          { id: 2, title: 'منصات التسويق الرئيسية', duration: '22:15', completed: false, isLocked: true },
          { id: 3, title: 'وضع استراتيجية التسويق', duration: '18:45', completed: false, isLocked: true }
        ]
      },
      {
        id: 2,
        title: 'Facebook و Instagram Ads',
        description: 'تعلم إنشاء وإدارة الحملات الإعلانية على Facebook و Instagram',
        totalLessons: 5,
        completedLessons: 0,
        progress: 0,
        isExpanded: false,
        lessons: [
          { id: 4, title: 'إنشاء Business Manager', duration: '25:20', completed: false, isLocked: true },
          { id: 5, title: 'إعداد Facebook Pixel', duration: '20:15', completed: false, isLocked: true },
          { id: 6, title: 'إنشاء أول حملة إعلانية', duration: '35:30', completed: false, isLocked: true },
          { id: 7, title: 'أنواع الحملات المختلفة', duration: '28:45', completed: false, isLocked: true },
          { id: 8, title: 'تصميم الإعلانات الفعالة', duration: '32:10', completed: false, isLocked: true }
        ]
      },
      {
        id: 3,
        title: 'تحسين الحملات',
        description: 'تعلم كيفية قراءة الإحصائيات وتحسين أداء الحملات',
        totalLessons: 4,
        completedLessons: 0,
        progress: 0,
        isExpanded: false,
        lessons: [
          { id: 9, title: 'قراءة إحصائيات الحملات', duration: '30:25', completed: false, isLocked: true },
          { id: 10, title: 'تحسين الاستهداف', duration: '27:15', completed: false, isLocked: true },
          { id: 11, title: 'اختبارات A/B Testing', duration: '24:40', completed: false, isLocked: true },
          { id: 12, title: 'تحسين الميزانيات', duration: '22:55', completed: false, isLocked: true }
        ]
      },
      {
        id: 4,
        title: 'الاستراتيجيات المتقدمة',
        description: 'تقنيات متقدمة لزيادة العائد على الاستثمار',
        totalLessons: 6,
        completedLessons: 0,
        progress: 0,
        isExpanded: false,
        lessons: [
          { id: 13, title: 'Retargeting المتقدم', duration: '33:20', completed: false, isLocked: true },
          { id: 14, title: 'Lookalike Audiences', duration: '29:15', completed: false, isLocked: true },
          { id: 15, title: 'حملات التجارة الإلكترونية', duration: '41:30', completed: false, isLocked: true },
          { id: 16, title: 'تحليل ROI وKPIs', duration: '26:45', completed: false, isLocked: true },
          { id: 17, title: 'أتمتة الحملات', duration: '35:10', completed: false, isLocked: true },
          { id: 18, title: 'استراتيجيات التوسع', duration: '38:25', completed: false, isLocked: true }
        ]
      }
    ]
    
    setChapters(courseData)
  }

  const toggleChapter = (chapterId: number) => {
    setChapters(chapters.map(chapter => 
      chapter.id === chapterId 
        ? { ...chapter, isExpanded: !chapter.isExpanded }
        : chapter
    ))
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
              <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                أكاديمية التسويق الرقمي
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                لوحة التحكم
              </Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            كورس التسويق الرقمي الشامل
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            رحلة تعليمية شاملة من الصفر إلى الاحتراف في التسويق الرقمي
          </p>
          
          {/* Overall Progress */}
          <div className="bg-white rounded-lg p-6 shadow-sm border max-w-md mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-600">التقدم العام</span>
              <span className="text-sm font-medium text-blue-600">0%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">0 من 18 درس مكتمل</p>
          </div>
        </div>

        {/* Chapters List */}
        <div className="space-y-6">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              {/* Chapter Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleChapter(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {chapter.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{chapter.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-blue-600 font-medium">
                          {chapter.totalLessons} دروس
                        </span>
                        <span className="text-sm text-gray-500">
                          {chapter.completedLessons} مكتمل
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Progress Circle */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                        />
                        <path
                          d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${chapter.progress}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {chapter.progress}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Expand Icon */}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        chapter.isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              {chapter.isExpanded && (
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-2">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div 
                        key={lesson.id} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          lesson.isLocked 
                            ? 'bg-gray-100 border-gray-200 opacity-60' 
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {/* Status Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed 
                              ? 'bg-green-100 text-green-600' 
                              : lesson.isLocked 
                                ? 'bg-gray-200 text-gray-400'
                                : 'bg-blue-100 text-blue-600'
                          }`}>
                            {lesson.completed ? (
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : lesson.isLocked ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          <div>
                            <h4 className={`font-medium ${
                              lesson.isLocked ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {lessonIndex + 1}.{lesson.id - (chapter.id - 1) * 10} {lesson.title}
                            </h4>
                            <p className="text-sm text-gray-500">المدة: {lesson.duration}</p>
                          </div>
                        </div>
                        
                        {/* تم تحديث روابط الدروس هنا */}
                        {!lesson.isLocked && (
                          <Link href={`/course/${chapter.id}/${lesson.id}`}>
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 hover:text-blue-700">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              {lesson.completed ? 'إعادة المشاهدة' : 'مشاهدة الدرس'}
                            </button>
                          </Link>
                        )}
                        
                        {/* للدروس المقفلة */}
                        {lesson.isLocked && (
                          <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            مقفل
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← العودة للوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  )
}