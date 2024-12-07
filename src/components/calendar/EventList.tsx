import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import { Event, useEventStore } from '../../store/eventStore';
import { useTranslation } from '../../hooks/useTranslation';
import { format } from 'date-fns';
import AddEventModal from './AddEventModal';

interface EventListProps {
  date: Date;
  onUpdate: () => void;
}

const EventList: React.FC<EventListProps> = ({ date, onUpdate }) => {
  const { t } = useTranslation();
  const { events, addEvent, updateEvent, deleteEvent } = useEventStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleAddEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    } else {
      addEvent(eventData);
    }
    setIsAddModalOpen(false);
    onUpdate();
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm(t('calendar.confirmDeleteEvent'))) {
      deleteEvent(id);
      onUpdate();
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleToggleComplete = (event: Event) => {
    updateEvent(event.id, { completed: !event.completed });
    onUpdate();
  };

  const dateEvents = useEventStore((state) => state.getEventsByDate(date));

  // カラーマッピング
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-900 dark:text-yellow-100',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-900 dark:text-purple-100',
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      text: 'text-pink-900 dark:text-pink-100',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-900 dark:text-orange-100',
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800',
      text: 'text-teal-900 dark:text-teal-100',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('calendar.events')}</h3>
        <button
          onClick={() => {
            setEditingEvent(null);
            setIsAddModalOpen(true);
          }}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('calendar.addEvent')}
        </button>
      </div>

      <div className="space-y-2">
        {dateEvents.map((event) => {
          const colors = colorMap[event.color];
          return (
            <div
              key={event.id}
              className={`p-4 rounded-lg border ${
                event.completed
                  ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                  : `${colors.bg} ${colors.border}`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleComplete(event)}
                    className={`p-1 rounded-lg ${
                      event.completed
                        ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <h4 className={`font-medium ${event.completed ? 'text-gray-700 dark:text-gray-300' : colors.text}`}>
                    {event.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {event.description}
                </p>
              )}

              {(event.startTime || event.endTime) && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {event.startTime && format(new Date(`2000-01-01T${event.startTime}`), 'HH:mm')}
                  {event.startTime && event.endTime && ' - '}
                  {event.endTime && format(new Date(`2000-01-01T${event.endTime}`), 'HH:mm')}
                </div>
              )}

              {event.memo && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {event.memo}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleAddEvent}
        date={date}
        event={editingEvent}
      />
    </div>
  );
};

export default EventList;