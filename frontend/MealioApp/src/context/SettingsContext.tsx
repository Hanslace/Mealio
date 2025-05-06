import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeOption = 'light' | 'dark' | 'system';

interface Settings {
  theme: ThemeOption;
  language: string;
  sendPush: boolean;
}

interface SettingsContextType extends Settings {
  setTheme: (theme: ThemeOption) => void;
  setLanguage: (lang: string) => void;
  togglePush: () => void;
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'en',
  sendPush: true,
};

const SettingsContext = createContext<SettingsContextType>({
  ...defaultSettings,
  setTheme: () => {},
  setLanguage: () => {},
  togglePush: () => {},
});

const STORAGE_KEY = 'mealio_settings';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) setSettings(JSON.parse(json));
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    loadSettings();
  }, []);

  const persist = async (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (err) {
      console.error('Failed to persist settings', err);
    }
  };

  const setTheme = (theme: ThemeOption) => persist({ ...settings, theme });
  const setLanguage = (language: string) => persist({ ...settings, language });
  const togglePush = () => persist({ ...settings, sendPush: !settings.sendPush });

  return (
    <SettingsContext.Provider
      value={{ ...settings, setTheme, setLanguage, togglePush }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);