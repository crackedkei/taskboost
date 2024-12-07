import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useTodoStore } from '../../store/todoStore';
import { useEventStore } from '../../store/eventStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { isHoliday } from '../../utils/holidays';

interface WeekViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, onSelectDate, selectedDate }) => {
  const { t } = useTranslation();
  const { calendar } = useSettingsStore();
  const getTodosByDate = useTodoStore((state) => state.getTodosByDate);
  const getEventsByDate = useEventStore((state) => state.getEventsByDate);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: calendar.weekStart });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getWeekendColor = (date: Date) => {
    if (!calendar.colorWeekend) return '';
    
    if (isHoliday(date)) {
      return 'text-red-600 dark:text-red-400';
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) return 'text-red-600 dark:text-red-400';
    if (dayOfWeek === 6) return 'text-blue-600 dark:text-blue-400';
    return '';
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {weekDays.map((day) => {
        const { completedTodos, incompleteTodos } = getTodosByDate(day);
        const events = getEventsByDate(day);
        const weekendColor = getWeekendColor(day);

        return (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDate(day)}
            className={`
              min-h-[8rem] p-2 relative rounded-lg flex flex-col
              bg-white dark:bg-gray-800
              ${format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'ring-2 ring-blue-500' : ''}
              hover:bg-blue-50 dark:hover:bg-blue-900
              ${weekendColor || 'text-gray-900 dark:text-gray-100'}
            `}
          >
            <div className="text-sm font-medium mb-2">
              {format(day, 'M/d')}
            </div>
            
            <div className="flex-1 space-y-1">
              {events.slice(0, 3).map(event => (
                <div
                  key={event.id}
                  className={`text-xs px-1 py-0.5 rounded truncate bg-${event.color}-100 text-${event.color}-700 dark:bg-${event.color}-900 dark:text-${event.color}-300`}
                >
                  {event.startTime && (
                    <span className="mr-1">{event.startTime}</span>
                  )}
                  <span className="font-medium">{event.title}</span>
                </div>
              ))}
              
              {incompleteTodos.length > 0 && (
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {incompleteTodos.length} tasks
                </div>
              )}
              
              {events.length > 3 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  +{events.length - 3} more
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default WeekView;