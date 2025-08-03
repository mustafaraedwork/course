// 📚 إدارة المحتوى - رفع الكورسات والدروس
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  is_active: boolean;
  created_at: string;
  chapters_count: number;
  lessons_count: number;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons_count: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  order_index: number;
  is_free: boolean;
}

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState<'courses' | 'chapters' | 'lessons'>('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    thumbnail_url: '',
    is_active: true
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    video_url: '',
    chapter_id: '',
    duration: 0,
    is_free: false,
    notes: '',
    tips: ''
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (activeTab === 'courses') {
      loadCourses();
    } else if (activeTab === 'lessons') {
      loadLessons();
    }
  }, [activeTab]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      // بيانات تجريبية للكورسات
      setCourses([
        {
          id: '1',
          title: 'التسويق الرقمي الشامل',
          description: 'كورس شامل لتعلم التسويق الرقمي من الصفر',
          is_active: true,
          created_at: '2024-01-15',
          chapters_count: 4,
          lessons_count: 18
        }
      ]);
    } catch (error) {
      console.error('خطأ في تحميل الكورسات:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      setLoading(true);
      // بيانات تجريبية للدروس
      setLessons([
        {
          id: '1',
          title: 'ما هو التسويق الرقمي؟',
          description: 'مقدمة شاملة عن التسويق الرقمي',
          video_url: '/videos/lesson1.mp4',
          duration: 930, // 15:30
          order_index: 1,
          is_free: true
        },
        {
          id: '2',
          title: 'منصات التسويق الرئيسية',
          description: 'نظرة على أهم منصات التسويق الرقمي',
          video_url: '/videos/lesson2.mp4',
          duration: 1335, // 22:15
          order_index: 2,
          is_free: false
        },
        {
          id: '3',
          title: 'إنشاء Business Manager',
          description: 'خطوات إنشاء وإعداد Facebook Business Manager',
          video_url: '/videos/lesson3.mp4',
          duration: 1520, // 25:20
          order_index: 3,
          is_free: false
        }
      ]);
    } catch (error) {
      console.error('خطأ في تحميل الدروس:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    try {
      setLoading(true);
      
      // هنا ستتم إضافة الكورس لقاعدة البيانات
      const { data, error } = await supabase
        .from('courses')
        .insert([newCourse])
        .select();

      if (error) {
        console.error('خطأ في إضافة الكورس:', error);
        alert('حدث خطأ في إضافة الكورس');
        return;
      }

      alert('تم إضافة الكورس بنجاح!');
      setShowAddForm(false);
      setNewCourse({ title: '', description: '', thumbnail_url: '', is_active: true });
      loadCourses();
      
    } catch (error) {
      console.error('خطأ:', error);
      alert('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async () => {
    try {
      setLoading(true);
      
      // هنا ستتم إضافة الدرس لقاعدة البيانات
      console.log('إضافة درس جديد:', newLesson);
      
      // محاكاة النجاح
      alert('تم إضافة الدرس بنجاح!');
      setShowAddForm(false);
      setNewLesson({
        title: '',
        description: '',
        video_url: '',
        chapter_id: '',
        duration: 0,
        is_free: false,
        notes: '',
        tips: ''
      });
      loadLessons();
      
    } catch (error) {
      console.error('خطأ في إضافة الدرس:', error);
      alert('حدث خطأ في إضافة الدرس');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const TabButton = ({ tab, label, isActive, onClick }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المحتوى</h1>
          <p className="text-gray-600 mt-1">رفع وإدارة الكورسات والدروس التعليمية</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ➕ إضافة جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 rtl:space-x-reverse">
        <TabButton
          tab="courses"
          label="الكورسات"
          isActive={activeTab === 'courses'}
          onClick={() => setActiveTab('courses')}
        />
        <TabButton
          tab="chapters"
          label="الفصول"
          isActive={activeTab === 'chapters'}
          onClick={() => setActiveTab('chapters')}
        />
        <TabButton
          tab="lessons"
          label="الدروس"
          isActive={activeTab === 'lessons'}
          onClick={() => setActiveTab('lessons')}
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">الكورسات المتاحة</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري التحميل...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <h4 className="text-lg font-semibold text-gray-900">{course.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            course.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {course.is_active ? 'نشط' : 'معطل'}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">{course.description}</p>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mt-2 text-sm text-gray-500">
                          <span>📚 {course.chapters_count} فصل</span>
                          <span>🎥 {course.lessons_count} درس</span>
                          <span>📅 {course.created_at}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                          ✏️
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">الدروس المتاحة</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري التحميل...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                  <div key={lesson.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-lg">🎥</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          lesson.is_free 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {lesson.is_free ? 'مجاني' : 'مدفوع'}
                        </span>
                      </div>
                      <div className="flex space-x-1 rtl:space-x-reverse">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          ✏️
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-100 rounded">
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lesson.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>⏱️ {formatDuration(lesson.duration)}</span>
                      <span>#{lesson.order_index}</span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'chapters' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">قسم الفصول قيد التطوير</h3>
          <p className="text-gray-600">سيتم إضافة هذا القسم قريباً لإدارة فصول الكورسات</p>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {activeTab === 'courses' ? 'إضافة كورس جديد' : 'إضافة درس جديد'}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'courses' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الكورس
                    </label>
                    <input
                      type="text"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: التسويق الرقمي المتقدم"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الكورس
                    </label>
                    <textarea
                      value={newCourse.description}
                      onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="وصف مختصر عن محتوى الكورس..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الصورة المصغرة
                    </label>
                    <input
                      type="url"
                      value={newCourse.thumbnail_url}
                      onChange={(e) => setNewCourse({...newCourse, thumbnail_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={newCourse.is_active}
                      onChange={(e) => setNewCourse({...newCourse, is_active: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
                      نشط (متاح للطلاب)
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الدرس
                    </label>
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: كيفية إنشاء حملة إعلانية فعالة"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الدرس
                    </label>
                    <textarea
                      value={newLesson.description}
                      onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="وصف مختصر عن محتوى الدرس..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الفيديو
                    </label>
                    <input
                      type="url"
                      value={newLesson.video_url}
                      onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة الدرس (بالثواني)
                    </label>
                    <input
                      type="number"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({...newLesson, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="930"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_free_lesson"
                      checked={newLesson.is_free}
                      onChange={(e) => setNewLesson({...newLesson, is_free: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_free_lesson" className="mr-2 block text-sm text-gray-900">
                      درس مجاني (متاح للجميع)
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3 rtl:space-x-reverse">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={activeTab === 'courses' ? handleAddCourse : handleAddLesson}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}