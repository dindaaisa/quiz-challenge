// src/pages/ResultPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Button from '../components/common/Button';
import PageBackground from '../components/common/PageBackground';

const ResultPage = () => {
  const navigate = useNavigate();
  const username = authService.getCurrentUser();

  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const savedResult = localStorage.getItem(`${username}:quiz-result`);
    if (!savedResult) {
      navigate('/intro');
      return;
    }

    try {
      setResult(JSON.parse(savedResult));
    } catch (e) {
      console.error('Invalid quiz result JSON:', e);
      navigate('/intro');
    }
  }, [username, navigate]);

  const handleQuizAgain = () => {
    localStorage.removeItem(`${username}:quiz-result`);
    navigate('/intro');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const minutes = useMemo(() => {
    if (!result) return 0;
    return Math.floor((result.timeUsed || 0) / 60);
  }, [result]);

  const seconds = useMemo(() => {
    if (!result) return 0;
    return (result.timeUsed || 0) % 60;
  }, [result]);

  const scorePct = useMemo(() => {
    if (!result) return 0;
    const s = Number(result.score || 0);
    return Math.max(0, Math.min(100, s));
  }, [result]);

  const safeText = (v) => {
    if (v === null || v === undefined) return '';
    return String(v);
  };

  const normalize = (s) => String(s ?? '').trim();

  const decodeHtml = (str) => {
    if (!str) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  const extractCorrectAnswer = (q) => {
    if (!q) return '';
    return (
      q.correct_answer ??
      q.correctAnswer ??
      q.correct ??
      q.answer ??
      q.correctOption ??
      q.correctOptionText ??
      ''
    );
  };

  if (!result) {
    return (
      <PageBackground>
        <div className="min-h-screen w-full flex items-center justify-center">
          <p className="text-brown-light font-medium">Memuat hasil...</p>
        </div>
      </PageBackground>
    );
  }

  const detailedAnswers = Array.isArray(result.detailedAnswers) ? result.detailedAnswers : [];

  return (
    <PageBackground>
      <div className="min-h-screen w-full overflow-auto py-6 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="card overflow-hidden animate-[slideUp_0.5s_ease]">
            <div className="h-14 bg-[#7F5539]" />
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-brown">Quiz Final Modul</h1>
                <p className="text-brown-light text-sm mt-1">Berkenalan dengan AI</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-earth-surface p-5 rounded-xl border border-secondary-light/50">
                  <div className="text-xs font-medium text-brown-lighter uppercase mb-2">Skor Anda</div>
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold text-brown">{result.correct}</div>
                    <div className="text-brown-light font-semibold">/{result.total}</div>
                  </div>
                  <div className="text-sm text-brown-light mt-1">soal terjawab benar</div>
                </div>

                <div className="bg-earth-surface p-5 rounded-xl border border-secondary-light/50">
                  <div className="text-xs font-medium text-brown-lighter uppercase mb-2">Persentase</div>
                  <div className="text-3xl font-bold text-brown mb-3">{scorePct}%</div>
                  <div className="w-full h-2 rounded-full bg-white border border-secondary-light overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${scorePct}%` }} />
                  </div>
                </div>

                <div className="bg-earth-surface p-5 rounded-xl border border-secondary-light/50">
                  <div className="text-xs font-medium text-brown-lighter uppercase mb-2">Durasi</div>
                  <div className="text-3xl font-bold text-brown">
                    {minutes > 0 ? `${minutes}m` : '0m'} {seconds}s
                  </div>
                  <div className="text-sm text-brown-light mt-1">waktu pengerjaan</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white p-4 rounded-xl border border-secondary-light/50 text-center">
                  <div className="text-xs text-brown-lighter mb-1">Benar</div>
                  <div className="text-xl font-bold text-accent">{result.correct}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-secondary-light/50 text-center">
                  <div className="text-xs text-brown-lighter mb-1">Salah</div>
                  <div className="text-xl font-bold text-sienna">{result.wrong}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-secondary-light/50 text-center">
                  <div className="text-xs text-brown-lighter mb-1">Kosong</div>
                  <div className="text-xl font-bold text-brown-lighter">{result.unanswered}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" onClick={() => setShowReview((v) => !v)} className="flex-1 py-4">
                  {showReview ? 'Tutup Review' : 'Review Jawaban'}
                </Button>

                <Button variant="secondary" onClick={handleQuizAgain} className="sm:w-auto py-4">
                  Coba Lagi
                </Button>

                <Button variant="secondary" onClick={handleLogout} className="sm:w-auto py-4">
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {showReview && (
            <div className="card overflow-hidden animate-[slideUp_0.5s_ease]">
              <div className="h-14 bg-[#7F5539]" />
              <div className="p-6 md:p-8">
                <h2 className="text-xl font-bold text-brown mb-6">Detail Jawaban</h2>

                <div className="space-y-3">
                  {detailedAnswers.map((item, idx) => {
                    const q = item?.question || {};

                    const userAnswer = normalize(safeText(item?.userAnswer));
                    const correctAnswer = normalize(
                      safeText(item?.correctAnswer) || extractCorrectAnswer(q)
                    );

                    const isAnswered = Boolean(item?.isAnswered) && userAnswer !== '';
                    const isCorrect = Boolean(item?.isCorrect);

                    return (
                      <div key={idx} className="bg-earth-surface rounded-xl border border-secondary-light/50 p-4">
                        <div className="font-semibold text-brown mb-2">Soal {idx + 1}</div>

                        <div className="text-brown mb-3">{decodeHtml(q?.question)}</div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div
                            className={`rounded-xl border p-4 bg-white ${
                              !isAnswered
                                ? 'border-secondary-light/60'
                                : isCorrect
                                ? 'border-green-200'
                                : 'border-red-200'
                            }`}
                          >
                            <div className="font-semibold mb-1">Jawaban Kamu</div>
                            <div>{isAnswered ? decodeHtml(userAnswer) : 'Tidak dijawab'}</div>
                          </div>

                          <div className="rounded-xl border border-secondary-light/60 p-4 bg-white">
                            <div className="font-semibold mb-1">Jawaban Benar</div>
                            <div>{correctAnswer ? decodeHtml(correctAnswer) : '-'}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
};

export default ResultPage;