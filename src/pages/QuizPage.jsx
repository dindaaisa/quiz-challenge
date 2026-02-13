// src/pages/QuizPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizProgress } from '../hooks/useQuizProgress';
import authService from '../services/authService';
import QuizCard from '../components/quiz/QuizCard';
import QuizTimer from '../components/quiz/QuizTimer';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import PageBackground from '../components/common/PageBackground';

const QuizPage = () => {
  const navigate = useNavigate();
  const username = authService.getCurrentUser();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ meta supaya kategori dan total konsisten dengan intro
  const [quizMeta, setQuizMeta] = useState(null);

  const storageKey = `${username}:quiz-progress`;

  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    jumpToQuestion,
    answers,
    timeRemaining,
    setTimeRemaining,
    recordAnswer,
    nextQuestion,
    previousQuestion,
    initializeQuiz,
    resetQuiz
  } = useQuizProgress(storageKey);

  // ✅ LOAD QUESTIONS & INITIALIZE TIMER
  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const savedQuestionsStr = localStorage.getItem(`${username}:quiz-questions`);
    if (!savedQuestionsStr) {
      navigate('/intro');
      return;
    }

    const savedQuestions = JSON.parse(savedQuestionsStr);
    setQuestions(Array.isArray(savedQuestions) ? savedQuestions : []);

    // ✅ ambil meta
    const metaStr = localStorage.getItem(`${username}:quiz-meta`);
    let meta = null;
    if (metaStr) {
      try {
        meta = JSON.parse(metaStr);
        setQuizMeta(meta);
      } catch {
        setQuizMeta(null);
      }
    }

    // ✅ Tentukan totalTime
    const totalTime = meta?.totalTime ?? 300;

    // ✅ Cek saved progress
    const savedProgressStr = localStorage.getItem(storageKey);
    
    let shouldInitialize = false;
    
    if (savedProgressStr) {
      try {
        const savedProgress = JSON.parse(savedProgressStr);
        
        // ✅ Validasi timeRemaining di saved progress
        if (typeof savedProgress.timeRemaining !== 'number' || savedProgress.timeRemaining < 0) {
          console.warn('⚠️ Saved progress has invalid timeRemaining, re-initializing...');
          shouldInitialize = true;
          
          // Hapus saved progress yang corrupt
          localStorage.removeItem(storageKey);
        }
      } catch (e) {
        console.error('❌ Error parsing saved progress:', e);
        shouldInitialize = true;
        localStorage.removeItem(storageKey);
      }
    } else {
      // Tidak ada saved progress
      shouldInitialize = true;
    }

    // ✅ Initialize quiz kalau perlu
    if (shouldInitialize) {
      console.log('🎯 Initializing quiz with time:', totalTime);
      initializeQuiz(totalTime);
    } else {
      console.log('📂 Loaded valid saved progress');
    }

    setIsLoading(false);
  }, [username, navigate, storageKey, initializeQuiz]);

  // ✅ FORCE TIMER (Safety net)
  useEffect(() => {
    if (timeRemaining === null || timeRemaining === undefined) {
      const timeout = setTimeout(() => {
        if (timeRemaining === null || timeRemaining === undefined) {
          console.warn('⚠️⚠️ Force initializing timer!');
          const totalTime = quizMeta?.totalTime ?? 300;
          setTimeRemaining(totalTime);
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [timeRemaining, quizMeta, setTimeRemaining]);

  // Debug log untuk timer
  console.log('⏱️ QuizPage Timer State:', {
    timeRemaining,
    type: typeof timeRemaining,
    isNull: timeRemaining === null,
    isUndefined: timeRemaining === undefined
  });

  const totalQuestions = questions.length;

  const currentQuestion = useMemo(() => {
    return totalQuestions > 0 ? questions[currentQuestionIndex] : null;
  }, [questions, totalQuestions, currentQuestionIndex]);

  const isLastQuestion = totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const extractAnswerText = (ansObj) => {
    if (ansObj === null || ansObj === undefined) return '';
    if (typeof ansObj === 'string' || typeof ansObj === 'number') return String(ansObj);
    if (typeof ansObj === 'object') {
      const txt = ansObj.option ?? ansObj.answer ?? ansObj.selected ?? ansObj.text ?? ansObj.label ?? ansObj.value ?? ansObj.name ?? '';
      return String(txt ?? '');
    }
    return '';
  };

  const normalize = (s) => String(s ?? '').trim();

  const answeredCount = useMemo(() => {
    if (!answers) return 0;
    return Object.keys(answers).filter((k) => normalize(extractAnswerText(answers[k])) !== '').length;
  }, [answers]);

  const progressPct = useMemo(() => {
    if (!totalQuestions) return 0;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answeredCount, totalQuestions]);

  const handleSelectAnswer = (answer) => {
    recordAnswer(currentQuestionIndex, answer);
  };

  const handleNext = () => {
    nextQuestion(totalQuestions);
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleSubmit = () => {
    const confirmSubmit = window.confirm(
      'Apakah kamu yakin ingin menyelesaikan quiz?\n\nJawaban yang belum diisi akan dianggap kosong.'
    );
    if (!confirmSubmit) return;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const detailedAnswers = questions.map((q, index) => {
      const ansObj = answers?.[index];
      const userAnswerText = normalize(extractAnswerText(ansObj));
      const correctAnswerText = normalize(q?.correct_answer);

      const isAnswered = userAnswerText !== '';
      let isCorrect = false;

      if (ansObj && typeof ansObj === 'object' && typeof ansObj.correct === 'boolean') {
        isCorrect = ansObj.correct;
      } else {
        isCorrect = isAnswered && userAnswerText === correctAnswerText;
      }

      if (!isAnswered) unanswered++;
      else if (isCorrect) correct++;
      else wrong++;

      return {
        question: q,
        userAnswer: isAnswered ? userAnswerText : null,
        correctAnswer: q?.correct_answer ?? '',
        isCorrect,
        isAnswered,
      };
    });

    const result = {
      correct,
      wrong,
      unanswered,
      total: questions.length,
      score: Math.round((correct / questions.length) * 100),
      timeUsed: (quizMeta?.totalTime ?? 300) - (timeRemaining || 0),
      detailedAnswers,
    };

    localStorage.setItem(`${username}:quiz-result`, JSON.stringify(result));
    resetQuiz();
    localStorage.removeItem(`${username}:quiz-questions`);
    localStorage.removeItem(`${username}:quiz-meta`);
    navigate('/result');
  };

  const handleTimeUp = () => {
    alert('Waktu habis! Quiz akan diselesaikan otomatis.');
    handleSubmit();
  };

  if (isLoading) {
    return <Loading text="Memuat quiz..." />;
  }

  if (questions.length === 0) {
    return (
      <PageBackground>
        <div className="min-h-screen w-full flex items-center justify-center">
          <div className="card p-10 text-center max-w-md">
            <h2 className="text-2xl font-bold text-brown mb-2">Gagal Memuat Soal</h2>
            <p className="text-brown-light mb-6">Silakan kembali ke halaman intro dan coba lagi.</p>
            <Button onClick={() => navigate('/intro')}>Kembali</Button>
          </div>
        </div>
      </PageBackground>
    );
  }

  // ✅ KATEGORI: "Mixed" (hardcoded)
  const fixedCategoryLabel = 'Mixed';

  return (
    <PageBackground>
      <div className="min-h-screen w-full px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">

            {/* LEFT SIDEBAR */}
            <div className="card p-4 h-fit lg:sticky lg:top-6">
              <div className="text-sm font-semibold text-brown mb-3">Pilih Soal</div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const isActive = index === currentQuestionIndex;
                  const hasAnswer = normalize(extractAnswerText(answers?.[index])) !== '';

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (typeof jumpToQuestion === 'function') {
                          jumpToQuestion(index, totalQuestions);
                        } else {
                          const maxIdx = Math.max(0, totalQuestions - 1);
                          setCurrentQuestionIndex(Math.min(Math.max(0, index), maxIdx));
                        }
                      }}
                      className={[
                        "w-10 h-10 rounded-xl border text-sm font-semibold transition-all select-none",
                        isActive
                          ? "bg-primary text-white border-primary shadow-sm scale-[1.02]"
                          : hasAnswer
                            ? "bg-[#6B442E] border-[#6B442E] text-white font-extrabold"
                            : "bg-white border-secondary-light text-brown-lighter",
                        hasAnswer && !isActive ? "ring-1 ring-primary/20" : ""
                      ].join(" ")}
                      title={`Soal ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-xs text-brown-light">
                Terjawab: <span className="font-semibold text-brown">{answeredCount}</span>/{totalQuestions}
              </div>
            </div>

            {/* RIGHT AREA */}
            <div className="space-y-4">

              {/* HEADER CARD */}
              <div className="card overflow-hidden">
                <div className="p-4 md:p-5 bg-primary">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-white font-bold text-base md:text-lg leading-tight truncate">
                        Quiz Final Modul
                      </div>
                      <div className="text-white/90 text-xs mt-1">
                        Soal {currentQuestionIndex + 1} dari {totalQuestions}
                      </div>
                    </div>

                    {/* ✅ TIMER SECTION */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-white/90 text-xs font-semibold whitespace-nowrap">
                        Sisa Waktu
                      </div>
                      {timeRemaining !== null && timeRemaining !== undefined ? (
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[100px] flex items-center justify-center border border-white/10">
                          <QuizTimer
                            timeRemaining={timeRemaining}
                            setTimeRemaining={setTimeRemaining}
                            onTimeUp={handleTimeUp}
                            className="text-white text-lg"
                          />
                        </div>
                      ) : (
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 min-w-[100px] text-center">
                          <span className="text-white text-lg font-mono font-bold">--:--</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-white/90 text-xs mb-2">
                      <span>{progressPct}% Selesai</span>
                      <span>{answeredCount}/{totalQuestions} terjawab</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-300" 
                        style={{ width: `${progressPct}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTENT CARD */}
              <div className="card p-5 md:p-6">
                {currentQuestion && (
                  <QuizCard
                    question={currentQuestion}
                    selectedAnswer={answers?.[currentQuestionIndex]}
                    onSelectAnswer={handleSelectAnswer}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={totalQuestions}
                    categoryLabel={fixedCategoryLabel}
                  />
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Kembali
                  </Button>

                  <div className="flex-1" />

                  {isLastQuestion ? (
                    <Button onClick={handleSubmit} variant="success" className="w-full sm:w-auto">
                      Selesai
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  ) : (
                    <Button onClick={handleNext} variant="primary" className="w-full sm:w-auto">
                      Lanjut
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default QuizPage;