import React, { createContext, useContext, useState, ReactNode } from 'react';

type Route = 'redirect' | 'config';

interface RouteContextType {
  currentRoute: Route;
  navigateTo: (route: Route, pin?: string) => void;
  isConfigLocked: boolean;
}

const CONFIG_PIN = '4190';

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<Route>('redirect');
  const [isConfigLocked, setIsConfigLocked] = useState(true);

  const navigateTo = (route: Route, pin?: string) => {
    if (route === 'config') {
      if (pin === CONFIG_PIN) {
        setIsConfigLocked(false);
        setCurrentRoute(route);
      } else {
        alert('Invalid PIN. Access denied.');
        return;
      }
    } else {
      setIsConfigLocked(true);
      setCurrentRoute(route);
    }
  };

  return (
    <RouteContext.Provider value={{ currentRoute, navigateTo, isConfigLocked }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
};