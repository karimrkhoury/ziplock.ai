import { Language } from '../i18n/translations';

interface ZipLockLogoProps {
  lang: Language;
  onReset?: () => void;
}

function ZipLockLogo({ lang, onReset }: ZipLockLogoProps) {
  return (
    <button
      onClick={onReset}
      className="group relative inline-flex items-center gap-1 
        text-3xl font-bold
        hover:opacity-80 transition-all duration-200
        cursor-pointer select-none"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 
        dark:from-blue-400 dark:to-purple-400 
        bg-clip-text text-transparent
        group-hover:scale-[0.98] transition-transform duration-200
        pointer-events-none"
      >
        ziplock
      </div>
      <span className="text-gray-400 dark:text-gray-500 pointer-events-none">.me</span>
      {onReset && (
        <div className="absolute -bottom-4 left-0 right-0 text-xs text-gray-400 
          dark:text-gray-500 opacity-0 group-hover:opacity-100 
          transition-all duration-200 transform group-hover:translate-y-1
          pointer-events-none"
        >
          {lang === Language.AR ? 'انقر للبدء من جديد' : 'Click to start over'}
        </div>
      )}
    </button>
  )
}

export default ZipLockLogo 