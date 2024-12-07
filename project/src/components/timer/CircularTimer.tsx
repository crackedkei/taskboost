import React from 'react';

interface CircularTimerProps {
  progress: number;
  timeDisplay: string;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ progress, timeDisplay }) => {
  return (
    <>
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700" />
      
      {/* Progress circle */}
      <div 
        className="absolute inset-0 rounded-full border-8 border-blue-500 dark:border-blue-600 transition-all duration-1000"
        style={{
          clipPath: `polygon(50% 50%, 50% 0%, ${progress > 25 ? '100% 0%' : `${50 + (progress * 2)}% 0%`}, ${
            progress > 50 ? '100% 100%' : progress > 25 ? `100% ${progress * 2}%` : '50% 50%'
          }, ${progress > 75 ? '0% 100%' : progress > 50 ? `${100 - (progress - 50) * 2}% 100%` : '50% 50%'}, ${
            progress > 75 ? `0% ${100 - (progress - 75) * 4}%` : '50% 50%'
          })`
        }}
      />
      
      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold font-mono">
          {timeDisplay}
        </div>
      </div>
    </>
  );
};

export default CircularTimer;