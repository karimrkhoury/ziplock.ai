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
    <div
      onClick={handleClick}
      className="w-full h-full flex items-center justify-center
        text-gray-700 dark:text-gray-200
        transition-all duration-200
        cursor-pointer"
    >
      {currentLang === 'en' ? 'ع' : 'en'}
    </div>
  );
}

export default LanguageSwitcher; 