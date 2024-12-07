import React, { useState } from 'react';
import { Moon, Sun, Type, Database, AlertTriangle, RotateCcw } from 'lucide-react';
import { useSettingsStore, Theme } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useTodoStore } from '../../store/todoStore';
import { useAchievementStore } from '../../store/achievementStore';
import { useEventStore } from '../../store/eventStore';
import DataManagement from './DataManagement';

const SystemSettings = () => {
  const {
    theme,
    fontSize,
    setTheme,
    setFontSize,
  } = useSettingsStore();
  const { t } = useTranslation();
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: t('settings.light'), icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: t('settings.dark'), icon: <Moon className="w-4 h-4" /> },
  ];

  const handleResetAll = () => {
    // すべてのストアをリセット
    useSettingsStore.persist.clearStorage();
    useTodoStore.persist.clearStorage();
    useAchievementStore.persist.clearStorage();
    useEventStore.persist.clearStorage();
    
    // ページをリロード
    window.location.reload();
  };

  const handleResetSettings = () => {
    // 設定のみをデフォルトに戻す
    useSettingsStore.setState({
      theme: 'light',
      fontSize: 12,
      calendar: {
        weekStart: 0,
        taskSort: 'priority',
        showCompletedTodos: true,
        viewMode: 'month',
        colorWeekend: true,
      },
      achievements: {
        hideUnearned: false,
      },
      timer: {
        size: 16,
        clockMode: false,
        breakPresets: [3, 5],
      },
    });
    setShowResetConfirm(false);
  };

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
          <Type className="w-4 h-4" />
          {t('settings.fontSize')}: {fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>8px</span>
          <span>24px</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Database className="w-4 h-4" />
          {t('settings.data.title')}
        </label>
        <DataManagement />
      </div>

      <div className="border-t dark:border-gray-700 pt-4">
        <div className="space-y-4">
          {!showResetConfirm && !showFirstConfirm && !showSecondConfirm && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                設定をデフォルトに戻す
              </button>
              <button
                onClick={() => setShowFirstConfirm(true)}
                className="btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 inline-flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                すべてのデータをリセット
              </button>
            </div>
          )}

          {showResetConfirm && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg">
                <p className="font-medium">設定をデフォルトに戻しますか？</p>
                <p className="text-sm mt-1">
                  この操作により以下の設定が初期値に戻ります：
                </p>
                <ul className="text-sm mt-2 list-disc list-inside">
                  <li>テーマ設定</li>
                  <li>フォントサイズ</li>
                  <li>カレンダー表示設定</li>
                  <li>タイマー設定</li>
                  <li>実績表示設定</li>
                </ul>
                <p className="text-sm mt-2">
                  ※タスク、イベント、実績データは保持されます
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="btn btn-secondary flex-1"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleResetSettings}
                  className="btn btn-primary flex-1"
                >
                  設定をリセット
                </button>
              </div>
            </div>
          )}

          {showFirstConfirm && !showSecondConfirm && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p className="font-medium">本当にすべてのデータをリセットしますか？</p>
                <p className="text-sm mt-1">この操作により以下のデータがすべて削除されます：</p>
                <ul className="text-sm mt-2 list-disc list-inside">
                  <li>タスクとカテゴリー</li>
                  <li>イベント</li>
                  <li>実績と目標</li>
                  <li>設定内容</li>
                </ul>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFirstConfirm(false)}
                  className="btn btn-secondary flex-1"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowFirstConfirm(false);
                    setShowSecondConfirm(true);
                  }}
                  className="btn btn-secondary text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 flex-1"
                >
                  リセットする
                </button>
              </div>
            </div>
          )}

          {showSecondConfirm && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg">
                <p className="font-medium">最終確認</p>
                <p className="text-sm mt-1">
                  この操作は取り消すことができません。本当にすべてのデータをリセットしますか？
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowFirstConfirm(false);
                    setShowSecondConfirm(false);
                  }}
                  className="btn btn-secondary flex-1"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleResetAll}
                  className="btn btn-primary bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white flex-1"
                >
                  すべてのデータをリセット
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;