// 🔐 صفحة تسجيل الدخول المحدثة - app/auth/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') // 🆕 الحصول على الصفحة المطلوبة

  // 🆕 التحقق من المستخدم عند تحميل الصفحة
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      // إذا كان مسجل دخوله، اذهب للصفحة المطلوبة أو Dashboard
      const destination = redirectTo || '/dashboard'
      window.location.href = destination
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // تسجيل الدخول
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        setMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...')
        
        // 🆕 التوجيه للصفحة المطلوبة أو Dashboard
        setTimeout(() => {
          const destination = redirectTo || '/dashboard'
          window.location.href = destination
        }, 1500)
        
      } else {
        // إنشاء حساب جديد
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })
        
        if (error) throw error
        
        setMessage('تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني.')
      }
    } catch (error: any) {
      setMessage('خطأ: ' + error.message)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h2 className="text-3xl font-bold text-blue-600">
            أكاديمية التسويق الرقمي
          </h2>
        </Link>
        <p className="mt-6 text-center text-lg text-gray-600">
          {isLogin ? 'مرحباً بك مرة أخرى!' : 'انضم لآلاف الطلاب المتميزين'}
        </p>
        
        {/* 🆕 رسالة توضيحية إذا كان يحاول الوصول لصفحة محمية */}
        {redirectTo && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              يرجى تسجيل الدخول للوصول إلى الصفحة المطلوبة
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Toggle Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              حساب جديد
            </button>
          </div>

          {/* Messages */}
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('خطأ') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <div className="mt-1">
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required={!isLogin}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-right"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm">
              ← العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}