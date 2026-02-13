import React from 'react';

const AnswerOption = ({ option, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
        ${isSelected 
          ? 'bg-white border-primary shadow-md scale-[1.02]' 
          : 'bg-earth-surface border-secondary-light hover:border-primary hover:bg-white hover:translate-x-1'
        }
      `}
    >
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
      
      <span className={`
        flex-1 text-left text-sm md:text-base leading-relaxed
        ${isSelected ? 'text-brown font-medium' : 'text-brown-light'}
      `}>
        {option.text}
      </span>
    </button>
  );
};

export default AnswerOption;