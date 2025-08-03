// 📊 Hook إدارة التقدم المُصحح - hooks/useProgress.ts
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  totalWatchTime: number;
  totalPoints: number;
  completionPercentage: number;
  currentStreak: number;
}

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  watchTime: number;
  lastPosition: number;
  quizScore: number;
  completedAt?: string;
}

export const useProgress = (userId: string | undefined) => { // 🔧 إصلاح نوع البيانات
  const [progressData, setProgressData] = useState<ProgressData>({
    totalLessons: 0,
    completedLessons: 0,
    totalWatchTime: 0,
    totalPoints: 0,
    completionPercentage: 0,
    currentStreak: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (userId) {
      loadProgressData();
    } else {
      setLoading(false); // 🔧 إيقاف التحميل إذا لم يكن هناك مستخدم
    }
  }, [userId]);

  const loadProgressData = async () => {
    if (!userId) { // 🔧 فحص إضافي
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // الحصول على إجمالي عدد الدروس
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('id');

      if (lessonsError) throw lessonsError;

      const totalLessons = lessonsData?.length || 0;

      // الحصول على تقدم المستخدم
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;

      // حساب الإحصائيات
      const completedLessons = progressData?.filter(p => p.completed).length || 0;
      const totalWatchTime = progressData?.reduce((sum, p) => sum + (p.watch_time || 0), 0) || 0;
      const totalPoints = progressData?.reduce((sum, p) => sum + (p.quiz_score || 0), 0) || 0;
      const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      // حساب streak الحالي (الأيام المتتالية للدراسة)
      const currentStreak = await calculateStreak(userId); // ✅ الآن userId مضمون أنه string

      setProgressData({
        totalLessons,
        completedLessons,
        totalWatchTime,
        totalPoints,
        completionPercentage,
        currentStreak
      });

      // تحديث ملف المستخدم
      await updateUserProfile(userId, totalWatchTime, totalPoints); // ✅ الآن userId مضمون أنه string

    } catch (err) {
      console.error('Error loading progress:', err);
      setError('حدث خطأ في تحميل بيانات التقدم');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = async (userId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false });

      if (error || !data || data.length === 0) return 0;

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const completedDates = data.map(item => {
        const date = new Date(item.completed_at!);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      });

      // إزالة التكرارات وترتيب التواريخ
      const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => b - a);

      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = currentDate.getTime() - (i * 24 * 60 * 60 * 1000);
        
        if (uniqueDates[i] === expectedDate) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  };

  const updateUserProfile = async (userId: string, watchTime: number, points: number) => {
    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          total_watch_time: watchTime,
          total_points: points,
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const markLessonComplete = async (lessonId: string, watchTime: number, quizScore?: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          watch_time: watchTime,
          quiz_score: quizScore || 0,
          updated_at: new Date().toISOString()
        });

      // إعادة تحميل البيانات
      await loadProgressData();
      
      return true;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      return false;
    }
  };

  const updateLessonProgress = async (
    lessonId: string, 
    currentTime: number, 
    watchTime: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          last_position: Math.floor(currentTime),
          watch_time: Math.floor(watchTime),
          updated_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      return false;
    }
  };

  const getLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) return null;

      return {
        lessonId: data.lesson_id,
        completed: data.completed || false,
        watchTime: data.watch_time || 0,
        lastPosition: data.last_position || 0,
        quizScore: data.quiz_score || 0,
        completedAt: data.completed_at
      };
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  };

  const resetProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      await loadProgressData();
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  };

  const getAchievements = () => {
    const achievements = [];

    if (progressData.completedLessons >= 1) {
      achievements.push({
        id: 'first_lesson',
        title: 'أول خطوة',
        description: 'أكملت أول درس',
        icon: '🎯',
        unlocked: true
      });
    }

    if (progressData.completedLessons >= 5) {
      achievements.push({
        id: 'five_lessons',
        title: 'على الطريق الصحيح',
        description: 'أكملت 5 دروس',
        icon: '🚀',
        unlocked: true
      });
    }

    if (progressData.completionPercentage >= 50) {
      achievements.push({
        id: 'halfway',
        title: 'منتصف الطريق',
        description: 'أكملت 50% من الكورس',
        icon: '🏆',
        unlocked: true
      });
    }

    if (progressData.completionPercentage >= 100) {
      achievements.push({
        id: 'completed',
        title: 'خبير التسويق',
        description: 'أكملت الكورس بالكامل',
        icon: '👑',
        unlocked: true
      });
    }

    if (progressData.currentStreak >= 7) {
      achievements.push({
        id: 'week_streak',
        title: 'إلتزام أسبوعي',
        description: 'درست لمدة 7 أيام متتالية',
        icon: '🔥',
        unlocked: true
      });
    }

    return achievements;
  };

  const formatWatchTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    } else {
      return `${minutes} دقيقة`;
    }
  };

  return {
    progressData,
    loading,
    error,
    markLessonComplete,
    updateLessonProgress,
    getLessonProgress,
    resetProgress,
    getAchievements,
    formatWatchTime,
    refreshProgress: loadProgressData
  };
};