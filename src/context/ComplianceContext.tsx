import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings, CommerceMode } from '../types';
import { INITIAL_SETTINGS } from '../data/initialData';

interface ComplianceContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  isAgeVerified: boolean;
  verifyAge: (birthDate?: string) => void;
  resetAgeVerification: () => void;
  showAgeGate: boolean;
  setShowAgeGate: (show: boolean) => void;
  activePolicyModal: 'terms' | 'privacy' | 'compliance' | 'shipping' | null;
  setActivePolicyModal: (modal: 'terms' | 'privacy' | 'compliance' | 'shipping' | null) => void;
  isCommercePermitted: boolean;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('vyro_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vyro_age_verified') === 'true';
    } catch {
      return false;
    }
  });

  const [showAgeGate, setShowAgeGate] = useState<boolean>(false);
  const [activePolicyModal, setActivePolicyModal] = useState<'terms' | 'privacy' | 'compliance' | 'shipping' | null>(null);

  useEffect(() => {
    if (settings.enableAgeGate && !isAgeVerified) {
      setShowAgeGate(true);
    }
  }, [settings.enableAgeGate, isAgeVerified]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('vyro_settings', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const verifyAge = (_birthDate?: string) => {
    setIsAgeVerified(true);
    setShowAgeGate(false);
    try {
      localStorage.setItem('vyro_age_verified', 'true');
      localStorage.setItem('vyro_age_verified_at', new Date().toISOString());
    } catch (e) {
      console.error(e);
    }
  };

  const resetAgeVerification = () => {
    setIsAgeVerified(false);
    setShowAgeGate(true);
    try {
      localStorage.removeItem('vyro_age_verified');
      localStorage.removeItem('vyro_age_verified_at');
    } catch (e) {
      console.error(e);
    }
  };

  // Live or sandbox commerce is permitted only if configured away from DEMO_INFORMATIONAL
  const isCommercePermitted = settings.commerceMode !== 'DEMO_INFORMATIONAL';

  return (
    <ComplianceContext.Provider
      value={{
        settings,
        updateSettings,
        isAgeVerified,
        verifyAge,
        resetAgeVerification,
        showAgeGate,
        setShowAgeGate,
        activePolicyModal,
        setActivePolicyModal,
        isCommercePermitted,
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within ComplianceProvider');
  }
  return context;
};
