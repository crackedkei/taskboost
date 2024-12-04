import React, { useState } from 'react';
import { format } from 'date-fns';
import { Play, Plus, X, Clock, AlertTriangle, AlertCircle, AlertOctagon, Check, Edit2 } from 'lucide-react';
import { Todo, Priority, useTodoStore } from '../../store/todoStore';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettingsStore } from '../../store/settingsStore';

interface TodoListProps {
  date: Date;
  onStartTimer: (todo: Todo) => void;
}

const priorityIcons: Record<Priority, React.ReactNode> = {
  high: <AlertTriangle className="w-4 h-4 text-red-500" />,
  medium: <AlertCircle className="w-4 h-4 text-yellow-500" />,
  low: <AlertOctagon className="w-4 h-4 text-blue-500" />,
};

const TodoList: React.FC<TodoListProps> = ({ date, onStartTimer }) => {
  const { t } = useTranslation();
  const { calendar } = useSettingsStore();
  const [newTodo, setNewTodo] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('25');
  const [priority, setPriority] = useState<Priority>('medium');
  const [memo, setMemo] = useState('');
  const [showMemo, setShowMemo] = useState(false);
  const { getTodosByDate, addTodo, updateTodo, deleteTodo } = useTodoStore();

  const { completedTodos, incompleteTodos } = getTodosByDate(date);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    addTodo({
      date: format(date, 'yyyy-MM-dd'),
      title: newTodo.trim(),
      estimatedTime: parseInt(estimatedTime),
      elapsedTime: 0,
      completed: false,
      memo: memo.trim(),
      priority,
    });

    setNewTodo('');
    setEstimatedTime('25');
    setPriority('medium');
    setMemo('');
    setShowMemo(false);
  };

  const TodoItem = ({ todo }: { todo: Todo }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);
    const [editedTime, setEditedTime] = useState(todo.estimatedTime.toString());
    const [editedPriority, setEditedPriority] = useState(todo.priority);
    const [editedMemo, setEditedMemo] = useState(todo.memo);

    const handleSave = () => {
      updateTodo(todo.id, {
        title: editedTitle,
        estimatedTime: parseInt(editedTime),
        priority: editedPriority,
        memo: editedMemo,
      });
      setIsEditing(false);
    };

    return (
      <div
        className={`p-4 rounded-lg border ${
          todo.completed 
            ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <div className="flex gap-2">
              <select
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value as Priority)}
                className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="high">{t('calendar.priority.high')}</option>
                <option value="medium">{t('calendar.priority.medium')}</option>
                <option value="low">{t('calendar.priority.low')}</option>
              </select>
              <input
                type="number"
                value={editedTime}
                onChange={(e) => setEditedTime(e.target.value)}
                min="1"
                max="180"
                className="w-20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            {calendar.showMemo && (
              <textarea
                value={editedMemo}
                onChange={(e) => setEditedMemo(e.target.value)}
                placeholder={t('calendar.memo')}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                rows={2}
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
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
                  {todo.originalDate && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      （{format(new Date(todo.originalDate), 'M/d')}予定）
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  予定: {todo.estimatedTime}分
                  {todo.elapsedTime > 0 && ` / 経過: ${todo.elapsedTime}分`}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {calendar.showMemo && todo.memo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-10">{todo.memo}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTodo} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={t('calendar.addTask')}
            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-24 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="high">{t('calendar.priority.high')}</option>
            <option value="medium">{t('calendar.priority.medium')}</option>
            <option value="low">{t('calendar.priority.low')}</option>
          </select>
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            min="1"
            max="180"
            className="w-20 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
          {calendar.showMemo && (
            <button
              type="button"
              onClick={() => setShowMemo(!showMemo)}
              className="btn btn-secondary"
            >
              {t('calendar.memo')}
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {showMemo && calendar.showMemo && (
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder={t('calendar.memo')}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            rows={2}
          />
        )}
      </form>

      {incompleteTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">{t('calendar.incompleteTasks')}</h3>
          {incompleteTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}

      {calendar.showCompletedTodos && completedTodos.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">{t('calendar.completedTasks')}</h3>
          {completedTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;