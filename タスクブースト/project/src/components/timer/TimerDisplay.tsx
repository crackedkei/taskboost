import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Check, StopCircle } from 'lucide-react';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { format, addSeconds, isAfter } from 'date-fns';

const TimerDisplay = () => {
  const {
    currentTime,
    elapsedTime,
    isRunning,
    isStopwatchMode,
    selectedPreset,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completeTask,
    startStopwatch,
  } = useTimerStore();

  const { timer: timerSettings } = useSettingsStore();
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isOvertime, setIsOvertime] = useState(false);
  const [secondDegrees, setSecondDegrees] = useState(now.getSeconds() * 6);

  // 時計の更新（時・分）
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      setNow(newDate);
      
      // 終了時刻を過ぎているかチェック
      if (endTime && isAfter(newDate, endTime)) {
        setIsOvertime(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  // 秒針の更新（独立して動作）
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondDegrees(prev => (prev + 6) % 360);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // タイマーの更新
  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => tick(), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  // 終了時刻の更新
  useEffect(() => {
    if (selectedPreset && !isStopwatchMode) {
      if (isRunning) {
        const newEndTime = addSeconds(new Date(), currentTime);
        setEndTime(newEndTime);
        setIsOvertime(isAfter(new Date(), newEndTime));
      }
    } else {
      setEndTime(null);
      setIsOvertime(false);
    }
  }, [selectedPreset, isStopwatchMode, isRunning, currentTime]);

  const handlePlayPause = () => {
    if (isStopwatchMode) {
      isRunning ? pauseTimer() : startStopwatch();
    } else if (selectedPreset) {
      if (isRunning) {
        pauseTimer();
      } else {
        currentTime < selectedPreset.minutes * 60 ? resumeTimer() : startTimer(selectedPreset);
      }
    }
  };

  const minutes = now.getMinutes();
  const hours = now.getHours();

  // タイマーの進捗率を計算（0-100）
  const progress = selectedPreset && !isStopwatchMode
    ? ((selectedPreset.minutes * 60 - currentTime) / (selectedPreset.minutes * 60)) * 100
    : 0;

  const timeDisplay = isStopwatchMode
    ? `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`
    : `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`;

  return (
    <div className="text-center space-y-4">
      <div className="relative mx-auto" style={{ width: `${timerSettings.size}rem`, height: `${timerSettings.size}rem` }}>
        {timerSettings.clockMode ? (
          // 時計モード
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700">
            {/* 時計の数字 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
              const angle = (num * 30 - 90) * (Math.PI / 180);
              const radius = timerSettings.size * 0.4;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <span
                  key={num}
                  className="absolute text-sm text-gray-600 dark:text-gray-400"
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
            
            {/* 時針 */}
            <div
              className="absolute w-1 bg-gray-600 dark:bg-gray-400 rounded-full transform origin-bottom transition-transform duration-300"
              style={{
                height: `${timerSettings.size * 0.3}rem`,
                left: '50%',
                bottom: '50%',
                transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)`,
              }}
            />
            
            {/* 分針 */}
            <div
              className="absolute w-0.5 bg-gray-600 dark:bg-gray-400 rounded-full transform origin-bottom transition-transform duration-300"
              style={{
                height: `${timerSettings.size * 0.4}rem`,
                left: '50%',
                bottom: '50%',
                transform: `rotate(${minutes * 6}deg)`,
              }}
            />

            {/* 秒針 */}
            <div
              className="absolute w-0.5 bg-red-500 rounded-full transform origin-bottom"
              style={{
                height: `${timerSettings.size * 0.45}rem`,
                left: '50%',
                bottom: '50%',
                transform: `rotate(${secondDegrees}deg)`,
              }}
            />

            {/* 中心点 */}
            <div
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* 時計モードでのみ終了時刻を表示 */}
            {endTime && !isOvertime && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('timer.endTime')}: {format(endTime, 'HH:mm:ss')}
              </div>
            )}

            {isOvertime && isRunning && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {t('timer.overtime')}
              </div>
            )}
          </div>
        ) : (
          // 円形タイマーモード
          <>
            {/* 背景の円 */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700" />
            
            {/* プログレス円 */}
            {selectedPreset && (
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
            )}
            
            {/* 時間表示 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold font-mono">
                {timeDisplay}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* コントロールボタン */}
      <div className="flex justify-center gap-4 mt-8">
        {selectedPreset?.todoId && (
          <button
            onClick={completeTask}
            className="btn btn-primary bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          >
            <Check className="w-6 h-6" />
          </button>
        )}
        
        <button
          onClick={handlePlayPause}
          disabled={!selectedPreset && !isStopwatchMode}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={resetTimer}
          disabled={!selectedPreset}
          className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-6 h-6" />
        </button>

        {isStopwatchMode && (
          <button
            onClick={completeTask}
            className="btn btn-secondary"
          >
            <StopCircle className="w-6 h-6" />
          </button>
        )}
      </div>

      {selectedPreset?.todoId && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('timer.elapsed')}: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;