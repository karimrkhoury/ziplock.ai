import React from 'react';
import { Language } from '../i18n/translations';
import { RichText } from './RichText';

interface CompletedViewProps {
  fileId?: string;
  password: string;
  error: string | null;
  originalSize: number;
  compressedSize: number;
  processingTime: number;
  onDownload: () => void;
  onReset: () => void;
  formatFileSize: (bytes: number) => string;
  downloadUrl: string;
  t: any; // Using any for translations for simplicity
}

// Helper functions for messages
const getWhatsAppMessage = (downloadUrl: string, password: string, lang: Language) => {
  if (lang === Language.AR) {
    // For Arabic, use RTL formatting with Unicode control characters
    // RLM (Right-to-Left Mark): \u200F
    // LRM (Left-to-Right Mark): \u200E
    return `\u200F🔐 ملفات مشفرة بأمان! 🚀\u200F\n\n\u200F🔗 الرابط:\u200F \u200E${downloadUrl}\u200E\n\n\u200F🔑 كلمة المرور:\u200F \u200E${password}\u200E\n\n\u200F✨ تم إنشاؤها باستخدام ziplock.me - الطريقة الأسهل لمشاركة الملفات بأمان! 🔒\u200F`;
  }
  return `🔐 Securely encrypted files! 🚀\n\n🔗 Link: ${downloadUrl}\n\n🔑 Password: ${password}\n\n✨ Created with ziplock.me - the easiest way to share files securely! 🔒`;
};

const getEmailMessage = (downloadUrl: string, password: string, lang: Language) => {
  if (lang === Language.AR) {
    // For Arabic, use RTL formatting with Unicode control characters
    return `\u200Fمرحباً! 👋\u200F\n\n\u200F📦 إليك الملفات المشفرة التي طلبتها:\u200F\n\u200F🔗\u200F \u200E${downloadUrl}\u200E\n\n\u200F🔑 كلمة المرور:\u200F \u200E${password}\u200E\n\n\u200F⚠️ يرجى الاحتفاظ بكلمة المرور في مكان آمن - لا يمكن استردادها إذا فقدت!\u200F\n\n\u200F✨ تم إنشاؤها باستخدام ziplock.me 🔒 - الطريقة الأسهل لمشاركة الملفات بأمان!\u200F`;
  }
  return `Hello there! 👋\n\n📦 Here are your encrypted files:\n🔗 ${downloadUrl}\n\n🔑 Password: ${password}\n\n⚠️ Please keep this password safe - it cannot be recovered if lost!\n\n✨ Created with ziplock.me 🔒 - the easiest way to share files securely!`;
};

const CompletedView: React.FC<CompletedViewProps> = ({
  password,
  error,
  originalSize,
  compressedSize,
  processingTime,
  onDownload,
  onReset,
  formatFileSize,
  downloadUrl,
  t = {} // Provide default empty object
}: CompletedViewProps) => {
  // Default translations in case t is undefined or missing properties
  const defaultT = {
    missionAccomplished: {
      title: 'Mission Accomplished!',
      passwordReminder: {
        warning: 'Save this password - it cannot be recovered if lost'
      }
    },
    stats: {
      saved: 'Space Saved',
      processingTime: 'Processing Time'
    },
    buttons: {
      downloadToDevice: 'Download to Device',
      shareViaEmail: 'Share via Email',
      shareViaWhatsApp: 'Share via WhatsApp',
      copyFileLink: 'Copy File Link',
      startFresh: 'Start Fresh ✨'
    },
    success: {
      passwordCopied: 'Password copied to clipboard!',
      linkCopied: 'Link copied to clipboard!'
    },
    donation: {
      supportMessage: 'Help keep ziplock free & secure for everyone! 🚀',
      messages: ['Buy me a late night coding snack 🌙']
    },
    errors: {
      expired: {
        title: 'Oops! This link has expired',
        message: 'The file is no longer available. Please upload a new file.'
      }
    },
    compression: {
      messages: ['Polishing the results...']
    },
    validation: {
      encryptionFailed: 'Encryption failed. Please try again.'
    }
  };

  // Merge provided translations with defaults
  const translations = {
    missionAccomplished: { ...defaultT.missionAccomplished, ...(t.missionAccomplished || {}) },
    stats: { ...defaultT.stats, ...(t.stats || {}) },
    buttons: { ...defaultT.buttons, ...(t.buttons || {}) },
    success: { ...defaultT.success, ...(t.success || {}) },
    donation: { ...defaultT.donation, ...(t.donation || {}) },
    errors: { ...defaultT.errors, ...(t.errors || {}) },
    compression: { ...defaultT.compression, ...(t.compression || {}) },
    validation: { ...defaultT.validation, ...(t.validation || {}) }
  };
  
  const savedSize = originalSize - compressedSize;
  const savedPercentage = Math.round((savedSize / originalSize) * 100) || 0;
  
  const getSpeedAchievement = (processingTime: number, fileSize: number): string => {
    // Check if we're using Arabic by looking at the translations
    // We can detect this by checking if the mission accomplished title contains Arabic characters
    const isArabic = translations.missionAccomplished.title.match(/[\u0600-\u06FF]/) !== null;
    
    if (processingTime < 1) {
      return isArabic ? '🚀 سرعة خارقة!' : '🚀 Supersonic!';
    }
    if (processingTime < 2) {
      return isArabic ? '⚡ سريع كالبرق!' : '⚡ Lightning Fast!';
    }
    if (processingTime < 3) {
      return isArabic ? '🏎️ سريع جداً!' : '🏎️ Speedy!';
    }
    if (fileSize > 50 * 1024 * 1024 && processingTime < 5) {
      return isArabic ? '🔥 مثير للإعجاب!' : '🔥 Impressive!';
    }
    return isArabic ? '🏃 بوتيرة ثابتة!' : '🏃 Steady Pace!';
  };

  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // Show snackbar if available
        if (typeof t.showSnackbar === 'function') {
          t.showSnackbar(translations.success.linkCopied);
        }
      });
  };
  
  // Handle copy password
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        // Show snackbar if available
        if (typeof t.showSnackbar === 'function') {
          t.showSnackbar(translations.success.passwordCopied);
        }
      });
  };

  if (error === 'expired') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-8xl sm:text-9xl mb-6 animate-bounce-slow">🫣</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
          {translations.errors.expired.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {translations.errors.expired.message}
        </p>
        <button
          onClick={onReset}
          className="mt-4 px-6 py-3 bg-blue-500/10 dark:bg-blue-400/10
            text-blue-600 dark:text-blue-300 rounded-lg
            hover:bg-blue-500/20 dark:hover:bg-blue-400/20
            transition-all duration-200"
        >
          {translations.buttons.startFresh}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[800px] mx-auto px-3 sm:px-4">
      <div className="w-full max-w-[500px] mx-auto space-y-3 sm:space-y-6">
        {/* Success Banner */}
        <div className="flex items-center justify-between p-3 sm:p-4 mt-2 bg-gradient-to-r 
          from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 
          rounded-lg w-full text-center"
        >
          <div className="flex items-center justify-center w-full gap-1.5 sm:gap-2">
            <div className="w-8 h-8 sm:w-12 sm:h-12 relative flex-shrink-0">
              <div className="absolute inset-0 bg-green-500/20 dark:bg-green-400/20 
                rounded-full animate-ping"
              />
              <div className="relative w-full h-full bg-green-50 dark:bg-green-900/20 
                rounded-full flex items-center justify-center"
              >
                <span className="text-2xl animate-bounce-once">✨</span>
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                {translations.missionAccomplished.title}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-4 w-full">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-purple-50 
            dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
          >
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                {translations.stats.saved}
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent
                animate-number-increment"
              >
                {savedPercentage}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatFileSize(savedSize)}
              </div>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50
            dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl"
          >
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                {translations.stats.processingTime}
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600
                dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
              >
                {processingTime.toFixed(1)}s
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getSpeedAchievement(processingTime, originalSize)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Password Reminder Card */}
        <div className="p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg border
          border-gray-200/50 dark:border-gray-700/30 w-full"
        >
          <div className="text-center space-y-2">
            <button 
              onClick={handleCopyPassword}
              className="px-3 py-1.5 sm:py-2 dir-ltr
                bg-gray-100/50 dark:bg-gray-800/50
                text-gray-800 dark:text-gray-200
                rounded font-mono text-xs sm:text-sm
                break-all w-full
                cursor-pointer"
            >
              {password}
            </button>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {translations.missionAccomplished.passwordReminder.warning}
            </div>
          </div>
        </div>
        
        {/* Action Icons */}
        <div className="flex justify-between items-center w-full max-w-[280px] sm:max-w-[320px] mx-auto">
          {/* Download */}
          <button
            onClick={onDownload}
            className="flex items-center justify-center
              group relative
              transition-all duration-200
              hover:-translate-y-1
              p-2"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-200" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
              />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
              px-4 py-2.5 text-xs font-medium w-max min-w-[140px] text-center leading-snug
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded-lg opacity-0 group-hover:opacity-100 shadow-lg
              transition-all duration-200 pointer-events-none z-20"
            >
              {translations.buttons.downloadToDevice}
            </span>
          </button>
          
          {/* Email */}
          <button 
            onClick={() => {
              const subject = encodeURIComponent(
                translations.missionAccomplished.title.match(/[\u0600-\u06FF]/) !== null ? 
                "✨ ملفات مشفرة عبر ziplock.me 🔒" : 
                "🔒 Encrypted files via ziplock.me ✨"
              );
              const body = encodeURIComponent(getEmailMessage(downloadUrl, password, 
                // Use the detected language for the message
                translations.missionAccomplished.title.match(/[\u0600-\u06FF]/) !== null ? Language.AR : Language.EN
              ));
              window.open(`mailto:?subject=${subject}&body=${body}`);
            }}
            className="flex items-center justify-center
              group relative
              transition-all duration-200
              hover:-translate-y-1
              p-2"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-200" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
              px-4 py-2.5 text-xs font-medium w-max min-w-[140px] text-center leading-snug
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded-lg opacity-0 group-hover:opacity-100 shadow-lg
              transition-all duration-200 pointer-events-none z-20"
            >
              {translations.buttons.shareViaEmail}
            </span>
          </button>
          
          {/* WhatsApp */}
          <button
            onClick={() => {
              const text = encodeURIComponent(getWhatsAppMessage(downloadUrl, password, 
                // Use the detected language for the message
                translations.missionAccomplished.title.match(/[\u0600-\u06FF]/) !== null ? Language.AR : Language.EN
              ));
              window.open(`https://wa.me/?text=${text}`);
            }}
            className="flex items-center justify-center
              group relative
              transition-all duration-200
              hover:-translate-y-1
              p-2"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-200" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
              px-4 py-2.5 text-xs font-medium w-max min-w-[140px] text-center leading-snug
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded-lg opacity-0 group-hover:opacity-100 shadow-lg
              transition-all duration-200 pointer-events-none z-20"
            >
              {translations.buttons.shareViaWhatsApp}
            </span>
          </button>
          
          {/* Copy Link */}
          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-center
              group relative
              transition-all duration-200
              hover:-translate-y-1
              p-2"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 dark:text-gray-300 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-200" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
              />
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
              px-4 py-2.5 text-xs font-medium w-max min-w-[140px] text-center leading-snug
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded-lg opacity-0 group-hover:opacity-100 shadow-lg
              transition-all duration-200 pointer-events-none z-20"
            >
              {translations.buttons.copyFileLink}
            </span>
          </button>
        </div>
        
        {/* Support Section with Indication */}
        <div className="mt-4 sm:mt-8 text-center space-y-2 sm:space-y-3 w-full px-0">
          <RichText
            text={translations.donation.supportMessage}
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center"
          />
          <a 
            href="https://pay.ziina.com/khourykarim"
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center
              py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg
              bg-gradient-to-r from-orange-500/10 to-amber-500/10
              hover:from-orange-500/20 hover:to-amber-500/20
              dark:from-orange-400/10 dark:to-amber-400/10
              dark:hover:from-orange-400/20 dark:hover:to-amber-400/20
              text-orange-600 dark:text-orange-300
              font-medium text-sm
              transform transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200 mr-2">
              ✨
            </span>
            <span className="truncate">
              {translations.donation.messages[0]}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompletedView; 