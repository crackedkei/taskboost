import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type Language = 'ja' | 'en';
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type GraphPeriod = 'all' | 'year' | 'month' | 'week';

interface AchievementSettings {
  graphPeriod: GraphPeriod;
  hideUnearned: boolean;
}

interface TimerSettings {
  size: number;
  clockMode: boolean;
  breakPresets: number[];
}

export type TaskSort = 'priority' | 'added' | 'time';

interface CalendarSettings {
  weekStart: WeekStart;
  showMemo: boolean;
  taskSort: TaskSort;
  showCompletedTodos: boolean;
}

interface SettingsState {
  theme: Theme;
  language: Language;
  fontSize: number;
  calendar: CalendarSettings;
  achievements: AchievementSettings;
  timer: TimerSettings;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  setFontSize: (size: number) => void;
  setCalendarSetting: <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) => void;
  setAchievementSetting: <K extends keyof AchievementSettings>(key: K, value: AchievementSettings[K]) => void;
  setTimerSetting: <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'ja',
      fontSize: 16,
      calendar: {
        weekStart: 0,
        showMemo: true,
        taskSort: 'priority',
        showCompletedTodos: true,
      },
      achievements: {
        graphPeriod: 'all',
        hideUnearned: false,
      },
      timer: {
        size: 16, // デフォルトサイズを16remに変更
        clockMode: false,
        breakPresets: [3, 5],
      },
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setCalendarSetting: (key, value) => 
        set((state) => ({
          calendar: {
            ...state.calendar,
            [key]: value,
          },
        })),
      setAchievementSetting: (key, value) =>
        set((state) => ({
          achievements: {
            ...state.achievements,
            [key]: value,
          },
        })),
      setTimerSetting: (key, value) =>
        set((state) => ({
          timer: {
            ...state.timer,
            [key]: value,
          },
        })),
    }),
    {
      name: 'settings-storage',
    }
  )
);