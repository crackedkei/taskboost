import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from '../../hooks/useTranslation';

interface DateDisplayProps {
  date: Date;
  type: 'monthYear' | 'dayMonth' | 'todosForDate';
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, type }) => {
  const { t } = useTranslation();

  const formatDate = () => {
    switch (type) {
      case 'monthYear':
        return format(date, 'yyyy年M月');
      case 'dayMonth':
        return format(date, 'M月d日');
      case 'todosForDate':
        return `${format(date, 'M月d日')}のTodo`;
      default:
        return '';
    }
  };

  return <>{formatDate()}</>;
};

export default DateDisplay;