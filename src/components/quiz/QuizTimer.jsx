// src/components/quiz/QuizTimer.jsx
import React, { useEffect } from 'react';

const QuizTimer = ({ timeRemaining, setTimeRemaining, onTimeUp, className = '' }) => {
  useEffect(() => {
    if (typeof timeRemaining !== 'number' || timeRemaining <= 0) {
      if (timeRemaining === 0 && typeof onTimeUp === 'function') {
        onTimeUp();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (typeof prev !== 'number') return prev;
        
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerId);
          if (typeof onTimeUp === 'function') {
            onTimeUp();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeRemaining, setTimeRemaining, onTimeUp]);

  // Kalau timeRemaining bukan number, tampilkan loading
  if (typeof timeRemaining !== 'number') {
    return (
      <div className={className}>
        <span className="font-mono font-bold">--:--</span>
      </div>
    );
  }

  const totalSeconds = Math.max(0, Math.floor(timeRemaining));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isLowTime = totalSeconds < 60;

  return (
    <div className={`flex items-center gap-2 ${isLowTime ? 'animate-pulse' : ''} ${className}`}>
      {/* Icon Clock */}
      <svg 
        className="w-5 h-5" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      
      {/* Timer Text */}
      <span className="font-mono font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;