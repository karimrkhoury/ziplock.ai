import { Language } from '../i18n/translations';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function LanguageSwitcher({ currentLang, onLanguageChange }: LanguageSwitcherProps) {
  const handleClick = () => {
    onLanguageChange(currentLang === Language.EN ? Language.AR : Language.EN);
  };

  return (
    <button
      onClick={handleClick}
      className="text-gray-700 dark:text-gray-200
        transition-all duration-200"
    >
      {currentLang === 'en' ? 'ع' : 'en'}
    </button>
  );
}

export default LanguageSwitcher; 