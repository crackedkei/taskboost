import React from 'react';
import { Trophy, BarChart2, RefreshCcw, Medal } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useAchievementStore } from '../../store/achievementStore';
import { useTranslation } from '../../hooks/useTranslation';

const AchievementSettings = () => {
  const { t } = useTranslation();
  const { achievements: achievementSettings, setAchievementSetting } = useSettingsStore();
  const { resetProgress } = useAchievementStore();

  const handleReset = () => {
    if (window.confirm(t('achievements.settings.resetConfirm'))) {
      resetProgress();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <BarChart2 className="w-4 h-4" />
          {t('achievements.settings.graphPeriod')}
        </label>
        <select
          value={achievementSettings.graphPeriod}
          onChange={(e) => setAchievementSetting('graphPeriod', e.target.value as any)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          <option value="all">{t('achievements.settings.periodAll')}</option>
          <option value="year">{t('achievements.settings.periodYear')}</option>
          <option value="month">{t('achievements.settings.periodMonth')}</option>
          <option value="week">{t('achievements.settings.periodWeek')}</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Medal className="w-4 h-4" />
          {t('achievements.settings.hideUnearned')}
        </label>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={achievementSettings.hideUnearned}
              onChange={(e) => setAchievementSetting('hideUnearned', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <RefreshCcw className="w-4 h-4" />
          {t('achievements.settings.reset')}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {t('achievements.settings.resetDescription')}
        </p>
        <button
          onClick={handleReset}
          className="btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
        >
          {t('achievements.settings.resetButton')}
        </button>
      </div>
    </div>
  );
};

export default AchievementSettings;