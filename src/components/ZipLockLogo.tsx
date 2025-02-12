import { Language } from '../i18n/translations';

interface ZipLockLogoProps {
  lang: Language;
  onReset?: () => void;
  showReset?: boolean;
}

function ZipLockLogo({ lang, onReset, showReset }: ZipLockLogoProps) {
  return (
    <button
      onClick={onReset}
      className={`
        group inline-block
        text-3xl font-bold
        transition-all duration-200
        ${onReset ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
      `}
    >
      <div className="relative px-4 py-2">
        <div className="inline-flex">
          <span className="text-gray-600 dark:text-gray-400">
            zip
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 
            dark:from-blue-400 dark:to-purple-400 
            bg-clip-text text-transparent"
          >
            lock.me
          </span>
        </div>
        {showReset && (
          <div className="absolute -bottom-1 left-0 right-0 text-xs text-gray-600 
            dark:text-gray-300 opacity-0 transition-opacity duration-500 delay-1000
            group-hover:opacity-100"
          >
            {lang === Language.AR ? 'انقر للبدء من جديد' : 'Click to start over'}
          </div>
        )}
      </div>
    </button>
  );
}

export default ZipLockLogo; 