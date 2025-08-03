// 📚 صفحة الدرس - app/course/[chapter]/[lesson]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import VideoPlayer from '@/components/VideoPlayer';
import Quiz from '@/components/Quiz';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  notes?: string;
  tips?: string;
  order_index: number;
}

interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [watchProgress, setWatchProgress] = useState(0);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadLessonData();
  }, [params.chapter, params.lesson]);

  const loadLessonData = async () => {
    try {
      setLoading(true);

      // تحميل بيانات الدرس
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          chapter:chapters(
            id,
            title,
            lessons(id, title, order_index)
          )
        `)
        .eq('id', params.lesson)
        .single();

      if (lessonError) throw lessonError;

      setLesson(lessonData);
      setChapter(lessonData.chapter);

      // تحميل الأسئلة
      const { data: questionsData } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', params.lesson)
        .order('order_index');

      setQuestions(questionsData || []);

      // تحقق من حالة الإكمال
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('completed, watch_time')
          .eq('user_id', user.id)
          .eq('lesson_id', params.lesson)
          .single();

        if (progressData) {
          setVideoCompleted(progressData.completed);
          if (lessonData.duration > 0) {
            setWatchProgress((progressData.watch_time / lessonData.duration) * 100);
          }
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoProgress = (currentTime: number, percentage: number) => {
    setWatchProgress(percentage);
  };

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    if (questions.length > 0) {
      setShowQuiz(true);
    } else {
      // الانتقال للدرس التالي إذا لم توجد أسئلة
      goToNextLesson();
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setShowQuiz(false);
    if (passed) {
      // حفظ نتيجة الكويز
      saveQuizResult(score);
      // الانتقال للدرس التالي
      setTimeout(() => {
        goToNextLesson();
      }, 2000);
    }
  };

  const saveQuizResult = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson?.id,
          quiz_score: score,
          quiz_attempts: 1, // يمكن تحسينها لتتريعتد المحاولات
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
  };

  const goToNextLesson = () => {
    if (!chapter || !lesson) return;

    const currentIndex = chapter.lessons.findIndex(l => l.id === lesson.id);
    const nextLesson = chapter.lessons[currentIndex + 1];

    if (nextLesson) {
      router.push(`/course/${params.chapter}/${nextLesson.id}`);
    } else {
      // العودة لصفحة الكورس إذا انتهت الدروس
      router.push('/course');
    }
  };

  const goToPreviousLesson = () => {
    if (!chapter || !lesson) return;

    const currentIndex = chapter.lessons.findIndex(l => l.id === lesson.id);
    const previousLesson = chapter.lessons[currentIndex - 1];

    if (previousLesson) {
      router.push(`/course/${params.chapter}/${previousLesson.id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الدرس غير موجود</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => router.push('/course')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
                <p className="text-sm text-gray-500">{chapter?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="text-sm text-gray-500">
                التقدم: {Math.round(watchProgress)}%
              </div>
              {videoCompleted && (
                <div className="flex items-center text-green-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  مكتمل
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* مشغل الفيديو والمحتوى */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <VideoPlayer
                videoUrl={lesson.video_url}
                lessonId={lesson.id}
                lessonTitle={lesson.title}
                duration={lesson.duration}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
              />
            </div>

            {/* وصف الدرس */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{lesson.title}</h2>
              <p className="text-gray-700 mb-6">{lesson.description}</p>
              
              {lesson.notes && (
                <div className="bg-blue-50 border-r-4 border-blue-400 p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">ملاحظات المدرب</h3>
                  <p className="text-blue-800">{lesson.notes}</p>
                </div>
              )}

              {lesson.tips && (
                <div className="bg-green-50 border-r-4 border-green-400 p-4">
                  <h3 className="font-semibold text-green-900 mb-2">نصائح مهمة</h3>
                  <p className="text-green-800">{lesson.tips}</p>
                </div>
              )}
            </div>

            {/* أزرار التنقل */}
            <div className="flex justify-between">
              <button
                onClick={goToPreviousLesson}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={!chapter?.lessons || chapter.lessons.findIndex(l => l.id === lesson.id) === 0}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                الدرس السابق
              </button>

              <button
                onClick={() => setShowQuiz(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!videoCompleted || questions.length === 0}
              >
                {questions.length > 0 ? 'بدء الاختبار' : 'إنهاء الدرس'}
              </button>

              <button
                onClick={goToNextLesson}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={!videoCompleted}
              >
                الدرس التالي
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* الشريط الجانبي */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">دروس {chapter?.title}</h3>
              <div className="space-y-2">
                {chapter?.lessons?.map((chapterLesson, index) => (
                  <button
                    key={chapterLesson.id}
                    onClick={() => router.push(`/course/${params.chapter}/${chapterLesson.id}`)}
                    className={`w-full text-right p-3 rounded-lg transition-colors ${
                      chapterLesson.id === lesson.id
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{index + 1}. {chapterLesson.title}</span>
                      <div className="flex items-center">
                        {chapterLesson.id === lesson.id && videoCompleted && (
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* مكون الاختبار */}
      {showQuiz && questions.length > 0 && (
        <Quiz
          questions={questions}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </div>
  );
}