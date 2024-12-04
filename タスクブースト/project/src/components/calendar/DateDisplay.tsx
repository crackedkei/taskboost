import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from '../../hooks/useTranslation';

interface DateDisplayProps {
  date: Date;
  type: 'monthYear' | 'dayMonth' | 'todosForDate';
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date, type }) => {
  const { t, language } = useTranslation();

  const formatDate = () => {
    switch (type) {
      case 'monthYear':
        return format(date, language === 'ja' ? 'yyyy年M月' : 'MMMM yyyy');
      case 'dayMonth':
        return format(date, language === 'ja' ? 'M月d日' : 'MMMM d');
      case 'todosForDate':
        return language === 'ja' 
          ? `${format(date, 'M月d日')}のTodo`
          : `Todos for ${format(date, 'MMMM d')}`;
      default:
        return '';
    }
  };

  return <>{formatDate()}</>;
};

export default DateDisplay;