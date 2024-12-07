import React from 'react';
import { Settings as SettingsIcon, Calendar, Trophy, Timer } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import SystemSettings from '../components/settings/SystemSettings';
import CalendarSettings from '../components/settings/CalendarSettings';
import AchievementSettings from '../components/settings/AchievementSettings';
import TimerSettings from '../components/settings/TimerSettings';

const SettingsBlock = ({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string;
  icon: React.ElementType;
  children?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <div className="space-y-4">
        {children || (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('settings.inProgress')}</p>
        )}
      </div>
    </div>
  );
};

const Settings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t('common.settings')}</h1>
      
      <SettingsBlock 
        title={t('settings.system')} 
        icon={SettingsIcon}
      >
        <SystemSettings />
      </SettingsBlock>

      <SettingsBlock 
        title={t('common.calendar')} 
        icon={Calendar}
      >
        <CalendarSettings />
      </SettingsBlock>

      <SettingsBlock 
        title={t('common.achievements')} 
        icon={Trophy}
      >
        <AchievementSettings />
      </SettingsBlock>

      <SettingsBlock 
        title={t('common.timer')} 
        icon={Timer}
      >
        <TimerSettings />
      </SettingsBlock>
    </div>
  );
};

export default Settings;