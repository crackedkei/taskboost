import React from 'react';
import { CalendarDays, AlignLeft, SortAsc, CheckSquare } from 'lucide-react';
import { useSettingsStore, WeekStart, TaskSort } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

const CalendarSettings = () => {
  const { calendar, setCalendarSetting } = useSettingsStore();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <CalendarDays className="w-4 h-4" />
          {t('settings.calendar.weekStart')}
        </label>
        <select
          value={calendar.weekStart}
          onChange={(e) => setCalendarSetting('weekStart', Number(e.target.value) as WeekStart)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {[0, 1, 2, 3, 4, 5, 6].map((value) => (
            <option key={value} value={value}>
              {t(`calendar.weekdays.${value}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <AlignLeft className="w-4 h-4" />
          {t('settings.calendar.todoMemo')}
        </label>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={calendar.showMemo}
              onChange={(e) => setCalendarSetting('showMemo', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <SortAsc className="w-4 h-4" />
          {t('settings.calendar.taskSort')}
        </label>
        <select
          value={calendar.taskSort}
          onChange={(e) => setCalendarSetting('taskSort', e.target.value as TaskSort)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {(['priority', 'added', 'time'] as TaskSort[]).map((sort) => (
            <option key={sort} value={sort}>
              {t(`settings.calendar.sortOptions.${sort}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <CheckSquare className="w-4 h-4" />
          {t('settings.calendar.showCompleted')}
        </label>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={calendar.showCompletedTodos}
              onChange={(e) => setCalendarSetting('showCompletedTodos', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CalendarSettings;