import React, { useState } from 'react';
import { format } from 'date-fns';
import { Play, Plus, X, Clock, AlertTriangle, AlertCircle, AlertOctagon, Check, Edit2, File, Copy, Folder } from 'lucide-react';
import { Todo, Priority, useTodoStore } from '../../store/todoStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';
import AddTaskModal from './AddTaskModal';
import CategoryManager from './CategoryManager';

interface TodoListProps {
  date: Date;
  onStartTimer: (todo: Todo) => void;
  onUpdate: () => void;
}

const priorityIcons: Record<Priority, React.ReactNode> = {
  high: <AlertTriangle className="w-4 h-4 text-red-500" />,
  medium: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  low: <AlertOctagon className="w-4 h-4 text-blue-500" />,
};

const TodoList: React.FC<TodoListProps> = ({ date, onStartTimer, onUpdate }) => {
  const { t } = useTranslation();
  const { calendar } = useSettingsStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [copiedTodo, setCopiedTodo] = useState<Omit<Todo, 'id' | 'date' | 'createdAt'> | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const {
    getTodosByDate,
    addTodo,
    updateTodo,
    deleteTodo,
    categories,
  } = useTodoStore();

  const { completedTodos, incompleteTodos } = getTodosByDate(date);

  const handleAddTodo = (taskData: {
    title: string;
    priority: Priority;
    estimatedTime: number;
    memo: string;
    categoryId?: string;
  }) => {
    addTodo({
      date: format(date, 'yyyy-MM-dd'),
      title: taskData.title,
      estimatedTime: taskData.estimatedTime,
      elapsedTime: 0,
      completed: false,
      memo: taskData.memo,
      priority: taskData.priority,
      categoryId: taskData.categoryId,
    });
    setIsAddModalOpen(false);
    onUpdate();
  };

  const handleCopyTodo = (todo: Todo) => {
    const { id, date, createdAt, ...rest } = todo;
    setCopiedTodo(rest);
  };

  const handlePasteTodo = () => {
    if (copiedTodo) {
      addTodo({
        ...copiedTodo,
        date: format(date, 'yyyy-MM-dd'),
      });
      onUpdate();
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const TodoItem = ({ todo }: { todo: Todo }) => {
    return (
      <div
        className={`p-4 rounded-lg border ${
          todo.completed 
            ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        <div className="flex items-center gap-3">
          {todo.completed ? (
            <div className="text-green-500">
              <Check className="w-5 h-5" />
            </div>
          ) : (
            <button
              onClick={() => onStartTimer(todo)}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {!todo.completed && priorityIcons[todo.priority]}
              <span className="font-medium dark:text-gray-100">{todo.title}</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              予定: {todo.estimatedTime}分
              {todo.elapsedTime > 0 && ` / 経過: ${todo.elapsedTime}分`}
            </div>
          </div>
          <button
            onClick={() => handleCopyTodo(todo)}
            className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {todo.memo && (
          <p className="text-sm text-gray-600 dark:text-gray-400 pl-10 mt-2">{todo.memo}</p>
        )}
      </div>
    );
  };

  const renderTodosByCategory = (todos: Todo[]) => {
    const todosByCategory = new Map<string | undefined, Todo[]>();
    
    todos.forEach(todo => {
      const categoryId = todo.categoryId;
      if (!todosByCategory.has(categoryId)) {
        todosByCategory.set(categoryId, []);
      }
      todosByCategory.get(categoryId)!.push(todo);
    });

    return Array.from(todosByCategory.entries()).map(([categoryId, todos]) => {
      const category = categories.find(c => c.id === categoryId);
      const isExpanded = expandedCategories.includes(categoryId || 'uncategorized');

      return (
        <div key={categoryId || 'uncategorized'} className="space-y-2">
          <button
            onClick={() => toggleCategory(categoryId || 'uncategorized')}
            className="w-full flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              <span>{category?.name || t('calendar.noCategory')}</span>
            </div>
            <span className="text-sm text-gray-500">
              {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
            </span>
          </button>
          
          {isExpanded && (
            <div className="space-y-2 ml-4">
              {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <Folder className="w-5 h-5" />
          {t('calendar.categoryManager')}
        </button>
        {copiedTodo && (
          <button
            onClick={handlePasteTodo}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <File className="w-5 h-5" />
            {t('calendar.pasteTodo')}
          </button>
        )}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('calendar.addTask')}
        </button>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTodo}
        categories={categories}
      />

      <CategoryManager
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {incompleteTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {t('calendar.incompleteTasks')}
          </h3>
          {renderTodosByCategory(incompleteTodos)}
        </div>
      )}

      {calendar.showCompletedTodos && completedTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {t('calendar.completedTasks')}
          </h3>
          {renderTodosByCategory(completedTodos)}
        </div>
      )}
    </div>
  );
};

export default TodoList;