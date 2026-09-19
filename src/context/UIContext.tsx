import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActiveTab, ThemeMode, Language, OpportunityViewMode } from '../types';

interface UIContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: OpportunityViewMode;
  setViewMode: (mode: OpportunityViewMode) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [viewMode, setViewMode] = useState<OpportunityViewMode>('kanban');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [language, setLanguage] = useState<Language>('es');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <UIContext.Provider value={{
      activeTab, setActiveTab,
      viewMode, setViewMode,
      theme, setTheme,
      language, setLanguage,
      isMobileSidebarOpen, setIsMobileSidebarOpen
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};
