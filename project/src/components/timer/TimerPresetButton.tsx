import React from 'react';
import { Timer as TimerIcon, Coffee, BookOpen } from 'lucide-react';
import { TimerPreset, TimerType } from '../../store/timerStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';

interface TimerPresetButtonProps {
  preset: TimerPreset;
  onClick: () => void;
  isSelected: boolean;
}

const icons: Record<TimerType, React.ReactNode> = {
  task: <TimerIcon className="w-5 h-5" />,
  break: <Coffee className="w-5 h-5" />,
  study: <BookOpen className="w-5 h-5" />,
};

const TimerPresetButton: React.FC<TimerPresetButtonProps> = ({
  preset,
  onClick,
  isSelected,
}) => {
  const { t } = useTranslation();
  const { timer: timerSettings } = useSettingsStore();

  // 休憩プリセットの場合、設定で指定されたプリセットのみを表示
  if (preset.type === 'break' && !timerSettings.breakPresets.includes(preset.minutes)) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${
          isSelected
            ? 'bg-blue-500 text-white dark:bg-blue-600'
            : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }
      `}
    >
      {icons[preset.type]}
      <span>{preset.minutes}{t('timer.minutes')}</span>
    </button>
  );
};

export default TimerPresetButton;