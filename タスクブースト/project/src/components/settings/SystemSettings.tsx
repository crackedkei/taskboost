import React from 'react';
import { Moon, Sun, Globe2, Type } from 'lucide-react';
import { useSettingsStore, Theme, Language } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

const SystemSettings = () => {
  const {
    theme,
    language,
    fontSize,
    setTheme,
    setLanguage,
    setFontSize,
  } = useSettingsStore();
  const { t } = useTranslation();

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('settings.light'), icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: t('settings.dark'), icon: <Moon className="w-4 h-4" /> },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'ja', label: '日本語' },
    { value: 'en', label: 'English' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Sun className="w-4 h-4" />
          {t('settings.theme')}
        </label>
        <div className="flex gap-2">
          {themeOptions.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Globe2 className="w-4 h-4" />
          {t('settings.language')}
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {languageOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Type className="w-4 h-4" />
          {t('settings.fontSize')}: {fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>12px</span>
          <span>24px</span>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;