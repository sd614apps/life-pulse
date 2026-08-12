import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AccessibilityContext = createContext(null);

const readBool = (key) => {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
};

export function AccessibilityProvider({ children }) {
  const [largeText, setLargeText] = useState(() => readBool('lp-large-text'));
  const [highContrast, setHighContrast] = useState(() => readBool('lp-high-contrast'));
  const [privacyMode, setPrivacyMode] = useState(() => readBool('lp-privacy'));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('large-text', largeText);
    try { localStorage.setItem('lp-large-text', String(largeText)); } catch {}
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('high-contrast', highContrast);
    try { localStorage.setItem('lp-high-contrast', String(highContrast)); } catch {}
  }, [highContrast]);

  useEffect(() => {
    try { localStorage.setItem('lp-privacy', String(privacyMode)); } catch {}
  }, [privacyMode]);

  const mask = useCallback(
    (value) => (privacyMode ? '••••••' : value),
    [privacyMode]
  );

  const value = {
    largeText,
    setLargeText,
    toggleLargeText: () => setLargeText((v) => !v),
    highContrast,
    setHighContrast,
    toggleHighContrast: () => setHighContrast((v) => !v),
    privacyMode,
    setPrivacyMode,
    togglePrivacyMode: () => setPrivacyMode((v) => !v),
    mask,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return ctx;
}

export function MaskedText({ value, className }) {
  const { mask } = useAccessibility();
  return <span className={className}>{mask(value)}</span>;
}