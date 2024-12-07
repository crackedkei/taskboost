import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, parseISO, endOfDay, endOfWeek, endOfMonth } from 'date-fns';

export type GoalType = 'daily' | 'weekly' | 'monthly' | 'final';
export type GoalStatus = 'active' | 'completed' | 'abandoned';

export interface Goal {
  id: string;
  type: GoalType;
  title: string;
  description: string;
  deadline?: string;
  createdAt: string;
  status: GoalStatus;
  reflection?: {
    keep: string;
    problem: string;
    try: string;
    score?: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  acquired: boolean;
  acquiredAt?: string;
  icon: string;
  level?: number;
}

interface AchievementStore {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  combo: number;
  lastActivityDate?: string;
  goals: Goal[];
  achievements: Achievement[];
  
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;
  completeGoal: (id: string, reflection: Goal['reflection']) => void;
  abandonGoal: (id: string, reflection: Omit<Goal['reflection'], 'score'>) => void;
  addExperience: (amount: number, multiplier?: number) => void;
  updateCombo: () => void;
  resetCombo: () => void;
  checkAchievements: () => void;
  resetProgress: () => void;
}

const calculateExperienceForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'スタートライン',
    description: '課題に一つ取り組む',
    acquired: false,
    icon: 'Flag',
  },
  {
    id: '2',
    title: 'コンボ達成',
    description: '2日連続でコンボ',
    acquired: false,
    icon: 'Flame',
  },
  {
    id: '3',
    title: 'ミニゴール',
    description: '初めて目標を達成する',
    acquired: false,
    icon: 'Target',
  },
  {
    id: '4',
    title: '初級者',
    description: 'Lv5になる',
    acquired: false,
    icon: 'Star',
    level: 5,
  },
  {
    id: '5',
    title: '一夜漬け',
    description: '深夜（23-5時）に勉強する',
    acquired: false,
    icon: 'Moon',
  },
  {
    id: '6',
    title: '計画者',
    description: '今月の目標を達成する',
    acquired: false,
    icon: 'Calendar',
  },
  {
    id: '7',
    title: '継続',
    description: '30日連続コンボ',
    acquired: false,
    icon: 'Infinity',
  },
  {
    id: '8',
    title: '成長の実感',
    description: 'Lv20になる',
    acquired: false,
    icon: 'TrendingUp',
    level: 20,
  },
  {
    id: '9',
    title: '受験生',
    description: '一度だけ11時間勉強する',
    acquired: false,
    icon: 'Brain',
  },
  {
    id: '10',
    title: '100点満点',
    description: '目標達成で100点をつける',
    acquired: false,
    icon: 'Award',
  },
  {
    id: '11',
    title: '神',
    description: 'Lv100になる',
    acquired: false,
    icon: 'Crown',
    level: 100,
  },
];

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      level: 1,
      experience: 0,
      experienceToNextLevel: calculateExperienceForLevel(1),
      combo: 0,
      goals: [],
      achievements: defaultAchievements,

      addGoal: (goalData) => {
        let deadline: Date | undefined;
        
        switch (goalData.type) {
          case 'daily':
            deadline = endOfDay(new Date());
            break;
          case 'weekly':
            deadline = endOfWeek(new Date());
            break;
          case 'monthly':
            deadline = endOfMonth(new Date());
            break;
          case 'final':
            deadline = goalData.deadline ? new Date(goalData.deadline) : undefined;
            break;
        }

        const newGoal: Goal = {
          ...goalData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          deadline: deadline?.toISOString(),
          status: 'active',
        };
        
        set((state) => ({
          goals: [...state.goals, newGoal],
        }));
      },

      completeGoal: (id, reflection) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  status: 'completed',
                  reflection: { ...reflection },
                }
              : goal
          ),
        }));
        get().addExperience(reflection.score ? reflection.score * 10 : 100);
      },

      abandonGoal: (id, reflection) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  status: 'abandoned',
                  reflection: { ...reflection },
                }
              : goal
          ),
        }));
      },

      addExperience: (amount, multiplier = 1) => {
        const finalAmount = Math.floor(amount * multiplier);
        set((state) => {
          let { experience, level, experienceToNextLevel } = state;
          experience += finalAmount;

          while (experience >= experienceToNextLevel) {
            level += 1;
            experience -= experienceToNextLevel;
            experienceToNextLevel = calculateExperienceForLevel(level);
          }

          return { experience, level, experienceToNextLevel };
        });
        get().checkAchievements();
      },

      updateCombo: () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        set((state) => {
          if (state.lastActivityDate === format(new Date(), 'yyyy-MM-dd')) {
            return state;
          }
          return {
            combo: state.combo + 1,
            lastActivityDate: today,
          };
        });
      },

      resetCombo: () => {
        set({ combo: 0, lastActivityDate: undefined });
      },

      checkAchievements: () => {
        const state = get();
        const newAchievements = state.achievements.map((achievement) => {
          if (achievement.acquired) return achievement;

          let shouldAcquire = false;

          switch (achievement.id) {
            case '1':
              shouldAcquire = state.goals.some((g) => g.status === 'completed');
              break;
            case '2':
              shouldAcquire = state.combo >= 2;
              break;
            case '3':
              shouldAcquire = state.goals.some((g) => g.status === 'completed');
              break;
            case '4':
              shouldAcquire = state.level >= 5;
              break;
            case '5':
              const hour = new Date().getHours();
              shouldAcquire = hour >= 23 || hour < 5;
              break;
            case '6':
              shouldAcquire = state.goals.some(
                (g) => g.type === 'monthly' && g.status === 'completed'
              );
              break;
            case '7':
              shouldAcquire = state.combo >= 30;
              break;
            case '8':
              shouldAcquire = state.level >= 20;
              break;
            case '9':
              shouldAcquire = false; // Implement study time tracking
              break;
            case '10':
              shouldAcquire = state.goals.some(
                (g) => g.status === 'completed' && g.reflection?.score === 100
              );
              break;
            case '11':
              shouldAcquire = state.level >= 100;
              break;
          }

          if (shouldAcquire && !achievement.acquired) {
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('新しい称号を獲得しました！', {
                body: `${achievement.title}を獲得しました！`,
              });
            }
            return { ...achievement, acquired: true, acquiredAt: new Date().toISOString() };
          }
          return achievement;
        });

        set({ achievements: newAchievements });
      },

      resetProgress: () => {
        set({
          level: 1,
          experience: 0,
          experienceToNextLevel: calculateExperienceForLevel(1),
          combo: 0,
          lastActivityDate: undefined,
          goals: [],
          achievements: defaultAchievements,
        });
      },
    }),
    {
      name: 'achievement-storage',
    }
  )
);