import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Config, defaultConfig, validateConfig } from '../config/config';

interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'redirect-app-config';

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          const validatedConfig = validateConfig(parsedConfig);
          setConfig(current => ({ ...current, ...validatedConfig }));
        }
      } catch (e) {
        console.error('Failed to load configuration from localStorage:', e);
        setConfig(defaultConfig);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = (newConfig: Partial<Config>) => {
    try {
      const validatedConfig = validateConfig(newConfig);
      const updatedConfig = { ...config, ...validatedConfig };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      setConfig(updatedConfig);
    } catch (e) {
      console.error('Failed to save configuration to localStorage:', e);
    }
  };

  const resetConfig = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setConfig(defaultConfig);
    } catch (e) {
      console.error('Failed to reset configuration:', e);
    }
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};