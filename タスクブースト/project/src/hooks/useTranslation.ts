import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useSettingsStore();
  
  const t = (key: string, params?: Record<string, any>) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value?.[k] === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
      value = value[k];
    }

    if (params) {
      return Object.entries(params).reduce(
        (str, [key, value]) => str.replace(`{{${key}}}`, value.toString()),
        value
      );
    }
    
    return value;
  };

  return { t, language };
};