// 🛡️ Middleware مبسط - middleware.ts (في الجذر)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🔍 Middleware:', req.nextUrl.pathname) // للتتبع

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // التحقق من حالة المصادقة
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('👤 Session exists:', !!session) // للتتبع

    const isAuthPage = req.nextUrl.pathname === '/auth'
    const isProtectedRoute = ['/dashboard', '/course', '/profile', '/strategies'].some(
      route => req.nextUrl.pathname.startsWith(route)
    )

    // إذا كان المستخدم مسجل دخوله ويحاول الوصول لصفحة تسجيل الدخول
    if (session && isAuthPage) {
      const redirectTo = req.nextUrl.searchParams.get('redirectTo')
      console.log('🔄 Redirecting logged user from auth to:', redirectTo || '/dashboard')
      
      if (redirectTo && redirectTo.startsWith('/')) {
        return NextResponse.redirect(new URL(redirectTo, req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // إذا كان المستخدم غير مسجل دخوله ويحاول الوصول لصفحة محمية
    if (!session && isProtectedRoute) {
      console.log('🚫 Redirecting non-logged user to auth from:', req.nextUrl.pathname)
      const redirectUrl = new URL('/auth', req.url)
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Allowing access to:', req.nextUrl.pathname)
    return res

  } catch (error) {
    console.error('❌ Middleware error:', error)
    
    // في حالة الخطأ، السماح بالوصول للصفحات العامة
    const publicPages = ['/', '/auth']
    if (publicPages.includes(req.nextUrl.pathname)) {
      return res
    }
    
    // توجيه للمصادقة في حالة الخطأ مع الصفحات المحمية
    const redirectUrl = new URL('/auth', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}