import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, isAfter, parseISO } from 'date-fns';

export type EventColor = 
  | 'blue' 
  | 'red' 
  | 'green' 
  | 'yellow' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'teal';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime?: string;
  endTime?: string;
  color: EventColor;
  memo?: string;
  completed?: boolean;
}

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  checkEventCompletion: () => void;
}

export const useEventStore = create<EventStore>()(
  persist(
    (set, get) => ({
      events: [],

      addEvent: (event) => {
        const newEvent = {
          ...event,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },

      getEventsByDate: (date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const now = new Date();
        
        return get().events
          .filter((event) => event.date === dateStr)
          .sort((a, b) => {
            // 終了したイベントは後ろに
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            // 開始時刻でソート
            if (!a.startTime) return 1;
            if (!b.startTime) return -1;
            return a.startTime.localeCompare(b.startTime);
          })
          .map(event => {
            // イベントの終了時刻が過ぎていたら自動的に完了状態に
            if (event.endTime && !event.completed) {
              const endDateTime = parseISO(`${event.date}T${event.endTime}`);
              if (isAfter(now, endDateTime)) {
                get().updateEvent(event.id, { completed: true });
                return { ...event, completed: true };
              }
            }
            return event;
          });
      },

      checkEventCompletion: () => {
        const now = new Date();
        const events = get().events;
        
        events.forEach(event => {
          if (event.endTime && !event.completed) {
            const endDateTime = parseISO(`${event.date}T${event.endTime}`);
            if (isAfter(now, endDateTime)) {
              get().updateEvent(event.id, { completed: true });
            }
          }
        });
      },
    }),
    {
      name: 'event-storage',
    }
  )
);

// 定期的にイベントの完了状態をチェック
setInterval(() => {
  useEventStore.getState().checkEventCompletion();
}, 60000); // 1分ごとにチェック