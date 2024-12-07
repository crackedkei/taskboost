import React, { useState } from 'react';
import { X, Upload, File } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface FileTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (tasks: string) => void;
  onExport: () => void;
}

const FileTaskModal: React.FC<FileTaskModalProps> = ({ isOpen, onClose, onImport, onExport }) => {
  const { t } = useTranslation();
  const [importText, setImportText] = useState('');

  if (!isOpen) return null;

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;
    onImport(importText);
    setImportText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t('calendar.fileTask')}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">{t('calendar.importTasks')}</h3>
            <form onSubmit={handleImport} className="space-y-4">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={t('calendar.importTasksPlaceholder')}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                rows={6}
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="btn btn-primary inline-flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t('calendar.import')}
                </button>
              </div>
            </form>
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-2">{t('calendar.exportTasks')}</h3>
            <button
              onClick={onExport}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <File className="w-4 h-4" />
              {t('calendar.export')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileTaskModal;