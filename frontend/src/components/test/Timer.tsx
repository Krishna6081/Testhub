import React, { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  durationMinutes: number;
  startTime: string | Date;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ durationMinutes, startTime, onTimeUp }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    const startMs = new Date(startTime).getTime();
    const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
    const totalSeconds = durationMinutes * 60;
    return Math.max(0, totalSeconds - elapsedSeconds);
  });

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    const timerId = setInterval(() => {
      const startMs = new Date(startTime).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startMs) / 1000);
      const totalSeconds = durationMinutes * 60;
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);

      setSecondsRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timerId);
        onTimeUpRef.current();
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [startTime, durationMinutes]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const isLowTime = secondsRemaining <= 180; // 3 mins or less
  const isCriticalTime = secondsRemaining <= 60; // 1 min or less

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
        isCriticalTime
          ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/20'
          : isLowTime
          ? 'bg-amber-100 text-amber-900 border-amber-300'
          : 'bg-white text-slate-800 border-slate-200 shadow-xs'
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-current animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-brand-600" />
      )}
      <span className="font-mono tracking-wider text-base">
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
      {isLowTime && <span className="text-[10px] uppercase tracking-wider font-extrabold ml-1">Time Low</span>}
    </div>
  );
};
