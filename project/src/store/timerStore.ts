import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useTodoStore } from './todoStore';
import { useSettingsStore } from './settingsStore';

export type TimerType = 'task' | 'break' | 'study';
export type TimerPreset = {
  id: string;
  type: TimerType;
  minutes: number;
  todoId?: string;
  returnToCalendar?: boolean;
};

interface TimerState {
  isRunning: boolean;
  currentTime: number;
  elapsedTime: number;
  selectedPreset: TimerPreset | null;
  presets: TimerPreset[];
  isStopwatchMode: boolean;
  addPreset: (type: TimerType, minutes: number) => void;
  removePreset: (id: string) => void;
  startTimer: (preset: TimerPreset) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  completeTask: () => void;
  startStopwatch: () => void;
  updateElapsedTime: (time: number) => void;
  updatePresets: () => void;
}

const createPreset = (type: TimerType, minutes: number): TimerPreset => ({
  id: crypto.randomUUID(),
  type,
  minutes,
});

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      currentTime: 0,
      elapsedTime: 0,
      selectedPreset: null,
      presets: [],
      isStopwatchMode: false,

      addPreset: (type, minutes) => {
        const newPreset = createPreset(type, minutes);
        set((state) => ({
          presets: [...state.presets, newPreset],
        }));
      },

      removePreset: (id) => {
        set((state) => ({
          presets: state.presets.filter((preset) => preset.id !== id),
        }));
      },

      startTimer: (preset) => {
        set({
          isRunning: true,
          currentTime: preset.minutes * 60,
          selectedPreset: preset,
          isStopwatchMode: false,
          elapsedTime: 0,
        });
      },

      pauseTimer: () => {
        set({ isRunning: false });
      },

      resumeTimer: () => {
        set({ isRunning: true });
      },

      resetTimer: () => {
        const { selectedPreset } = get();
        if (selectedPreset) {
          set({ 
            currentTime: selectedPreset.minutes * 60,
            elapsedTime: 0,
            isRunning: false,
          });
        }
      },

      tick: () => {
        const { currentTime, isRunning, selectedPreset, isStopwatchMode } = get();
        if (!isRunning) return;

        if (isStopwatchMode) {
          set((state) => ({ elapsedTime: state.elapsedTime + 1 }));
          return;
        }

        if (currentTime > 0) {
          set((state) => ({ 
            currentTime: state.currentTime - 1,
            elapsedTime: state.elapsedTime + 1,
          }));
        } else {
          set({ isRunning: false });
          
          if (selectedPreset?.todoId) {
            set({ isStopwatchMode: true });
          }
        }
      },

      completeTask: () => {
        const { selectedPreset, elapsedTime } = get();
        if (selectedPreset?.todoId) {
          const updateTodo = useTodoStore.getState().updateTodo;
          updateTodo(selectedPreset.todoId, {
            completed: true,
            elapsedTime: Math.floor(elapsedTime / 60),
          });
        }
        set({
          isRunning: false,
          selectedPreset: null,
          isStopwatchMode: false,
          elapsedTime: 0,
          currentTime: 0,
        });
      },

      startStopwatch: () => {
        set({
          isStopwatchMode: true,
          isRunning: true,
        });
      },

      updateElapsedTime: (time: number) => {
        set({ elapsedTime: time });
      },

      updatePresets: () => {
        const { timer } = useSettingsStore.getState();
        const breakPresets = timer.breakPresets.map(minutes => createPreset('break', minutes));
        const studyPresets = [
          createPreset('study', 15),
          createPreset('study', 25),
        ];
        set({ presets: [...breakPresets, ...studyPresets] });
      },
    }),
    {
      name: 'timer-storage',
    }
  )
);

// 設定の変更を監視して自動的にプリセットを更新
useSettingsStore.subscribe(
  (state) => state.timer.breakPresets,
  () => {
    useTimerStore.getState().updatePresets();
  }
);