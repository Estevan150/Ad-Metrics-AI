import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en';
  dashboardLayout: string[];
  notifications: boolean;
  soundEnabled: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;
  isOnboardingComplete: boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'pt',
  dashboardLayout: ['metrics', 'charts', 'campaigns', 'insights'],
  notifications: true,
  soundEnabled: false,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { setTheme } = useTheme();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user-preferences');
    const onboarding = localStorage.getItem('onboarding-complete');
    
    if (saved) {
      const parsedPrefs = JSON.parse(saved);
      setPreferences(parsedPrefs);
      setTheme(parsedPrefs.theme);
    }
    
    setIsOnboardingComplete(onboarding === 'true');
  }, [setTheme]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('user-preferences', JSON.stringify(newPreferences));
    
    if (updates.theme) {
      setTheme(updates.theme);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-complete');
    setIsOnboardingComplete(false);
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboarding-complete', 'true');
    setIsOnboardingComplete(true);
  };

  return (
    <UserPreferencesContext.Provider value={{
      preferences,
      updatePreferences,
      resetOnboarding,
      completeOnboarding,
      isOnboardingComplete
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  }
  return context;
};