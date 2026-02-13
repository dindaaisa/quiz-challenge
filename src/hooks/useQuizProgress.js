// src/hooks/useQuizProgress.js
import { useState, useCallback, useEffect, useRef } from 'react';

export const useQuizProgress = (storageKey) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const loadedOnceRef = useRef(false);
  const isTransitioningRef = useRef(false); // ✅ Proteksi spam click

  // Load dari localStorage saat mount / storageKey berubah
  useEffect(() => {
    if (!storageKey) return;

    const saved = localStorage.getItem(storageKey);
    if (!saved) {
      loadedOnceRef.current = true;
      return;
    }

    try {
      const data = JSON.parse(saved);
      setCurrentQuestionIndex(Number(data.currentIndex ?? 0));
      setAnswers(data.answers ?? {});
      
      // ✅ PERBAIKAN: Validasi timeRemaining tidak boleh negatif
      const savedTime = data.timeRemaining ?? null;
      setTimeRemaining(savedTime !== null ? Math.max(0, savedTime) : null);

      if (data.startTime) {
        const d = new Date(data.startTime);
        if (!Number.isNaN(d.getTime())) setStartTime(d);
      }
    } catch (e) {
      console.error('Error loading quiz progress:', e);
    } finally {
      loadedOnceRef.current = true;
    }
  }, [storageKey]);

  // Save ke localStorage setiap ada perubahan
  useEffect(() => {
    if (!storageKey) return;
    if (!loadedOnceRef.current) return;

    try {
      const data = {
        currentIndex: currentQuestionIndex,
        answers,
        // ✅ Pastikan timeRemaining tidak negatif saat disimpan
        timeRemaining: timeRemaining !== null ? Math.max(0, timeRemaining) : null,
        startTime: startTime ? startTime.toISOString() : null
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving quiz progress:', e);
    }
  }, [currentQuestionIndex, answers, timeRemaining, startTime, storageKey]);

  const recordAnswer = useCallback((questionIndex, answerData) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerData
    }));
  }, []);

  const nextQuestion = useCallback((totalQuestions) => {
    // ✅ PERBAIKAN: Proteksi spam click
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setCurrentQuestionIndex((prev) => {
      const maxIdx = Math.max(0, (totalQuestions || 1) - 1);
      const next = Math.min(prev + 1, maxIdx);
      
      // Reset flag setelah transisi
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 100);
      
      return next;
    });
  }, []);

  const previousQuestion = useCallback(() => {
    // ✅ PERBAIKAN: Proteksi spam click
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    setCurrentQuestionIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      
      // Reset flag setelah transisi
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 100);
      
      return next;
    });
  }, []);

  const jumpToQuestion = useCallback((index, totalQuestions) => {
    // ✅ PERBAIKAN: Proteksi spam click
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const maxIdx = Math.max(0, (totalQuestions || 1) - 1);
    const safeIdx = Math.min(Math.max(0, Number(index) || 0), maxIdx);
    setCurrentQuestionIndex(safeIdx);

    // Reset flag setelah transisi
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 100);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(null);
    setTimeRemaining(null);
    isTransitioningRef.current = false; // ✅ Reset flag
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  const initializeQuiz = useCallback((totalTime) => {
    setStartTime(new Date());
    // ✅ Validasi totalTime positif
    setTimeRemaining(Math.max(0, totalTime));
  }, []);

  return {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    jumpToQuestion,
    answers,
    startTime,
    timeRemaining,
    setTimeRemaining,
    recordAnswer,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    initializeQuiz
  };
};