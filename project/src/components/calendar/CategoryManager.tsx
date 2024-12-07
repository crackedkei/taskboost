import React, { useState } from 'react';
import { Folder, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTodoStore } from '../../store/todoStore';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { categories, addCategory, updateCategory, deleteCategory } = useTodoStore();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategory(editingCategory.id, editingCategory.name.trim());
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t('calendar.confirmDeleteCategory'))) {
      deleteCategory(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Folder className="w-5 h-5" />
            {t('calendar.categoryManager')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('calendar.newCategoryPlaceholder')}
              className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
            <button
              onClick={handleAddCategory}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('calendar.addCategory')}
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                {editingCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateCategory();
                      if (e.key === 'Escape') setEditingCategory(null);
                    }}
                  />
                ) : (
                  <span>{category.name}</span>
                )}
                <div className="flex items-center gap-2">
                  {editingCategory?.id === category.id ? (
                    <button
                      onClick={handleUpdateCategory}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-green-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                      className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-blue-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;