import React from 'react';
import { format, compareDesc } from 'date-fns';
import { useAchievementStore } from '../../store/achievementStore';
import { useTranslation } from '../../hooks/useTranslation';

const AchievementHistory = () => {
  const { t } = useTranslation();
  const { goals } = useAchievementStore();
  
  // Sort goals by creation date in descending order (newest first)
  const completedGoals = goals
    .filter(goal => goal.status === 'completed')
    .sort((a, b) => compareDesc(new Date(a.createdAt), new Date(b.createdAt)));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('achievements.history.title')}</h2>
      <div className="space-y-4">
        {completedGoals.map((goal) => (
          <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-lg">
                  {goal.type === 'daily' && t('achievements.setGoal.daily')}
                  {goal.type === 'weekly' && t('achievements.setGoal.weekly')}
                  {goal.type === 'monthly' && t('achievements.setGoal.monthly')}
                  {goal.type === 'final' && t('achievements.setGoal.final')}
                  {': '}{goal.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(goal.createdAt), 'yyyy/MM/dd')}
                  {goal.deadline && ` - ${format(new Date(goal.deadline), 'yyyy/MM/dd')}`}
                </p>
              </div>
              {goal.reflection?.score && (
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {goal.reflection.score} {t('achievements.reflection.points')}
                </div>
              )}
            </div>
            
            {goal.description && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">{goal.description}</p>
            )}
            
            {goal.reflection && (
              <div className="space-y-2 text-sm">
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {t('achievements.reflection.keep')}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{goal.reflection.keep}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {t('achievements.reflection.problem')}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{goal.reflection.problem}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {t('achievements.reflection.try')}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{goal.reflection.try}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementHistory;