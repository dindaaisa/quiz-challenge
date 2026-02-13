import React from 'react';

const AnswerOption = ({
  option,
  index,
  selectedAnswer,
  onSelectAnswer,
  disabled = false
}) => {
  // ✅ Logic untuk check apakah option ini yang dipilih
  const isSelected = React.useMemo(() => {
    if (!selectedAnswer || !option) return false;
    
    // Jika selectedAnswer adalah object dengan text/id
    if (typeof selectedAnswer === 'object') {
      // Compare by text first (most reliable)
      if (selectedAnswer.text && option.text) {
        return selectedAnswer.text === option.text;
      }
      // Then by id
      if (selectedAnswer.id !== undefined && option.id !== undefined) {
        return selectedAnswer.id === option.id;
      }
    }
    
    // Jika selectedAnswer adalah string, compare dengan option.text
    if (typeof selectedAnswer === 'string') {
      return selectedAnswer === option.text;
    }
    
    return false;
  }, [selectedAnswer, option]);

  return (
    <button
      onClick={() => !disabled && onSelectAnswer(option)}
      disabled={disabled}
      type="button"
      className={`
        w-full p-4 rounded-xl border-2 text-left
        transition-all duration-300 ease-in-out
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-md' 
          : 'border-secondary-light bg-white hover:border-primary hover:bg-earth-surface'
        }
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${!isSelected && !disabled ? 'hover:translate-x-1' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Option Indicator */}
        <div className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
          transition-all duration-300
          ${isSelected 
            ? 'bg-primary border-primary' 
            : 'border-secondary-light bg-white'
          }
        `}>
          {isSelected && (
            <svg 
              className="w-4 h-4 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline 
                points="20 6 9 17 4 12" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        {/* Option Text */}
        <span className={`
          text-base leading-relaxed
          ${isSelected ? 'text-brown font-semibold' : 'text-brown'}
        `}>
          {option.text}
        </span>
      </div>
    </button>
  );
};

export default AnswerOption;