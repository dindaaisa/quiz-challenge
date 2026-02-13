// src/services/quizService.js
import axios from 'axios';
import { mockQuestions } from './mockData';

const OPENTDB_BASE_URL = 'https://opentdb.com';
const USE_MOCK_DATA = false;

const decodeHTML = (html) => {
  if (!html) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const quizService = {
  getQuestions: async (amount = 10, category = '', difficulty = '') => {
    if (USE_MOCK_DATA) {
      console.log('ðŸ“¦ Using mock data for development...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      // penting: pastikan mockQuestions juga punya correct_answer
      const normalizedMock = (mockQuestions || []).map((q, index) => {
        const correctText =
          q.correct_answer ?? q.correctAnswer ?? q.correct ?? '';

        const choicesRaw =
          q.multiple_choice ??
          q.multipleChoice ??
          q.choices ??
          [];

        const choices =
          Array.isArray(choicesRaw) && choicesRaw.length
            ? choicesRaw.map((c, i) => ({
                id: c.id ?? i,
                text: decodeHTML(c.text ?? c.label ?? c.value ?? ''),
                correct: Boolean(c.correct),
              }))
            : [];

        return {
          id: q.id ?? index,
          question: decodeHTML(q.question ?? ''),
          category: q.category ?? 'Mixed Categories',
          difficulty: q.difficulty ?? 'easy',
          type: q.type ?? 'multiple',
          correct_answer: decodeHTML(correctText),
          incorrect_answers: Array.isArray(q.incorrect_answers)
            ? q.incorrect_answers.map((x) => decodeHTML(x))
            : [],
          multiple_choice: choices,
        };
      });

      return {
        success: true,
        data: normalizedMock,
        total: normalizedMock.length,
        category: 'Mixed Categories',
        difficulty: 'easy',
      };
    }

    try {
      let url = `${OPENTDB_BASE_URL}/api.php?amount=${amount}&type=multiple`;
      if (category) url += `&category=${category}`;
      if (difficulty) url += `&difficulty=${difficulty}`;

      console.log('Fetching from:', url);

      const response = await axios.get(url);

      if (response.data.response_code === 5) {
        throw new Error('Terlalu banyak request. Menggunakan mock data...');
      }
      if (response.data.response_code !== 0) {
        throw new Error('Gagal mengambil soal dari server.');
      }

      const questions = (response.data.results || []).map((q, index) => {
        const correctText = decodeHTML(q.correct_answer);
        const incorrectTexts = (q.incorrect_answers || []).map(decodeHTML);

        const allAnswers = [
          ...incorrectTexts.map((ans, i) => ({
            id: i,
            text: ans,
            correct: false,
          })),
          {
            id: incorrectTexts.length,
            text: correctText,
            correct: true,
          },
        ].sort(() => Math.random() - 0.5);

        return {
          id: index,
          question: decodeHTML(q.question),
          category: q.category,
          difficulty: q.difficulty,
          type: q.type,

          // âœ… INI KUNCI BIAR RESULT PAGE BISA NAMPILIN JAWABAN BENAR
          correct_answer: correctText,
          incorrect_answers: incorrectTexts,

          multiple_choice: allAnswers,
        };
      });

      return {
        success: true,
        data: questions,
        total: questions.length,
        category: questions[0]?.category || 'General',
        difficulty: questions[0]?.difficulty || 'medium',
      };
    } catch (error) {
      console.error('Error fetching questions, falling back to mock data:', error);

      const normalizedMock = (mockQuestions || []).map((q, index) => {
        const correctText =
          q.correct_answer ?? q.correctAnswer ?? q.correct ?? '';

        const choicesRaw =
          q.multiple_choice ??
          q.multipleChoice ??
          q.choices ??
          [];

        const choices =
          Array.isArray(choicesRaw) && choicesRaw.length
            ? choicesRaw.map((c, i) => ({
                id: c.id ?? i,
                text: decodeHTML(c.text ?? c.label ?? c.value ?? ''),
                correct: Boolean(c.correct),
              }))
            : [];

        return {
          id: q.id ?? index,
          question: decodeHTML(q.question ?? ''),
          category: q.category ?? 'Mixed Categories',
          difficulty: q.difficulty ?? 'easy',
          type: q.type ?? 'multiple',
          correct_answer: decodeHTML(correctText),
          incorrect_answers: Array.isArray(q.incorrect_answers)
            ? q.incorrect_answers.map((x) => decodeHTML(x))
            : [],
          multiple_choice: choices,
        };
      });

      return {
        success: true,
        data: normalizedMock,
        total: normalizedMock.length,
        category: 'Mixed Categories',
        difficulty: 'easy',
      };
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${OPENTDB_BASE_URL}/api_category.php`);
      return response.data.trivia_categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
};

export default quizService;