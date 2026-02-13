// src/hooks/useQuiz.js
import { useState, useCallback, useRef } from 'react';
import quizService from '../services/quizService';

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizInfo, setQuizInfo] = useState(null);

  const lastFetchKeyRef = useRef('');
  const inFlightRef = useRef(false);

  const fetchQuestions = useCallback(async (amount = 10, category = '', difficulty = '') => {
    const fetchKey = `${amount}|${category}|${difficulty}`;

    if (inFlightRef.current) {
      console.log('Already fetching, skipping...');
      return null;
    }

    // kalau param sama persis dan data sudah ada, tidak perlu fetch ulang
    if (lastFetchKeyRef.current === fetchKey && Array.isArray(questions) && questions.length > 0) {
      return {
        success: true,
        data: questions,
        total: questions.length,
        category: quizInfo?.category || 'General',
        difficulty: quizInfo?.difficulty || 'medium'
      };
    }

    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await quizService.getQuestions(amount, category, difficulty);

      const safeData = Array.isArray(response?.data) ? response.data : [];
      setQuestions(safeData);

      setQuizInfo({
        total: response?.total ?? safeData.length,
        category: response?.category ?? 'General',
        difficulty: response?.difficulty ?? 'medium'
      });

      lastFetchKeyRef.current = fetchKey;
      return response;
    } catch (err) {
      const msg = err?.message ? String(err.message) : 'Terjadi kesalahan saat memuat soal.';
      setError(msg);
      setQuestions([]);
      lastFetchKeyRef.current = '';
      return null;
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [questions, quizInfo]);

  const resetFetch = useCallback(() => {
    lastFetchKeyRef.current = '';
  }, []);

  return {
    questions,
    loading,
    error,
    quizInfo,
    fetchQuestions,
    resetFetch
  };
};