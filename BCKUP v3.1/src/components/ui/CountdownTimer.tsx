'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
  accentColor?: string;
}

export function CountdownTimer({ targetDate, label, accentColor = 'var(--color-primary)' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-4">
        <Timer className="w-5 h-5" style={{ color: accentColor }} />
        <span className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{label || 'Countdown'}</span>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Mins' },
          { value: timeLeft.seconds, label: 'Secs' },
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl font-black text-white leading-none mb-1">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
