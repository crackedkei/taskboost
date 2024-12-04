import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Trophy, Star, Target, Clock, Calendar, 
  TrendingUp, Award, Crown, Brain, Flame,
  Flag, Moon, Infinity, Medal, Plus, Check, X,
  History, LineChart
} from 'lucide-react';
import { useAchievementStore, GoalType } from '../store/achievementStore';
import { useTranslation } from '../hooks/useTranslation';
import AchievementHistory from '../components/achievements/AchievementHistory';
import AchievementGraphs from '../components/achievements/AchievementGraphs';
import AchievementBadges from '../components/achievements/AchievementBadges';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold mb-4 pr-8">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const Achievements = () => {
  const { t } = useTranslation();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'goals' | 'badges' | 'history' | 'graphs'>('goals');
  const [newGoal, setNewGoal] = useState<{
    type: GoalType;
    title: string;
    description: string;
    deadline: Date;
    hasDeadline: boolean;
  }>({
    type: 'daily',
    title: '',
    description: '',
    deadline: new Date(),
    hasDeadline: false,
  });
  const [reflectionData, setReflectionData] = useState<{
    keep: string;
    problem: string;
    try: string;
    score?: number;
  }>({
    keep: '',
    problem: '',
    try: '',
    score: 80,
  });

  const {
    level,
    experience,
    experienceToNextLevel,
    combo,
    goals,
    addGoal,
    completeGoal,
    abandonGoal,
  } = useAchievementStore();

  const tabs = [
    { id: 'goals', label: t('achievements.tabs.goals'), icon: Trophy },
    { id: 'badges', label: t('achievements.tabs.badges'), icon: Medal },
    { id: 'history', label: t('achievements.tabs.history'), icon: History },
    { id: 'graphs', label: t('achievements.tabs.graphs'), icon: LineChart },
  ];

  const handleComplete = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsCompleting(true);
    setShowReflection(true);
  };

  const handleAbandon = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsCompleting(false);
    setShowReflection(true);
  };

  const handleReflectionSubmit = () => {
    if (!selectedGoalId) return;

    if (isCompleting) {
      completeGoal(selectedGoalId, reflectionData);
    } else {
      abandonGoal(selectedGoalId, {
        keep: reflectionData.keep,
        problem: reflectionData.problem,
        try: reflectionData.try,
      });
    }

    setShowReflection(false);
    setReflectionData({ keep: '', problem: '', try: '', score: 80 });
    setSelectedGoalId(null);
  };

  const handleAddGoal = () => {
    const deadline = newGoal.type === 'final' && newGoal.hasDeadline 
      ? new Date(newGoal.deadline)
      : undefined;

    addGoal({
      ...newGoal,
      deadline: deadline?.toISOString(),
    });

    setShowGoalForm(false);
    setNewGoal({
      type: 'daily',
      title: '',
      description: '',
      deadline: new Date(),
      hasDeadline: false,
    });
  };

  const renderGoal = (type: GoalType) => {
    const activeGoal = goals.find(g => g.status === 'active' && g.type === type);
    
    if (!activeGoal) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <button
            onClick={() => {
              setNewGoal(prev => ({ ...prev, type }));
              setShowGoalForm(true);
            }}
            className="flex items-center justify-center gap-2 text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 w-full"
          >
            <Plus className="w-5 h-5" />
            <span>{t(`achievements.setGoal.${type}`)}</span>
          </button>
        </div>
      );
    }

    const timeLeft = activeGoal.deadline ? (() => {
      const deadline = new Date(activeGoal.deadline);
      const now = new Date();
      const days = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60)) % 60;
      return t('achievements.timeLeft', { days, hours, minutes });
    })() : undefined;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{activeGoal.title}</h3>
          {timeLeft && <span className="text-sm text-gray-500 dark:text-gray-400">{timeLeft}</span>}
        </div>
        {activeGoal.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{activeGoal.description}</p>
        )}
        {activeGoal.deadline && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 dark:bg-blue-600 rounded-full h-2"
              style={{
                width: `${Math.min(
                  100,
                  (Date.now() - new Date(activeGoal.createdAt).getTime()) /
                    (new Date(activeGoal.deadline).getTime() - new Date(activeGoal.createdAt).getTime()) *
                    100
                )}%`,
              }}
            />
          </div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => handleComplete(activeGoal.id)}
            className="btn btn-primary flex-1"
          >
            {t('achievements.complete')}
          </button>
          <button 
            onClick={() => handleAbandon(activeGoal.id)}
            className="btn btn-secondary flex-1"
          >
            {t('achievements.abandon')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t('achievements.level')} {level}
            </h2>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('achievements.combo')}: {combo} {t('achievements.days')}
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 dark:bg-blue-600 rounded-full h-2"
            style={{
              width: `${(experience / experienceToNextLevel) * 100}%`,
            }}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {experience} / {experienceToNextLevel} XP
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 -mb-px ${
              activeTab === id
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'goals' && (
        <div className="space-y-4">
          {renderGoal('daily')}
          {renderGoal('weekly')}
          {renderGoal('monthly')}
          {renderGoal('final')}
        </div>
      )}

      {activeTab === 'badges' && <AchievementBadges />}
      
      {activeTab === 'history' && <AchievementHistory />}
      
      {activeTab === 'graphs' && <AchievementGraphs />}

      {/* Goal Form Modal */}
      <Modal
        isOpen={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        title={t('achievements.goalForm.title')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('achievements.goalForm.titleLabel')}
            </label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('achievements.goalForm.descriptionLabel')}
            </label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={3}
            />
          </div>
          {newGoal.type === 'final' && (
            <div>
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={newGoal.hasDeadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, hasDeadline: e.target.checked }))}
                  className="rounded border-gray-300 dark:border-gray-600 mr-2"
                />
                {t('achievements.goalForm.setDeadline')}
              </label>
              {newGoal.hasDeadline && (
                <input
                  type="datetime-local"
                  value={format(newGoal.deadline, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: new Date(e.target.value) }))}
                  className="mt-2 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              )}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowGoalForm(false)}
              className="btn btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleAddGoal}
              className="btn btn-primary"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reflection Modal */}
      <Modal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        title={isCompleting ? t('achievements.reflection.title') : t('achievements.reflection.abandonTitle')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('achievements.reflection.keep')}
            </label>
            <textarea
              value={reflectionData.keep}
              onChange={(e) => setReflectionData(prev => ({ ...prev, keep: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('achievements.reflection.problem')}
            </label>
            <textarea
              value={reflectionData.problem}
              onChange={(e) => setReflectionData(prev => ({ ...prev, problem: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('achievements.reflection.try')}
            </label>
            <textarea
              value={reflectionData.try}
              onChange={(e) => setReflectionData(prev => ({ ...prev, try: e.target.value }))}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              rows={2}
            />
          </div>
          {isCompleting && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('achievements.reflection.score')} ({reflectionData.score}{t('achievements.reflection.points')})
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={reflectionData.score}
                onChange={(e) => setReflectionData(prev => ({ ...prev, score: Number(e.target.value) }))}
                className="w-full"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReflection(false)}
              className="btn btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleReflectionSubmit}
              className="btn btn-primary"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Achievements;