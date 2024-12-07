import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';
export type Language = 'ja' | 'en';
export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ViewMode = 'month' | 'week';

interface AchievementSettings {
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
  taskSort: TaskSort;
  showCompletedTodos: boolean;
  viewMode: ViewMode;
  colorWeekend: boolean;
}

interface SettingsState {
  theme: Theme;
  fontSize: number;
  calendar: CalendarSettings;
  achievements: AchievementSettings;
  timer: TimerSettings;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setCalendarSetting: <K extends keyof CalendarSettings>(key: K, value: CalendarSettings[K]) => void;
  setAchievementSetting: <K extends keyof AchievementSettings>(key: K, value: AchievementSettings[K]) => void;
  setTimerSetting: <K extends keyof TimerSettings>(key: K, value: TimerSettings[K]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
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
      
      setTheme: (theme) => set({ theme }),
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