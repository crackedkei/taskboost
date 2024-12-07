import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Trophy, Timer, Settings } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const BottomNavigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/calendar', icon: Calendar, label: t('common.calendar') },
    { to: '/achievements', icon: Trophy, label: t('common.achievements') },
    { to: '/timer', icon: Timer, label: t('common.timer') },
    { to: '/settings', icon: Settings, label: t('common.settings') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;