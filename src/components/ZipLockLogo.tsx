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
        hover:opacity-80 transition-opacity duration-200"
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 
        dark:from-blue-400 dark:to-purple-400 
        bg-clip-text text-transparent">
        ziplock
      </div>
      <span className="text-gray-400 dark:text-gray-500">.me</span>
      {onReset && (
        <div className="absolute -bottom-4 left-0 right-0 text-xs text-gray-400 
          dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          {lang === Language.AR ? 'انقر للبدء من جديد' : 'Click to start over'}
        </div>
      )}
    </button>
  )
}

export default ZipLockLogo 