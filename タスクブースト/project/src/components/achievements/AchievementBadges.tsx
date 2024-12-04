import React from 'react';
import { format, parseISO } from 'date-fns';
import { Check } from 'lucide-react';
import { useAchievementStore } from '../../store/achievementStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

const AchievementBadges = () => {
  const { t } = useTranslation();
  const { achievements } = useAchievementStore();
  const { achievements: achievementSettings } = useSettingsStore();

  const visibleAchievements = achievementSettings.hideUnearned
    ? achievements.filter(a => a.acquired)
    : achievements;

  return (
    <div className="grid grid-cols-2 gap-4">
      {visibleAchievements.map((achievement) => (
        <div
          key={achievement.id}
          className={`p-4 rounded-lg border ${
            achievement.acquired
              ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800'
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {achievement.acquired && <Check className="w-4 h-4 text-green-500" />}
            <h4 className="font-medium">{t(`achievements.badge.${achievement.id}.title`)}</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t(`achievements.badge.${achievement.id}.description`)}
          </p>
          {achievement.acquiredAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('achievements.acquiredAt', { date: format(parseISO(achievement.acquiredAt), 'yyyy/MM/dd HH:mm') })}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AchievementBadges;