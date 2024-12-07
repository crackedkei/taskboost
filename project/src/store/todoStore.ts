import { create } from 'zustand';
import { format } from 'date-fns';
import { useSettingsStore } from './settingsStore';
import { persist } from 'zustand/middleware';

export type Priority = 'high' | 'medium' | 'low';

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

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
  categoryId?: string;
}

interface TodoStore {
  todos: Todo[];
  categories: Category[];
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, todo: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  moveTodoToDate: (id: string, newDate: string, originalDate: string) => void;
  getTodosByDate: (date: Date) => {
    completedTodos: Todo[];
    incompleteTodos: Todo[];
  };
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  moveTodoToCategory: (todoId: string, categoryId?: string) => void;
}

const priorityOrder: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      categories: [],
      
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

      addCategory: (name) => {
        const newCategory = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
      },

      updateCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, name } : category
          )
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          todos: state.todos.map((todo) =>
            todo.categoryId === id ? { ...todo, categoryId: undefined } : todo
          )
        }));
      },

      moveTodoToCategory: (todoId, categoryId) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === todoId ? { ...todo, categoryId } : todo
          )
        }));
      }
    }),
    {
      name: 'todo-storage'
    }
  )
);