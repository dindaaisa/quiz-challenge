// src/components/quiz/QuizCard.jsx
import React from 'react';
import AnswerOption from './AnswerOption';

const QuizCard = ({ question, selectedAnswer, onSelectAnswer, questionNumber, totalQuestions, categoryLabel }) => {
  if (!question) return null;

  const categoryText = categoryLabel || question.category || 'Mixed';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold text-brown">
          Soal {questionNumber} dari {totalQuestions}
        </div>

        <div className="px-3 py-1 rounded-full bg-earth-surface border border-secondary-light text-xs font-semibold text-brown">
          {categoryText}
        </div>
      </div>

      <div className="text-xl md:text-2xl font-bold text-brown mb-6 leading-snug">
        {question.question}
      </div>

      <div className="space-y-3">
        {(question.multiple_choice || []).map((opt, idx) => (
          <AnswerOption
            key={opt?.id ?? idx}
            option={opt}
            index={idx}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={onSelectAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizCard;