import { Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <button
      onClick={() => onLanguageChange(currentLang === Language.EN ? Language.AR : Language.EN)}
      className="p-2 rounded-lg 
        bg-gray-100 dark:bg-gray-800 
        text-gray-800 dark:text-gray-200
        hover:bg-gray-200 dark:hover:bg-gray-700
        shadow-lg
        transition-all duration-200"
      aria-label="Switch language"
    >
      {currentLang === 'en' ? 'عربي' : 'EN'}
    </button>
  );
}

export default LanguageSwitcher; 