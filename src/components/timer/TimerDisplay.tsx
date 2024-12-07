import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Check, StopCircle } from 'lucide-react';
import { useTimerStore } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { addSeconds, isAfter } from 'date-fns';
import ClockFace from './ClockFace';
import CircularTimer from './CircularTimer';

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

  // 時計の更新
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      setNow(newDate);
      
      if (endTime && isAfter(newDate, endTime)) {
        setIsOvertime(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

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

  const timeDisplay = isStopwatchMode
    ? `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`
    : `${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`;

  const progress = selectedPreset && !isStopwatchMode
    ? ((selectedPreset.minutes * 60 - currentTime) / (selectedPreset.minutes * 60)) * 100
    : 0;

  return (
    <div className="text-center space-y-4">
      <div className="relative mx-auto" style={{ width: `${timerSettings.size}rem`, height: `${timerSettings.size}rem` }}>
        {timerSettings.clockMode ? (
          <ClockFace
            now={now}
            size={timerSettings.size}
            endTime={endTime}
            isOvertime={isOvertime}
            isRunning={isRunning}
          />
        ) : (
          <CircularTimer
            progress={progress}
            timeDisplay={timeDisplay}
          />
        )}
      </div>
      
      {/* Control buttons */}
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