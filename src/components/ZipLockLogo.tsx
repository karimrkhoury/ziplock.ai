import { Language } from '../i18n/translations';
import { useState } from 'react';

interface ZipLockLogoProps {
  lang: Language;
  onReset?: () => void;
}

function ZipLockLogo({ lang, onReset }: ZipLockLogoProps) {
  const [hoverMessage, setHoverMessage] = useState('');

  const getResetMessage = (isArabic: boolean) => {
    const messages = isArabic ? [
      '🔄 انقر للبدء من جديد',
      '✨ جاهز لملفات أخرى؟',
      '🎯 هيا نضغط المزيد!',
    ] : [
      '🔄 Click to start over',
      '✨ Ready for more files?',
      '🎯 Let\'s compress more!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <button
      onClick={onReset}
      onMouseEnter={() => setHoverMessage(getResetMessage(lang === Language.AR))}
      className={`
        group relative
        text-3xl font-bold
        transition-all duration-200
        ${onReset ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
      `}
      disabled={!onReset}
    >
      <div className="relative px-6 py-3">
        <div className="inline-flex items-center">
          <span className="text-gray-600 dark:text-gray-300">
            zip
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 
            dark:from-blue-400 dark:to-purple-400 
            bg-clip-text text-transparent"
          >
            lock.me
          </span>
        </div>
        {onReset && (
          <div className="absolute -bottom-2 left-0 right-0 text-xs text-gray-600 
            dark:text-gray-300 opacity-0 transition-opacity duration-200
            group-hover:opacity-100"
          >
            {hoverMessage}
          </div>
        )}
      </div>
    </button>
  );
}

export default ZipLockLogo; 