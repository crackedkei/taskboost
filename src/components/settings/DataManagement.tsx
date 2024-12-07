import React, { useRef, useState } from 'react';
import { Download, Upload, Share2, Check, AlertCircle, Copy } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { exportData, importData, importFromShareCode, generateShareCode } from '../../utils/storage';

const DataManagement = () => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [shareCode, setShareCode] = useState('');
  const [importShareCode, setImportShareCode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleExport = () => {
    exportData();
    setMessage({
      type: 'success',
      text: t('settings.data.exportSuccess')
    });
  };

  const handleGenerateShareCode = () => {
    const code = generateShareCode();
    setShareCode(code);
    setMessage({
      type: 'success',
      text: t('settings.data.shareCodeGenerated')
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await importData(file);
      setMessage({
        type: success ? 'success' : 'error',
        text: t(success ? 'settings.data.importSuccess' : 'settings.data.importError')
      });
    }
  };

  const handleImportShareCode = () => {
    if (importShareCode) {
      const success = importFromShareCode(importShareCode);
      setMessage({
        type: success ? 'success' : 'error',
        text: t(success ? 'settings.data.importSuccess' : 'settings.data.importError')
      });
      setImportShareCode('');
    }
  };

  const handleCopyShareCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t('settings.data.title')}</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {t('settings.data.export')}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-secondary inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {t('settings.data.import')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300'
            }`}>
              {message.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          <div className="border-t dark:border-gray-700 pt-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              {t('settings.data.shareTitle')}
            </h4>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleGenerateShareCode}
                className="btn btn-secondary inline-flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {t('settings.data.generateShareCode')}
              </button>
            </div>

            {shareCode && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">
                    {t('settings.data.shareCode')}
                  </label>
                  <button
                    onClick={handleCopyShareCode}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      showCopySuccess
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Copy className="w-4 h-4" />
                      {showCopySuccess ? t('settings.data.copied') : t('settings.data.copy')}
                    </div>
                  </button>
                </div>
                <textarea
                  value={shareCode}
                  readOnly
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={importShareCode}
                onChange={(e) => setImportShareCode(e.target.value)}
                placeholder={t('settings.data.enterShareCode')}
                className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
              <button
                onClick={handleImportShareCode}
                className="btn btn-primary"
                disabled={!importShareCode}
              >
                {t('settings.data.importShareCode')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;