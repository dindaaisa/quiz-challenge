// src/hooks/useQuizProgress.js
import { useState, useCallback, useEffect, useRef } from 'react';

export const useQuizProgress = (storageKey) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const loadedOnceRef = useRef(false);

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
      setTimeRemaining(data.timeRemaining ?? null);

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

  // Save ke localStorage setiap ada perubahan.
  // Disimpan walau startTime null, supaya jawaban tetap aman.
  useEffect(() => {
    if (!storageKey) return;
    if (!loadedOnceRef.current) return;

    try {
      const data = {
        currentIndex: currentQuestionIndex,
        answers,
        timeRemaining,
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
    setCurrentQuestionIndex((prev) => {
      const maxIdx = Math.max(0, (totalQuestions || 1) - 1);
      return Math.min(prev + 1, maxIdx);
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const jumpToQuestion = useCallback((index, totalQuestions) => {
    const maxIdx = Math.max(0, (totalQuestions || 1) - 1);
    const safeIdx = Math.min(Math.max(0, Number(index) || 0), maxIdx);
    setCurrentQuestionIndex(safeIdx);
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setStartTime(null);
    setTimeRemaining(null);
    if (storageKey) localStorage.removeItem(storageKey);
  }, [storageKey]);

  const initializeQuiz = useCallback((totalTime) => {
    setStartTime(new Date());
    setTimeRemaining(totalTime);
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