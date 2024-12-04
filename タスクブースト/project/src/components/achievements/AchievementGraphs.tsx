import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, startOfDay, startOfMonth, startOfYear, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';
import { useAchievementStore } from '../../store/achievementStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LineChart } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type GraphType = 
  | 'totalExp'
  | 'gainedExp'
  | 'level'
  | 'dailyStudyTime'
  | 'monthlyStudyTime'
  | 'yearlyStudyTime'
  | 'dailyScore'
  | 'monthlyScore';

const AchievementGraphs = () => {
  const { t } = useTranslation();
  const [selectedGraph, setSelectedGraph] = useState<GraphType>('totalExp');
  const { goals } = useAchievementStore();

  const graphOptions = [
    { value: 'totalExp', label: t('achievements.graphs.totalExp') },
    { value: 'gainedExp', label: t('achievements.graphs.gainedExp') },
    { value: 'level', label: t('achievements.graphs.level') },
    { value: 'dailyStudyTime', label: t('achievements.graphs.dailyStudyTime') },
    { value: 'monthlyStudyTime', label: t('achievements.graphs.monthlyStudyTime') },
    { value: 'yearlyStudyTime', label: t('achievements.graphs.yearlyStudyTime') },
    { value: 'dailyScore', label: t('achievements.graphs.dailyScore') },
    { value: 'monthlyScore', label: t('achievements.graphs.monthlyScore') },
  ];

  const completedGoals = goals.filter(goal => goal.status === 'completed');

  // データが不十分な場合に表示するEmptyState
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
      <LineChart className="w-16 h-16 mb-4" />
      <p className="text-lg font-medium">{t('achievements.graphs.noData')}</p>
      <p className="text-sm">{t('achievements.graphs.needMoreData')}</p>
    </div>
  );

  const getGraphData = () => {
    if (completedGoals.length === 0) {
      return null;
    }

    const firstGoalDate = new Date(completedGoals[0].createdAt);
    const now = new Date();

    // 同じ日のデータしかない場合はグラフを表示しない
    if (startOfDay(firstGoalDate).getTime() === startOfDay(now).getTime()) {
      return null;
    }

    switch (selectedGraph) {
      case 'totalExp': {
        const days = eachDayOfInterval({ start: firstGoalDate, end: now });
        let totalExp = 0;
        const data = days.map(day => {
          const dayGoals = completedGoals.filter(goal => 
            startOfDay(new Date(goal.createdAt)).getTime() === startOfDay(day).getTime()
          );
          dayGoals.forEach(goal => {
            totalExp += goal.reflection?.score ? goal.reflection.score * 10 : 0;
          });
          return { x: format(day, 'yyyy-MM-dd'), y: totalExp };
        });

        // データがすべて0の場合はnullを返す
        if (data.every(d => d.y === 0)) return null;

        return {
          labels: data.map(d => d.x),
          datasets: [{
            label: t('achievements.graphs.totalExp'),
            data: data.map(d => d.y),
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.1
          }]
        };
      }

      case 'gainedExp': {
        const days = eachDayOfInterval({ start: firstGoalDate, end: now });
        const data = days.map(day => {
          const dayGoals = completedGoals.filter(goal => 
            startOfDay(new Date(goal.createdAt)).getTime() === startOfDay(day).getTime()
          );
          const exp = dayGoals.reduce((acc, goal) => 
            acc + (goal.reflection?.score ? goal.reflection.score * 10 : 0), 0
          );
          return { x: format(day, 'yyyy-MM-dd'), y: exp };
        });

        // データがすべて0の場合はnullを返す
        if (data.every(d => d.y === 0)) return null;

        return {
          labels: data.map(d => d.x),
          datasets: [{
            label: t('achievements.graphs.gainedExp'),
            data: data.map(d => d.y),
            borderColor: 'rgb(34, 197, 94)',
            tension: 0.1
          }]
        };
      }

      // ... 他のケースも同様に処理

      default:
        return null;
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t(`achievements.graphs.${selectedGraph}`),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const graphData = getGraphData();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('achievements.graphs.title')}</h2>
        <select
          value={selectedGraph}
          onChange={(e) => setSelectedGraph(e.target.value as GraphType)}
          className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
        >
          {graphOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        {graphData ? (
          <Line options={options} data={graphData} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default AchievementGraphs;