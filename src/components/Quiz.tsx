// ❓ مكون الاختبار التفاعلي - components/Quiz.tsx
'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'text';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
}

export default function Quiz({ questions, onComplete, onClose }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 دقائق لكل اختبار

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const passingScore = Math.ceil(totalQuestions * 0.7); // 70% للنجاح

  // مؤقت الاختبار
  useEffect(() => {
    if (!quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
  }, [timeLeft, quizCompleted]);

  const handleTimeUp = () => {
    // إنهاء الاختبار تلقائياً عند انتهاء الوقت
    finishQuiz();
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const points = isCorrect ? currentQuestion.points : 0;

    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      isCorrect,
      points
    };

    setAnswers([...answers, newAnswer]);
    setShowResult(true);
    setShowExplanation(true);

    // تحديث النقاط
    if (isCorrect) {
      setScore(score + points);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
    const finalScore = answers.reduce((total, answer) => total + answer.points, 0);
    const maxScore = questions.reduce((total, question) => total + question.points, 0);
    const percentage = (finalScore / maxScore) * 100;
    const passed = percentage >= 70;

    onComplete(finalScore, passed);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? showResult
                      ? option === currentQuestion.correct_answer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : showResult && option === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <div className="flex items-center">
                    {showResult && option === currentQuestion.correct_answer && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    {showResult && selectedAnswer === option && option !== currentQuestion.correct_answer && (
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            {['صحيح', 'خطأ'].map((option) => (
              <button
                key={option}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full text-right p-4 rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? showResult
                      ? option === currentQuestion.correct_answer
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : showResult && option === currentQuestion.correct_answer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showResult && option === currentQuestion.correct_answer && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <div>
            <textarea
              value={selectedAnswer}
              onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
              disabled={showResult}
              placeholder="اكتب إجابتك هنا..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none h-32 text-right"
              style={{ direction: 'rtl' }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (quizCompleted) {
    const totalScore = questions.reduce((total, question) => total + question.points, 0);
    const percentage = (score / totalScore) * 100;
    const passed = percentage >= 70;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {passed ? 'تهانينا! 🎉' : 'يمكنك المحاولة مرة أخرى'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            حصلت على {score} نقطة من {totalScore} نقطة
          </p>
          
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.round(percentage)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  passed ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {passed 
              ? 'نجحت في الاختبار! يمكنك الآن الانتقال للدرس التالي.'
              : 'تحتاج إلى 70% على الأقل للنجاح. حاول مرة أخرى!'
            }
          </p>

          <div className="flex space-x-3 rtl:space-x-reverse">
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQuestionIndex(0);
                  setAnswers([]);
                  setScore(0);
                  setSelectedAnswer('');
                  setShowResult(false);
                  setShowExplanation(false);
                  setQuizCompleted(false);
                  setTimeLeft(300);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {passed ? 'متابعة' : 'إغلاق'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* الهيدر */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <h2 className="text-xl font-bold">اختبار الدرس</h2>
            <span className="text-sm text-gray-500">
              السؤال {currentQuestionIndex + 1} من {totalQuestions}
            </span>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className={`text-sm font-medium ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-600'}`}>
              الوقت المتبقي: {formatTime(timeLeft)}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* السؤال */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">
              {currentQuestion.question}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>النقاط: {currentQuestion.points}</span>
              <span>نوع السؤال: {
                currentQuestion.type === 'multiple_choice' ? 'اختيار متعدد' :
                currentQuestion.type === 'true_false' ? 'صح أو خطأ' : 'نص'
              }</span>
            </div>
          </div>

          {/* خيارات الإجابة */}
          {renderQuestion()}

          {/* التفسير */}
          {showExplanation && (
            <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">التفسير:</h4>
              <p className="text-blue-800 text-right">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* الأزرار */}
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              إلغاء الاختبار
            </button>

            <div className="flex space-x-3 rtl:space-x-reverse">
              {!showResult ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  تأكيد الإجابة
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'السؤال التالي' : 'إنهاء الاختبار'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}