import { create } from 'zustand';
import { format } from 'date-fns';
import { useSettingsStore } from './settingsStore';

export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  date: string;
  title: string;
  estimatedTime: number;
  elapsedTime: number;
  completed: boolean;
  memo: string;
  priority: Priority;
  originalDate?: string;
  createdAt: string;
}

interface TodoStore {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  moveTodoToDate: (id: string, newDate: string, originalDate: string) => void;
  getTodosByDate: (date: Date) => {
    completedTodos: Todo[];
    incompleteTodos: Todo[];
  };
}

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  
  addTodo: (todo) => {
    const newTodo = { 
      ...todo, 
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    set((state) => ({ todos: [...state.todos, newTodo] }));
  },
  
  updateTodo: (id, updates) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    }));
  },
  
  deleteTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  moveTodoToDate: (id, newDate, originalDate) => {
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id
          ? { ...todo, date: newDate, originalDate }
          : todo
      ),
    }));
  },

  getTodosByDate: (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const todos = get().todos.filter((todo) => todo.date === formattedDate);
    const { calendar } = useSettingsStore.getState();
    
    const sortTodos = (todos: Todo[]) => {
      switch (calendar.taskSort) {
        case 'priority':
          return todos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        case 'added':
          return todos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        case 'time':
          return todos.sort((a, b) => b.estimatedTime - a.estimatedTime);
        default:
          return todos;
      }
    };
    
    const completedTodos = sortTodos(
      todos.filter((todo) => todo.completed)
    );
    
    const incompleteTodos = sortTodos(
      todos.filter((todo) => !todo.completed)
    );
    
    return { completedTodos, incompleteTodos };
  },
}));