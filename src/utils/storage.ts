import { useTodoStore } from '../store/todoStore';
import { useAchievementStore } from '../store/achievementStore';
import { useSettingsStore } from '../store/settingsStore';

// Helper function to compress data
const compressData = (data: any): string => {
  const jsonString = JSON.stringify(data);
  // Remove unnecessary whitespace
  const minified = jsonString.replace(/\s+/g, '');
  // Use shorter key names
  const compressed = minified
    .replace(/"todos"/g, '"t"')
    .replace(/"categories"/g, '"c"')
    .replace(/"achievements"/g, '"a"')
    .replace(/"settings"/g, '"s"')
    .replace(/"title"/g, '"n"')
    .replace(/"description"/g, '"d"')
    .replace(/"completed"/g, '"p"')
    .replace(/"createdAt"/g, '"r"')
    .replace(/"priority"/g, '"y"')
    .replace(/"estimatedTime"/g, '"e"')
    .replace(/"elapsedTime"/g, '"l"')
    .replace(/"categoryId"/g, '"i"');
  
  return btoa(encodeURIComponent(compressed));
};

// Helper function to decompress data
const decompressData = (encoded: string): any => {
  const decoded = decodeURIComponent(atob(encoded));
  // Restore original key names
  const decompressed = decoded
    .replace(/"t":/g, '"todos":')
    .replace(/"c":/g, '"categories":')
    .replace(/"a":/g, '"achievements":')
    .replace(/"s":/g, '"settings":')
    .replace(/"n":/g, '"title":')
    .replace(/"d":/g, '"description":')
    .replace(/"p":/g, '"completed":')
    .replace(/"r":/g, '"createdAt":')
    .replace(/"y":/g, '"priority":')
    .replace(/"e":/g, '"estimatedTime":')
    .replace(/"l":/g, '"elapsedTime":')
    .replace(/"i":/g, '"categoryId":');
  
  return JSON.parse(decompressed);
};

// Get current application state
const getCurrentState = () => {
  const todoState = useTodoStore.getState();
  const achievementState = useAchievementStore.getState();
  const settingsState = useSettingsStore.getState();

  return {
    todos: todoState.todos,
    categories: todoState.categories,
    achievements: {
      level: achievementState.level,
      experience: achievementState.experience,
      combo: achievementState.combo,
      goals: achievementState.goals,
      achievements: achievementState.achievements,
    },
    settings: {
      theme: settingsState.theme,
      language: settingsState.language,
      fontSize: settingsState.fontSize,
      calendar: settingsState.calendar,
      timer: settingsState.timer,
    },
  };
};

export const exportData = () => {
  const data = getCurrentState();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-app-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateShareCode = () => {
  const data = getCurrentState();
  return compressData(data);
};

export const importData = async (file: File): Promise<boolean> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (data.todos && data.categories && data.achievements && data.settings) {
      const todoStore = useTodoStore.getState();
      const achievementStore = useAchievementStore.getState();
      const settingsStore = useSettingsStore.getState();

      // Update stores
      todoStore.todos = data.todos;
      todoStore.categories = data.categories;
      
      achievementStore.level = data.achievements.level;
      achievementStore.experience = data.achievements.experience;
      achievementStore.combo = data.achievements.combo;
      achievementStore.goals = data.achievements.goals;
      achievementStore.achievements = data.achievements.achievements;
      
      settingsStore.theme = data.settings.theme;
      settingsStore.language = data.settings.language;
      settingsStore.fontSize = data.settings.fontSize;
      settingsStore.calendar = data.settings.calendar;
      settingsStore.timer = data.settings.timer;

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

export const importFromShareCode = (shareCode: string): boolean => {
  try {
    const data = decompressData(shareCode);
    
    if (data.todos && data.categories && data.achievements && data.settings) {
      const todoStore = useTodoStore.getState();
      const achievementStore = useAchievementStore.getState();
      const settingsStore = useSettingsStore.getState();

      // Update stores
      todoStore.todos = data.todos;
      todoStore.categories = data.categories;
      
      achievementStore.level = data.achievements.level;
      achievementStore.experience = data.achievements.experience;
      achievementStore.combo = data.achievements.combo;
      achievementStore.goals = data.achievements.goals;
      achievementStore.achievements = data.achievements.achievements;
      
      settingsStore.theme = data.settings.theme;
      settingsStore.language = data.settings.language;
      settingsStore.fontSize = data.settings.fontSize;
      settingsStore.calendar = data.settings.calendar;
      settingsStore.timer = data.settings.timer;

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing from share code:', error);
    return false;
  }
};