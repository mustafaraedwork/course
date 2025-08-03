// 🎛️ لوحة تحكم الأدمن - المكون الأساسي
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    role?: string;
  };
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session?.user) {
        window.location.href = '/auth?redirectTo=/admin';
        return;
      }

      // تحقق من صلاحيات الأدمن (يمكن تحسينها لاحقاً)
      const adminEmails = [
        'alagele1998@gmail.com', // ضع إيميلك هنا
        'alagelemr@gmail.com' // ضع إيميلات الأدمن المسموحين
      ];

      if (!adminEmails.includes(session.user.email || '')) {
        alert('ليس لديك صلاحيات للوصول لهذه الصفحة');
        window.location.href = '/dashboard';
        return;
      }

      setUser(session.user as AdminUser);
    } catch (error) {
      console.error('خطأ في التحقق من صلاحيات الأدمن:', error);
      window.location.href = '/auth';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // قائمة التنقل
  const navigationItems = [
    {
      name: 'الرئيسية',
      href: '/admin',
      icon: '🏠',
      current: pathname === '/admin'
    },
    {
      name: 'المستخدمين',
      href: '/admin/users',
      icon: '👥',
      current: pathname.startsWith('/admin/users')
    },
    {
      name: 'المحتوى',
      href: '/admin/content',
      icon: '📚',
      current: pathname.startsWith('/admin/content')
    },
    {
      name: 'الاستراتيجيات',
      href: '/admin/strategies',
      icon: '🎯',
      current: pathname.startsWith('/admin/strategies')
    },
    {
      name: 'التحليلات',
      href: '/admin/analytics',
      icon: '📈',
      current: pathname.startsWith('/admin/analytics')
    },
    {
      name: 'الإعدادات',
      href: '/admin/settings',
      icon: '⚙️',
      current: pathname.startsWith('/admin/settings')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎛️</span>
              </div>
              <span className="mr-3 text-lg font-semibold text-gray-900">لوحة الأدمن</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="ml-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Admin Info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user?.user_metadata?.full_name?.[0] || user?.email?.[0].toUpperCase()}
                </span>
              </div>
              <div className="mr-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.full_name || 'الأدمن'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full text-right text-sm text-red-600 hover:text-red-700 font-medium"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'mr-64' : 'mr-0'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="mr-4 text-xl font-semibold text-gray-900">
                لوحة تحكم الأدمن
              </h1>
            </div>

            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* إشعارات */}
              <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100">
                <span className="relative">
                  🔔
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </span>
              </button>

              {/* رابط للموقع الرئيسي */}
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
              >
                عرض الموقع
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}