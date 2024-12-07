import React, { useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWeekend,
} from 'date-fns';
import { useTodoStore } from '../../store/todoStore';
import { useEventStore } from '../../store/eventStore';
import { Star } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';
import { isHoliday, getHolidayName } from '../../utils/holidays';

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
  const getEventsByDate = useEventStore((state) => state.getEventsByDate);

  // 選択中の日付が変更されたら再レンダリング
  useEffect(() => {
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    const todos = getTodosByDate(selectedDate);
    const events = getEventsByDate(selectedDate);
  }, [selectedDate]);

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
    const events = getEventsByDate(date);
    const totalTime = [...completedTodos, ...incompleteTodos].reduce(
      (acc, todo) => acc + todo.elapsedTime,
      0
    );
    return {
      totalTime,
      completedTodos: completedTodos.length,
      hasTodos: completedTodos.length + incompleteTodos.length > 0,
      hasEvents: events.length > 0,
      events,
    };
  };

  const getWeekendColor = (day: Date) => {
    if (!calendar.colorWeekend) return '';
    
    if (isHoliday(day)) {
      return 'text-red-600 dark:text-red-400';
    }
    
    const dayOfWeek = day.getDay();
    if (dayOfWeek === 0) { // Sunday
      return 'text-red-600 dark:text-red-400';
    }
    if (dayOfWeek === 6) { // Saturday
      return 'text-blue-600 dark:text-blue-400';
    }
    return '';
  };

  const formatEventTime = (event: { startTime?: string; endTime?: string }) => {
    if (event.startTime && event.endTime) {
      return `${event.startTime} - ${event.endTime}`;
    }
    if (event.startTime) {
      return `${event.startTime}から`;
    }
    if (event.endTime) {
      return `${event.endTime}まで`;
    }
    return '';
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {rotatedWeekdays.map((day, index) => {
        const dayIndex = (index + calendar.weekStart) % 7;
        const weekendColor = calendar.colorWeekend ? (
          dayIndex === 0 ? 'text-red-500 dark:text-red-400' :
          dayIndex === 6 ? 'text-blue-500 dark:text-blue-400' :
          'text-gray-500 dark:text-gray-400'
        ) : 'text-gray-500 dark:text-gray-400';

        return (
          <div
            key={index}
            className={`h-8 flex items-center justify-center text-sm font-medium ${weekendColor}`}
          >
            {day}
          </div>
        );
      })}
      {days.map((day) => {
        const { totalTime, completedTodos, hasTodos, hasEvents, events } = getDayStats(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isSelected = isSameDay(day, selectedDate);
        const weekendColor = getWeekendColor(day);
        const holidayName = getHolidayName(day);

        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={`
              min-h-[6rem] p-1 relative rounded-lg flex flex-col
              ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
              ${isSelected ? 'ring-2 ring-blue-500' : ''}
              ${hasTodos || hasEvents ? 'hover:bg-blue-50 dark:hover:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              ${weekendColor || 'text-gray-900 dark:text-gray-100'}
            `}
            title={holidayName}
          >
            <div className="text-sm mb-1">
              {format(day, 'd')}
            </div>
            {holidayName && (
              <div className="text-xs text-red-600 dark:text-red-400 truncate">
                {holidayName}
              </div>
            )}
            {(hasTodos || hasEvents) && (
              <div className="flex-1 flex flex-col gap-1">
                {hasTodos && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {Math.floor(totalTime / 60)}h{totalTime % 60}m
                  </div>
                )}
                {hasEvents && (
                  <div className="flex flex-col gap-0.5">
                    {events.slice(0, 3).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded truncate bg-${event.color}-100 text-${event.color}-700 dark:bg-${event.color}-900 dark:text-${event.color}-300`}
                        title={`${event.title}\n${formatEventTime(event)}`}
                      >
                        <span className="font-medium">{event.title}</span>
                        {event.startTime && (
                          <span className="ml-1 opacity-75">
                            {event.startTime}
                          </span>
                        )}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                )}
                {completedTodos > 0 && (
                  <Star className="w-3 h-3 text-yellow-500 absolute bottom-1 right-1" />
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CalendarGrid;