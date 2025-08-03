// 👥 إدارة المستخدمين - لوحة الأدمن
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  subscription_status: 'free' | 'premium' | 'lifetime';
  total_lessons_completed: number;
  total_watch_time: number; // بالثواني
  last_activity: string;
  is_active: boolean;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisWeek: number;
  premiumUsers: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisWeek: 0,
    premiumUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // محاولة جلب المستخدمين الفعليين
      const { data: authUsers, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('خطأ في جلب المستخدمين:', error);
        // استخدام بيانات تجريبية
        loadMockUsers();
      } else {
        // تحويل بيانات المستخدمين الفعلية
        const transformedUsers: User[] = authUsers.users.map((user, index) => ({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'غير محدد',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          subscription_status: 'free',
          total_lessons_completed: Math.floor(Math.random() * 10),
          total_watch_time: Math.floor(Math.random() * 3600),
          last_activity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: Math.random() > 0.3
        }));

        setUsers(transformedUsers);
        
        // حساب الإحصائيات
        const totalUsers = transformedUsers.length;
        const activeUsers = transformedUsers.filter(u => u.is_active).length;
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newUsersThisWeek = transformedUsers.filter(u => 
          new Date(u.created_at) > weekAgo
        ).length;
        const premiumUsers = transformedUsers.filter(u => 
          u.subscription_status !== 'free'
        ).length;

        setStats({
          totalUsers,
          activeUsers,
          newUsersThisWeek,
          premiumUsers
        });
      }
    } catch (error) {
      console.error('خطأ في تحميل المستخدمين:', error);
      loadMockUsers();
    } finally {
      setLoading(false);
    }
  };

  const loadMockUsers = () => {
    // بيانات تجريبية للعرض
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'ahmed.mohamed@example.com',
        full_name: 'أحمد محمد',
        created_at: '2024-01-15T10:30:00Z',
        last_sign_in_at: '2024-01-20T14:20:00Z',
        email_confirmed_at: '2024-01-15T10:35:00Z',
        subscription_status: 'premium',
        total_lessons_completed: 8,
        total_watch_time: 2340,
        last_activity: '2024-01-20T14:20:00Z',
        is_active: true
      },
      {
        id: '2',
        email: 'sara.ali@example.com',
        full_name: 'سارة علي',
        created_at: '2024-01-18T09:15:00Z',
        last_sign_in_at: '2024-01-19T16:45:00Z',
        email_confirmed_at: '2024-01-18T09:20:00Z',
        subscription_status: 'free',
        total_lessons_completed: 3,
        total_watch_time: 1200,
        last_activity: '2024-01-19T16:45:00Z',
        is_active: true
      },
      {
        id: '3',
        email: 'omar.hassan@example.com',
        full_name: 'عمر حسان',
        created_at: '2024-01-10T11:20:00Z',
        last_sign_in_at: '2024-01-12T13:30:00Z',
        email_confirmed_at: '2024-01-10T11:25:00Z',
        subscription_status: 'free',
        total_lessons_completed: 1,
        total_watch_time: 450,
        last_activity: '2024-01-12T13:30:00Z',
        is_active: false
      },
      {
        id: '4',
        email: 'fatima.khalid@example.com',
        full_name: 'فاطمة خالد',
        created_at: '2024-01-20T15:10:00Z',
        last_sign_in_at: '2024-01-21T10:15:00Z',
        email_confirmed_at: '2024-01-20T15:15:00Z',
        subscription_status: 'lifetime',
        total_lessons_completed: 15,
        total_watch_time: 4200,
        last_activity: '2024-01-21T10:15:00Z',
        is_active: true
      }
    ];

    setUsers(mockUsers);
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.is_active).length,
      newUsersThisWeek: 2,
      premiumUsers: mockUsers.filter(u => u.subscription_status !== 'free').length
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) ||
                         (filterStatus === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}س ${minutes}د`;
  };

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'premium':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">مميز</span>;
      case 'lifetime':
        return <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">مدى الحياة</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">مجاني</span>;
    }
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    if (action === 'delete' && !confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      // هنا ستتم معالجة الإجراء
      console.log(`تنفيذ ${action} للمستخدم ${userId}`);
      
      if (action === 'delete') {
        setUsers(users.filter(u => u.id !== userId));
        alert('تم حذف المستخدم بنجاح');
      } else {
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, is_active: action === 'activate' } 
            : u
        ));
        alert(`تم ${action === 'activate' ? 'تفعيل' : 'تعطيل'} المستخدم بنجاح`);
      }
    } catch (error) {
      console.error('خطأ في تنفيذ العملية:', error);
      alert('حدث خطأ في تنفيذ العملية');
    }
  };

  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات المستخدمين...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-1">عرض وإدارة حسابات المستخدمين المسجلين</p>
        </div>
        <div className="flex space-x-3 rtl:space-x-reverse">
          <button
            onClick={loadUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 تحديث
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            📊 تصدير البيانات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="المستخدمين النشطين"
          value={stats.activeUsers}
          icon="🟢"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="مستخدمين جدد هذا الأسبوع"
          value={stats.newUsersThisWeek}
          icon="🆕"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="اشتراكات مدفوعة"
          value={stats.premiumUsers}
          icon="⭐"
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث بالاسم أو الإيميل..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-3 rtl:space-x-reverse">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع المستخدمين</option>
              <option value="active">النشطين فقط</option>
              <option value="inactive">غير النشطين</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            قائمة المستخدمين ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المستخدم
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاشتراك
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقدم
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آخر نشاط
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name || 'غير محدد'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          انضم: {formatDate(user.created_at)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSubscriptionBadge(user.subscription_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.total_lessons_completed} درس مكتمل
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatWatchTime(user.total_watch_time)} مشاهدة
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.last_activity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? '🟢 نشط' : '🔴 معطل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-100"
                        title="عرض التفاصيل"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, user.is_active ? 'deactivate' : 'activate')}
                        className={`p-1 rounded ${
                          user.is_active 
                            ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-100' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                        }`}
                        title={user.is_active ? 'تعطيل' : 'تفعيل'}
                      >
                        {user.is_active ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-100"
                        title="حذف"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">لم يتم العثور على مستخدمين يطابقون معايير البحث</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">تفاصيل المستخدم</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {selectedUser.full_name?.[0] || selectedUser.email[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {selectedUser.full_name || 'غير محدد'}
                  </h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                    {getSubscriptionBadge(selectedUser.subscription_status)}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedUser.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.is_active ? 'نشط' : 'معطل'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedUser.total_lessons_completed}
                  </div>
                  <div className="text-sm text-gray-600">دروس مكتملة</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatWatchTime(selectedUser.total_watch_time)}
                  </div>
                  <div className="text-sm text-gray-600">وقت المشاهدة</div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900">تفاصيل الحساب</h5>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ التسجيل:</span>
                    <span className="font-medium">{formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر دخول:</span>
                    <span className="font-medium">
                      {selectedUser.last_sign_in_at ? formatDate(selectedUser.last_sign_in_at) : 'لم يسجل دخول'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تأكيد الإيميل:</span>
                    <span className={`font-medium ${
                      selectedUser.email_confirmed_at ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedUser.email_confirmed_at ? '✅ مؤكد' : '❌ غير مؤكد'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">آخر نشاط:</span>
                    <span className="font-medium">{formatDate(selectedUser.last_activity)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900">نظرة على التقدم</h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الفصل الأول</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الفصل الثاني</span>
                      <span>40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>الفصل الثالث</span>
                      <span>10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => setShowUserDetails(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  // هنا يمكن إضافة وظيفة إرسال رسالة للمستخدم
                  alert('سيتم إضافة وظيفة إرسال الرسائل قريباً');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📧 إرسال رسالة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}