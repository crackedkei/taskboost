import { create } from 'zustand';
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
}

const getDefaultPresets = () => {
  const { timer } = useSettingsStore.getState();
  return [
    ...timer.breakPresets.map(minutes => ({
      id: crypto.randomUUID(),
      type: 'break' as TimerType,
      minutes
    })),
    { id: '3', type: 'study' as TimerType, minutes: 15 },
    { id: '4', type: 'study' as TimerType, minutes: 25 },
  ];
};

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  currentTime: 0,
  elapsedTime: 0,
  selectedPreset: null,
  presets: getDefaultPresets(),
  isStopwatchMode: false,

  addPreset: (type, minutes) => {
    const newPreset: TimerPreset = {
      id: crypto.randomUUID(),
      type,
      minutes,
    };
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
}));