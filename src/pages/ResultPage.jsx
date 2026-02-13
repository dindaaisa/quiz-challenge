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
      const parsed = JSON.parse(savedResult);
      // ✅ PERBAIKAN: Validasi struktur data result
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid result data');
      }
      setResult(parsed);
    } catch (e) {
      console.error('Invalid quiz result JSON:', e);
      alert('Data hasil quiz tidak valid. Kembali ke halaman intro.');
      navigate('/intro');
    }
  }, [username, navigate]);

  const handleQuizAgain = () => {
    // ✅ Bersihkan semua data quiz sebelumnya
    localStorage.removeItem(`${username}:quiz-result`);
    localStorage.removeItem(`${username}:quiz-progress`);
    navigate('/intro');
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const minutes = useMemo(() => {
    if (!result) return 0;
    const timeUsed = Number(result.timeUsed) || 0;
    return Math.floor(timeUsed / 60);
  }, [result]);

  const seconds = useMemo(() => {
    if (!result) return 0;
    const timeUsed = Number(result.timeUsed) || 0;
    return timeUsed % 60;
  }, [result]);

  const scorePct = useMemo(() => {
    if (!result) return 0;
    const s = Number(result.score || 0);
    return Math.max(0, Math.min(100, s));
  }, [result]);

  // ✅ Helper functions yang robust
  const safeText = (v) => {
    if (v === null || v === undefined) return '';
    return String(v);
  };

  const normalize = (s) => String(s ?? '').trim();

  const decodeHtml = (str) => {
    if (!str) return '';
    try {
      const txt = document.createElement('textarea');
      txt.innerHTML = str;
      return txt.value;
    } catch {
      return String(str);
    }
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

  // ✅ PERBAIKAN: Validasi angka-angka result
  const safeCorrect = Math.max(0, Number(result.correct) || 0);
  const safeWrong = Math.max(0, Number(result.wrong) || 0);
  const safeUnanswered = Math.max(0, Number(result.unanswered) || 0);
  const safeTotal = Math.max(1, Number(result.total) || 1); // minimal 1 untuk hindari division by zero

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
                    <div className="text-3xl font-bold text-brown">{safeCorrect}</div>
                    <div className="text-brown-light font-semibold">/{safeTotal}</div>
                  </div>
                  <div className="text-sm text-brown-light mt-1">soal terjawab benar</div>
                </div>

                <div className="bg-earth-surface p-5 rounded-xl border border-secondary-light/50">
                  <div className="text-xs font-medium text-brown-lighter uppercase mb-2">Persentase</div>
                  <div className="text-3xl font-bold text-brown mb-3">{scorePct}%</div>
                  <div className="w-full h-2 rounded-full bg-white border border-secondary-light overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${scorePct}%` }} />
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
                  <div className="text-xl font-bold text-accent">{safeCorrect}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-secondary-light/50 text-center">
                  <div className="text-xs text-brown-lighter mb-1">Salah</div>
                  <div className="text-xl font-bold text-sienna">{safeWrong}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-secondary-light/50 text-center">
                  <div className="text-xs text-brown-lighter mb-1">Kosong</div>
                  <div className="text-xl font-bold text-brown-lighter">{safeUnanswered}</div>
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

                {detailedAnswers.length === 0 ? (
                  <div className="text-center py-8 text-brown-light">
                    <p>Tidak ada detail jawaban yang tersedia.</p>
                  </div>
                ) : (
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
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-brown">Soal {idx + 1}</div>
                            {/* ✅ Status indicator */}
                            <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              !isAnswered 
                                ? 'bg-gray-100 text-gray-600' 
                                : isCorrect 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {!isAnswered ? 'Tidak Dijawab' : isCorrect ? '✓ Benar' : '✗ Salah'}
                            </div>
                          </div>

                          <div className="text-brown mb-3">{decodeHtml(q?.question)}</div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div
                              className={`rounded-xl border p-4 bg-white ${
                                !isAnswered
                                  ? 'border-secondary-light/60'
                                  : isCorrect
                                  ? 'border-green-200 bg-green-50/30'
                                  : 'border-red-200 bg-red-50/30'
                              }`}
                            >
                              <div className="font-semibold mb-1 text-brown-lighter">Jawaban Kamu</div>
                              <div className="text-brown">{isAnswered ? decodeHtml(userAnswer) : 'Tidak dijawab'}</div>
                            </div>

                            <div className="rounded-xl border border-green-200 bg-green-50/30 p-4">
                              <div className="font-semibold mb-1 text-brown-lighter">Jawaban Benar</div>
                              <div className="text-brown">{correctAnswer ? decodeHtml(correctAnswer) : '-'}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </PageBackground>
  );
};

export default ResultPage;