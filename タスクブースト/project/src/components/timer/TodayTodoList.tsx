import React from 'react';
import { Play, Clock } from 'lucide-react';
import { useTodoStore } from '../../store/todoStore';
import { useTimerStore, TimerPreset } from '../../store/timerStore';
import { useTranslation } from '../../hooks/useTranslation';

const TodayTodoList = () => {
  const { getTodosByDate } = useTodoStore();
  const { startTimer } = useTimerStore();
  const { t } = useTranslation();
  const today = new Date();
  const { incompleteTodos } = getTodosByDate(today);

  const handleStartTimer = (todo: { id: string; estimatedTime: number }) => {
    const taskPreset: TimerPreset = {
      id: 'task',
      type: 'task',
      minutes: todo.estimatedTime,
      todoId: todo.id,
    };
    startTimer(taskPreset);
  };

  if (incompleteTodos.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-4">
        {t('timer.noTasks')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {incompleteTodos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex-1">
            <div className="font-medium">{todo.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {todo.estimatedTime}{t('timer.minutes')}
            </div>
          </div>
          <button
            onClick={() => handleStartTimer(todo)}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900"
          >
            <Play className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TodayTodoList;