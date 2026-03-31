import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('eds-language') || 'en';
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'bn' : 'en';
      localStorage.setItem('eds-language', next);
      return next;
    });
  }, []);

  const t = useCallback((translations) => {
    if (typeof translations === 'string') return translations;
    if (!translations) return '';
    return translations[language] || translations.en || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
