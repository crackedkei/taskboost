import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTodoStore } from '../store/todoStore';
import { useTimerStore, TimerPreset } from '../store/timerStore';
import TimerDisplay from '../components/timer/TimerDisplay';
import TimerPresetButton from '../components/timer/TimerPresetButton';
import TodayTodoList from '../components/timer/TodayTodoList';
import { useTranslation } from '../hooks/useTranslation';

const Timer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { todoId, autoStart } = location.state || {};
  const todo = todoId ? useTodoStore((state) => 
    state.todos.find((t) => t.id === todoId)
  ) : null;

  const { presets, selectedPreset, startTimer } = useTimerStore();

  useEffect(() => {
    if (todo && autoStart) {
      const taskPreset: TimerPreset = {
        id: 'task',
        type: 'task',
        minutes: todo.estimatedTime,
        todoId: todo.id,
      };
      startTimer(taskPreset);
    }
  }, [todo, autoStart, startTimer]);

  const breakPresets = presets.filter((p) => p.type === 'break');

  return (
    <div className="py-6 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{t('timer.timerTitle')}</h1>
        {todo && (
          <p className="text-gray-600">
            {t('timer.task')}: {todo.title} ({todo.estimatedTime}{t('timer.minutes')})
          </p>
        )}
      </div>

      <TimerDisplay />

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium mb-2">{t('timer.breakTime')}</h2>
          <div className="flex gap-2 flex-wrap">
            {breakPresets.map((preset) => (
              <TimerPresetButton
                key={preset.id}
                preset={preset}
                onClick={() => startTimer(preset)}
                isSelected={selectedPreset?.id === preset.id}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">{t('timer.todaysTodos')}</h2>
          <TodayTodoList />
        </div>
      </div>
    </div>
  );
};

export default Timer;