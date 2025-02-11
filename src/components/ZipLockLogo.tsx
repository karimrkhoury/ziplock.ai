import { Language } from '../i18n/translations';

interface ZipLockLogoProps {
  lang: Language;
  onReset: () => void;
}

const ZipLockLogo = ({ lang, onReset }: ZipLockLogoProps) => {
  return (
    <div className="w-64 mx-auto relative" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <button 
        onClick={onReset}
        className="text-4xl font-bold tracking-tight group relative hover:opacity-80 transition-opacity duration-200"
      >
        <span className="text-gray-700 dark:text-gray-100 
          transition-colors duration-300"
        >
          zip
        </span>
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 
          dark:from-blue-400 dark:to-purple-400 
          bg-clip-text text-transparent
          transition-colors duration-300"
        >
          lock.ai
        </span>
      </button>
    </div>
  )
}

export default ZipLockLogo 