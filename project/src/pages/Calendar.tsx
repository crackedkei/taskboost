import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import CalendarGrid from '../components/calendar/CalendarGrid';
import WeekView from '../components/calendar/WeekView';
import TodoList from '../components/calendar/TodoList';
import EventList from '../components/calendar/EventList';
import { Todo } from '../store/todoStore';
import { useTranslation } from '../hooks/useTranslation';
import { useSettingsStore } from '../store/settingsStore';
import DateDisplay from '../components/calendar/DateDisplay';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { calendar } = useSettingsStore();

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleStartTimer = (todo: Todo) => {
    navigate('/timer', { 
      state: { 
        todoId: todo.id,
        autoStart: true
      } 
    });
  };

  // 選択中の日付を再設定して強制的に再レンダリング
  const handleDateChange = () => {
    setSelectedDate(new Date(selectedDate));
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            <DateDisplay date={currentDate} type="monthYear" />
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleTodayClick}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isToday(currentDate) 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">{t('calendar.today')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
        {calendar.viewMode === 'month' ? (
          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            <DateDisplay date={selectedDate} type="todosForDate" />
          </h2>
          <TodoList 
            date={selectedDate} 
            onStartTimer={handleStartTimer}
            onUpdate={handleDateChange}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <EventList 
            date={selectedDate}
            onUpdate={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;