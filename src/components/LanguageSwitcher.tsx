import React from 'react';
import { Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLang, onLanguageChange }) => {
  const handleLanguageChange = () => {
    const newLang = currentLang === Language.EN ? Language.AR : Language.EN;
    onLanguageChange(newLang);
    
    // Save language preference to localStorage
    try {
      localStorage.setItem('ziplock-language', newLang);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <div 
      onClick={handleLanguageChange}
      className="flex items-center justify-center cursor-pointer"
    >
      {currentLang === Language.EN ? (
        <span className="text-sm font-medium text-gray-600 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">ع</span>
      ) : (
        <span className="text-sm font-medium text-gray-600 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200">en</span>
      )}
    </div>
  );
};

export default LanguageSwitcher; 