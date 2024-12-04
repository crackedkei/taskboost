import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday, startOfMonth } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import CalendarGrid from '../components/calendar/CalendarGrid';
import TodoList from '../components/calendar/TodoList';
import { Todo } from '../store/todoStore';
import { useTranslation } from '../hooks/useTranslation';
import DateDisplay from '../components/calendar/DateDisplay';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleStartTimer = (todo: Todo) => {
    navigate('/timer', { 
      state: { 
        todoId: todo.id,
        autoStart: true
      } 
    });
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    // 選択中の日付が前月の日付なら、その日付を維持
    if (selectedDate < startOfMonth(currentDate)) {
      setSelectedDate(selectedDate);
    } else {
      // そうでなければ新しい月の1日を選択
      setSelectedDate(startOfMonth(newDate));
    }
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    // 選択中の日付が次月の日付なら、その日付を維持
    if (selectedDate > startOfMonth(addMonths(currentDate, 1))) {
      setSelectedDate(selectedDate);
    } else {
      // そうでなければ新しい月の1日を選択
      setSelectedDate(startOfMonth(newDate));
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // 表示月が変更された時に、選択日付が表示月に含まれていない場合は1日に設定
  useEffect(() => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const startOfNextMonth = startOfMonth(addMonths(currentDate, 1));
    
    if (selectedDate < startOfCurrentMonth || selectedDate >= startOfNextMonth) {
      setSelectedDate(startOfCurrentMonth);
    }
  }, [currentDate]);

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
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          <DateDisplay date={selectedDate} type="todosForDate" />
        </h2>
        <TodoList 
          date={selectedDate} 
          onStartTimer={handleStartTimer}
        />
      </div>
    </div>
  );
};

export default Calendar;