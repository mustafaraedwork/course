// 🎥 مشغل الفيديو المحمي - components/VideoPlayer.tsx (نسخة مُصححة)
'use client';

import { useState, useRef, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface VideoPlayerProps {
  videoUrl: string;
  lessonId: string;
  lessonTitle: string;
  duration?: number;
  watermark?: string;
  onProgress?: (currentTime: number, watchedPercentage: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({
  videoUrl,
  lessonId,
  lessonTitle,
  duration = 0,
  watermark = 'أكاديمية التسويق الرقمي',
  onProgress,
  onComplete
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [watchedPercentage, setWatchedPercentage] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 🔧 إصلاح الخطأ
  const supabase = createClientComponentClient();

  // تحميل آخر موضع مشاهدة من قاعدة البيانات
  useEffect(() => {
    loadLastPosition();
  }, [lessonId]);

  // تحديث التقدم كل 5 ثوان
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTime > 0) {
        saveProgress();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, lessonId]);

  // تحميل آخر موضع مشاهدة
  const loadLastPosition = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_progress')
        .select('last_position, watch_time')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

      if (data && data.last_position > 30) { // البدء من آخر موضع إذا كان أكثر من 30 ثانية
        if (videoRef.current) {
          videoRef.current.currentTime = data.last_position;
          setCurrentTime(data.last_position);
        }
      }
    } catch (error) {
      console.error('Error loading last position:', error);
    }
  };

  // حفظ التقدم في قاعدة البيانات
  const saveProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const percentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;
      const isCompleted = percentage >= 90; // يعتبر مكتمل عند 90%

      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          last_position: Math.floor(currentTime),
          watch_time: Math.floor(currentTime),
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        });

      if (onProgress) {
        onProgress(currentTime, percentage);
      }

      if (isCompleted && onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // تشغيل/إيقاف الفيديو
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // تحديث الوقت الحالي
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
      
      if (totalDuration > 0) {
        const percentage = (current / totalDuration) * 100;
        setWatchedPercentage(percentage);
      }
    }
  };

  // تحديد مدة الفيديو
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setTotalDuration(videoRef.current.duration);
    }
  };

  // تغيير الموضع في الفيديو
  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // تغيير مستوى الصوت
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // تغيير سرعة التشغيل
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // الدخول/الخروج من وضع الشاشة الكاملة
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // إخفاء/إظهار التحكم
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // منع النقر الأيمن
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // منع النسخ والطباعة
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'p' || e.key === 's')) {
      e.preventDefault();
    }
  };

  // تنسيق الوقت
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* العلامة المائية */}
      <div className="absolute top-4 right-4 z-20 text-white/50 text-sm pointer-events-none select-none">
        {watermark}
      </div>

      {/* الفيديو */}
      <video
        ref={videoRef}
        className="w-full h-auto"
        src={videoUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          saveProgress();
          if (onComplete) onComplete();
        }}
        onContextMenu={handleContextMenu}
        controlsList="nodownload"
        playsInline
      />

      {/* أدوات التحكم */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* شريط التقدم */}
        <div className="mb-4">
          <div className="w-full bg-white/20 rounded-full h-1 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percentage = (e.clientX - rect.left) / rect.width;
              handleSeek(totalDuration * percentage);
            }}
          >
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${watchedPercentage}%` }}
            />
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            {/* زر تشغيل/إيقاف */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>

            {/* عرض الوقت */}
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* سرعة التشغيل */}
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
              className="bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1"
            >
              <option value={0.5} className="text-black">0.5x</option>
              <option value={0.75} className="text-black">0.75x</option>
              <option value={1} className="text-black">1x</option>
              <option value={1.25} className="text-black">1.25x</option>
              <option value={1.5} className="text-black">1.5x</option>
              <option value={2} className="text-black">2x</option>
            </select>

            {/* التحكم في الصوت */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVolumeChange(volume > 0 ? 0 : 1)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                {volume > 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-20"
              />
            </div>

            {/* الشاشة الكاملة */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* رسالة الحماية عند النقر الأيمن */}
      <div className="absolute inset-0 pointer-events-none select-none" />
    </div>
  );
}