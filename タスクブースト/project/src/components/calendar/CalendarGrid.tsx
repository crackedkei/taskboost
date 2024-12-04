import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { useTodoStore } from '../../store/todoStore';
import { Star } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';

interface CalendarGridProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  onSelectDate,
  selectedDate,
}) => {
  const { t } = useTranslation();
  const { calendar } = useSettingsStore();
  const getTodosByDate = useTodoStore((state) => state.getTodosByDate);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: calendar.weekStart });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: calendar.weekStart });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekdays = t('calendar.weekdays');
  const rotatedWeekdays = [
    ...weekdays.slice(calendar.weekStart),
    ...weekdays.slice(0, calendar.weekStart)
  ];

  const getDayStats = (date: Date) => {
    const { completedTodos, incompleteTodos } = getTodosByDate(date);
    const totalTime = [...completedTodos, ...incompleteTodos].reduce(
      (acc, todo) => acc + todo.elapsedTime,
      0
    );
    return {
      totalTime,
      completedTodos: completedTodos.length,
      hasTodos: completedTodos.length + incompleteTodos.length > 0,
    };
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {rotatedWeekdays.map((day, index) => (
        <div
          key={index}
          className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          {day}
        </div>
      ))}
      {days.map((day) => {
        const { totalTime, completedTodos, hasTodos } = getDayStats(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isSelected = isSameDay(day, selectedDate);

        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={`
              aspect-square p-1 relative rounded-lg
              ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
              ${isSelected ? 'ring-2 ring-blue-500' : ''}
              ${hasTodos ? 'hover:bg-blue-50 dark:hover:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              text-gray-900 dark:text-gray-100
            `}
          >
            <div className="text-sm mb-1">
              {format(day, 'd')}
            </div>
            {hasTodos && (
              <>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {Math.floor(totalTime / 60)}h{totalTime % 60}m
                </div>
                {completedTodos > 0 && (
                  <Star className="w-3 h-3 text-yellow-500 absolute bottom-1 right-1" />
                )}
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CalendarGrid;