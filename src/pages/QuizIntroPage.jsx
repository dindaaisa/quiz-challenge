// src/pages/QuizIntroPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import PageBackground from '../components/common/PageBackground';

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const { questions, fetchQuestions, loading, error, quizInfo } = useQuiz();

  const [username, setUsername] = useState('');
  const [questionAmount] = useState(10);
  const [timePerQuestion] = useState(30);
  const [hasFetchedQuestions, setHasFetchedQuestions] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUsername(currentUser);

    if (!hasFetchedQuestions) {
      fetchQuestions(questionAmount);
      setHasFetchedQuestions(true);
    }
  }, [navigate, questionAmount, hasFetchedQuestions, fetchQuestions]);

  const totalTime = useMemo(() => questionAmount * timePerQuestion, [questionAmount, timePerQuestion]);
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      alert('Gagal memuat soal. Silakan refresh halaman.');
      return;
    }

    // simpan soal
    localStorage.setItem(`${username}:quiz-questions`, JSON.stringify(questions));

    // ✅ PERBAIKAN: Simpan kategori yang konsisten
    // Ambil dari quizInfo yang sudah diproses oleh quizService
    const categoryToSave = quizInfo?.category || 'Mixed Categories';
    
    console.log('Saving quiz meta with category:', categoryToSave);

    const meta = {
      total: questionAmount,
      timePerQuestion,
      totalTime,
      category: categoryToSave,
      difficulty: quizInfo?.difficulty || 'medium',
      type: 'multiple'
    };
    localStorage.setItem(`${username}:quiz-meta`, JSON.stringify(meta));

    navigate('/quiz');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) return <Loading text="Memuat soal..." />;

  // ✅ Gunakan kategori dari quizInfo untuk konsistensi
  const displayCategory = quizInfo?.category || 'Mixed Categories';

  return (
    <PageBackground>
      <div className="h-screen w-full px-4 py-5 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="card overflow-hidden w-full animate-[slideUp_0.5s_ease]">
            <div className="h-12 bg-[#7F5539]" />

            <div className="px-6 md:px-8 py-5 md:py-6">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-earth-surface border border-secondary-light rounded-full mb-3">
                  <svg className="w-4.5 h-4.5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm font-medium text-brown-light">{username}</span>
                </div>

                <h1 className="font-bold text-brown mb-1" style={{ fontSize: 'clamp(1.5rem, 2.2vw, 2.1rem)' }}>
                  Selamat Datang!
                </h1>
                <p className="text-brown-light text-sm">
                  Siap untuk menguji pengetahuanmu?
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="font-semibold text-brown mb-3 text-base md:text-lg">
                    Informasi Quiz
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 bg-earth-surface rounded-xl border border-secondary-light/50">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-brown-lighter uppercase tracking-wide leading-none mb-1">
                          Jumlah Soal
                        </div>
                        <div className="text-base font-bold text-brown leading-tight">
                          {questionAmount} Soal
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-earth-surface rounded-xl border border-secondary-light/50">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-brown-lighter uppercase tracking-wide leading-none mb-1">
                          Kategori
                        </div>
                        <div className="text-base font-bold text-brown leading-tight truncate">
                          {displayCategory}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-earth-surface rounded-xl border border-secondary-light/50">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-brown-lighter uppercase tracking-wide leading-none mb-1">
                          Waktu
                        </div>
                        <div className="text-base font-bold text-brown leading-tight">
                          {minutes > 0 ? `${minutes} menit ` : ''}{seconds} detik
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-earth-surface rounded-xl border border-secondary-light/50">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-medium text-brown-lighter uppercase tracking-wide leading-none mb-1">
                          Tipe Soal
                        </div>
                        <div className="text-base font-bold text-brown leading-tight">
                          Multiple Choice
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-earth-surface p-4 rounded-xl border border-secondary-light/50">
                  <h3 className="text-sm font-semibold text-brown">
                    Aturan Quiz:
                  </h3>

                  <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {[
                      'Setiap soal ditampilkan satu per satu',
                      'Timer akan berjalan dari awal quiz',
                      'Progress otomatis tersimpan (bisa lanjut jika browser ditutup)',
                      'Tidak bisa kembali ke soal sebelumnya setelah next',
                      'Kerjakan dengan teliti dan semangat!',
                    ].map((rule, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-brown-light leading-snug">
                        <svg className="w-5 h-5 text-accent flex-shrink-0 mt-[1px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {error && questions.length === 0 && (
                  <div className="flex items-start gap-3 bg-red-50 border-l-4 border-sienna p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sienna text-sm leading-snug">{error}</p>
                      <p className="text-xs text-brown-light">Silakan coba lagi</p>
                    </div>
                    <Button variant="danger" onClick={() => window.location.reload()}>
                      Refresh
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    onClick={handleStartQuiz}
                    className="flex-1 py-4 text-base"
                    disabled={questions.length === 0}
                  >
                    Mulai Quiz Sekarang
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleLogout}
                    className="sm:w-auto py-4"
                  >
                    Logout
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default QuizIntroPage;