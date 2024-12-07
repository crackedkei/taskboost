import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useTranslation } from '../../hooks/useTranslation';

interface ClockFaceProps {
  now: Date;
  size: number;
  endTime: Date | null;
  isOvertime: boolean;
  isRunning: boolean;
}

const ClockFace: React.FC<ClockFaceProps> = ({ now, size, endTime, isOvertime, isRunning }) => {
  const { t } = useTranslation();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const secondHandRef = useRef<HTMLDivElement>(null);
  const secondIntervalRef = useRef<number>();

  // 秒針の更新を独立して管理
  useEffect(() => {
    const updateSecondHand = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const millis = now.getMilliseconds();
      
      if (secondHandRef.current) {
        // 秒と小数点以下の時間を考慮して滑らかに回転
        const degrees = (seconds + millis / 1000) * 6;
        secondHandRef.current.style.transform = `rotate(${degrees}deg)`;
      }
    };

    // 初期位置を設定
    updateSecondHand();

    // 60FPSで更新（より滑らかな動き）
    secondIntervalRef.current = window.setInterval(updateSecondHand, 16.67);

    return () => {
      if (secondIntervalRef.current) {
        clearInterval(secondIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700">
      {/* End time display */}
      {endTime && !isOvertime && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
          {t('timer.endTime')}: {format(endTime, 'HH:mm:ss')}
        </div>
      )}

      {isOvertime && isRunning && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-yellow-600 dark:text-yellow-400">
          {t('timer.overtime')}
        </div>
      )}

      {/* Clock numbers */}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
        const angle = (num * 30 - 90) * (Math.PI / 180);
        const radius = size * 0.4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <span
            key={num}
            className="absolute text-sm font-bold text-gray-600 dark:text-gray-400"
            style={{
              left: `calc(50% + ${x}rem)`,
              top: `calc(50% + ${y}rem)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {num}
          </span>
        );
      })}

      {/* Hour hand */}
      <div
        className="absolute w-1 bg-gray-600 dark:bg-gray-400 rounded-full transform origin-bottom"
        style={{
          height: `${size * 0.25}rem`,
          left: '50%',
          bottom: '50%',
          transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`,
          transition: 'transform 0.2s linear',
        }}
      />

      {/* Minute hand */}
      <div
        className="absolute w-0.5 bg-gray-600 dark:bg-gray-400 rounded-full transform origin-bottom"
        style={{
          height: `${size * 0.35}rem`,
          left: '50%',
          bottom: '50%',
          transform: `rotate(${minutes * 6}deg)`,
          transition: 'transform 0.2s linear',
        }}
      />

      {/* Second hand */}
      <div
        ref={secondHandRef}
        className="absolute w-0.5 bg-red-500 rounded-full transform origin-bottom"
        style={{
          height: `${size * 0.4}rem`,
          left: '50%',
          bottom: '50%',
          transition: 'transform linear',
        }}
      />

      {/* Center dot */}
      <div
        className="absolute w-2 h-2 bg-red-500 rounded-full"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};

export default ClockFace;