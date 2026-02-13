// src/pages/QuizIntroPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

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
      console.log('Fetching questions...');
      fetchQuestions(questionAmount);
      setHasFetchedQuestions(true);
    }
  }, [navigate, questionAmount, hasFetchedQuestions, fetchQuestions]);

  // ✅ Set meta dengan kategori "Mixed"
  useEffect(() => {
    if (questions.length > 0 && username) {
      const meta = {
        category: 'Mixed',  // ✅ HARDCODE "Mixed"
        totalQuestions: questionAmount,
        totalTime: questionAmount * timePerQuestion,
      };
      localStorage.setItem(`${username}:quiz-meta`, JSON.stringify(meta));
      console.log('✅ Quiz meta saved:', meta);
    }
  }, [questions, username, questionAmount, timePerQuestion]);

  const handleStartQuiz = () => {
    if (questions.length === 0) {
      alert('Gagal memuat soal. Silakan refresh halaman.');
      return;
    }
    
    localStorage.setItem(`${username}:quiz-questions`, JSON.stringify(questions));
    navigate('/quiz');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <Loading text="Memuat soal..." />;
  }

  const totalTime = questionAmount * timePerQuestion;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-earth-cream via-earth-cream to-earth-sand py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 md:p-10 animate-[slideUp_0.5s_ease]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-earth-surface border border-secondary-light rounded-full mb-4">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span className="text-sm font-medium text-brown-light">{username}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brown mb-3">Selamat Datang!</h1>
            <p className="text-brown-light">Siap untuk menguji pengetahuanmu?</p>
          </div>

          {/* Quiz Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-brown mb-6">Informasi Quiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 */}
              <div className="flex items-center gap-4 p-5 bg-earth-surface rounded-xl border border-secondary-light/50 hover:border-primary transition-all hover:shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-brown-lighter uppercase tracking-wide mb-1">Jumlah Soal</div>
                  <div className="text-lg font-bold text-brown">{questionAmount} Soal</div>
                </div>
              </div>

              {/* Card 2 - Kategori "Mixed" */}
              <div className="flex items-center gap-4 p-5 bg-earth-surface rounded-xl border border-secondary-light/50 hover:border-primary transition-all hover:shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-brown-lighter uppercase tracking-wide mb-1">Kategori</div>
                  <div className="text-lg font-bold text-brown">Mixed</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-4 p-5 bg-earth-surface rounded-xl border border-secondary-light/50 hover:border-primary transition-all hover:shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-brown-lighter uppercase tracking-wide mb-1">Waktu</div>
                  <div className="text-lg font-bold text-brown">
                    {minutes > 0 ? `${minutes} menit ` : ''}{seconds > 0 ? `${seconds} detik` : ''}
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex items-center gap-4 p-5 bg-earth-surface rounded-xl border border-secondary-light/50 hover:border-primary transition-all hover:shadow-sm">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-brown-lighter uppercase tracking-wide mb-1">Tipe Soal</div>
                  <div className="text-lg font-bold text-brown">Multiple Choice</div>
                </div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-earth-surface p-6 rounded-xl border border-secondary-light/50 mb-8">
            <h3 className="text-base font-semibold text-brown mb-4">Aturan Quiz:</h3>
            <ul className="space-y-3">
              {[
                'Setiap soal ditampilkan satu per satu',
                'Timer akan berjalan dari awal quiz',
                'Progress otomatis tersimpan (bisa lanjut jika browser ditutup)',
                'Kamu bisa lompat ke soal manapun lewat sidebar',
                'Kerjakan dengan teliti dan semangat!'
              ].map((rule, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-brown-light">
                  <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          {error && questions.length === 0 ? (
            <div className="flex items-start gap-4 bg-red-50 border-l-4 border-sienna p-4 rounded-lg">
              <svg className="w-6 h-6 text-sienna flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex-1">
                <p className="font-semibold text-sienna mb-1">{error}</p>
                <p className="text-sm text-brown-light">Silakan coba lagi</p>
              </div>
              <Button variant="danger" onClick={() => window.location.reload()}>
                Refresh
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizIntroPage;