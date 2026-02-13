// src/components/quiz/QuizCard.jsx
import React from 'react';

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
        {(question.multiple_choice || []).map((opt, idx) => {
          // ✅ PERBAIKAN: Hitung isSelected di sini
          const isSelected = selectedAnswer?.id === opt?.id;

          return (
            <button
              key={opt?.id ?? idx}
              onClick={() => onSelectAnswer(opt)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'bg-white border-primary shadow-md scale-[1.02]' 
                  : 'bg-earth-surface border-secondary-light hover:border-primary hover:bg-white hover:translate-x-1'
                }
              `}
            >
              {/* Radio Circle */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${isSelected 
                  ? 'border-primary bg-primary' 
                  : 'border-secondary-light bg-white'
                }
              `}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              
              {/* Text */}
              <span className={`
                flex-1 text-left text-sm md:text-base leading-relaxed
                ${isSelected ? 'text-brown font-medium' : 'text-brown-light'}
              `}>
                {opt?.text || opt?.label || opt?.answer || ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCard;