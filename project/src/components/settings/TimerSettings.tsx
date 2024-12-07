import React from 'react';
import { Clock, Maximize2, Coffee, Plus, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

const TimerSettings = () => {
  const { t } = useTranslation();
  const { timer: timerSettings, setTimerSetting } = useSettingsStore();

  const handleAddPreset = () => {
    if (timerSettings.breakPresets.length >= 5) return;
    const newPreset = window.prompt(t('settings.timer.addPresetPrompt'));
    if (newPreset) {
      const minutes = parseInt(newPreset);
      if (!isNaN(minutes) && minutes > 0 && minutes <= 60) {
        const newPresets = [...timerSettings.breakPresets, minutes].sort((a, b) => a - b);
        setTimerSetting('breakPresets', newPresets);
      }
    }
  };

  const handleRemovePreset = (index: number) => {
    if (timerSettings.breakPresets.length <= 1) return;
    const newPresets = timerSettings.breakPresets.filter((_, i) => i !== index);
    setTimerSetting('breakPresets', newPresets);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Maximize2 className="w-4 h-4" />
          {t('settings.timer.size')}
        </label>
        <input
          type="range"
          min="10"
          max="22"
          value={timerSettings.size}
          onChange={(e) => setTimerSetting('size', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>10rem</span>
          <span>22rem</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Clock className="w-4 h-4" />
          {t('settings.timer.clockMode')}
        </label>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={timerSettings.clockMode}
              onChange={(e) => setTimerSetting('clockMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Coffee className="w-4 h-4" />
            {t('settings.timer.breakPresets')}
          </label>
          {timerSettings.breakPresets.length < 5 && (
            <button
              onClick={handleAddPreset}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500"
              title={t('settings.timer.addPreset')}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="space-y-2">
          {timerSettings.breakPresets.map((minutes, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span>{minutes} {t('timer.minutes')}</span>
              {timerSettings.breakPresets.length > 1 && (
                <button
                  onClick={() => handleRemovePreset(index)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
                  title={t('settings.timer.removePreset')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;