// src/components/quiz/QuizTimer.jsx
import React, { useEffect } from 'react';

const formatMMSS = (totalSeconds) => {
  const s = Math.max(0, Number(totalSeconds || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const QuizTimer = ({ timeRemaining, setTimeRemaining, onTimeUp }) => {
  useEffect(() => {
    if (timeRemaining === null || timeRemaining === undefined) return;

    if (timeRemaining <= 0) {
      if (typeof onTimeUp === 'function') onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = (prev ?? 0) - 1;
        if (next <= 0) {
          clearInterval(timerId);
          if (typeof onTimeUp === 'function') onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeRemaining, setTimeRemaining, onTimeUp]);

  // ✅ PERBAIKAN: Return JSX element dengan styling yang sangat visible
  return (
    <div className="flex items-center justify-center min-w-[70px]">
      <span 
        className="font-mono font-bold text-2xl tracking-wider text-white"
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.5)',
          letterSpacing: '0.1em'
        }}
      >
        {formatMMSS(timeRemaining)}
      </span>
    </div>
  );
};

export default QuizTimer;