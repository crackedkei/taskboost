import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Event, EventColor } from '../../store/eventStore';
import { useTranslation } from '../../hooks/useTranslation';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id'>) => void;
  date: Date;
  event?: Event | null;
}

const COLORS: { value: EventColor; label: string; bg: string }[] = [
  { value: 'blue', label: '青', bg: 'bg-blue-500' },
  { value: 'red', label: '赤', bg: 'bg-red-500' },
  { value: 'green', label: '緑', bg: 'bg-green-500' },
  { value: 'yellow', label: '黄', bg: 'bg-yellow-500' },
  { value: 'purple', label: '紫', bg: 'bg-purple-500' },
  { value: 'pink', label: 'ピンク', bg: 'bg-pink-500' },
  { value: 'orange', label: 'オレンジ', bg: 'bg-orange-500' },
  { value: 'teal', label: 'ティール', bg: 'bg-teal-500' },
];

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSubmit, date, event }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState<EventColor>('blue');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setColor(event.color);
      setMemo(event.memo || '');
    } else {
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setColor('blue');
      setMemo('');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      date: format(date, 'yyyy-MM-dd'),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      color,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {event ? t('calendar.editEvent') : t('calendar.addEvent')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calendar.eventTitle')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calendar.eventDescription')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('calendar.startTime')}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('calendar.endTime')}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('calendar.eventColor')}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(({ value, label, bg }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setColor(value)}
                  className={`w-8 h-8 rounded-full ${bg} ${
                    color === value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
                  }`}
                  title={label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('calendar.eventMemo')}
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;