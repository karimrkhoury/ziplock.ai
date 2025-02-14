import { Language, translations } from '../i18n/translations'
import { RichText } from './RichText'

interface CompletedViewProps {
  lang: Language
  originalSize: number
  compressedSize: number
  processingTime: number
  onDownload: () => void
  formatFileSize: (bytes: number) => string
  downloadUrl: string
  password: string
  showSnackbar: (message: string) => void
}

const getWhatsAppMessage = (downloadUrl: string, password: string, lang: Language) => {
  if (lang === Language.AR) {
    return `قمت بتجهيز ملفات مشفرة ومضغوطة باستخدام ziplock.me 🔒

رابط التحميل:
${downloadUrl}

*كلمة السر:*
${password}

⏳ الرابط صالح لمدة ٢٤ ساعة فقط
───────────
ضغط. تشفير. مشاركة ✨`;
  }
  return `I've prepared encrypted & compressed files using ziplock.me 🔒

Download link:
${downloadUrl}

*Password:*
${password}

⏳ Link valid for 24 hours only
───────────
zip. lock. ship ✨`;
};

const getEmailMessage = (downloadUrl: string, password: string, lang: Language) => {
  if (lang === Language.AR) {
    return `قمت بتجهيز ملفات مشفرة ومضغوطة باستخدام ziplock.me 🔒

رابط التحميل:
${downloadUrl}

كلمة السر: ${password}

⏳ الرابط صالح لمدة ٢٤ ساعة فقط
───────────
ضغط. تشفير. مشاركة ✨`;
  }
  return `I've prepared encrypted & compressed files using ziplock.me 🔒

Download link:
${downloadUrl}

Password: ${password}

⏳ Link valid for 24 hours only
───────────
zip. lock. ship ✨`;
};

function CompletedView({ 
  lang, 
  originalSize, 
  compressedSize, 
  processingTime,
  onDownload,
  formatFileSize,
  downloadUrl,
  password,
  showSnackbar
}: CompletedViewProps) {
  const t = translations[lang]
  const savedSize = originalSize - compressedSize
  const savedPercentage = Math.round((savedSize / originalSize) * 100)

  const getSpeedAchievement = (processingTime: number, fileSize: number): string => {
    const speed = fileSize / processingTime / 1024 / 1024; // MB/s
    if (speed > 50) return '⚡ Lightning Fast!';
    if (speed > 30) return '🚀 Speed Demon!';
    if (speed > 20) return '💨 Quick Draw!';
    return '🏃 Steady Pace!';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[800px] mx-auto px-4">
      <div className="w-full max-w-[500px] mx-auto space-y-4 sm:space-y-6">
        {/* Success Banner */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r 
          from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 
          rounded-lg w-full"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 relative flex-shrink-0">
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
                {t.missionAccomplished.title}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full">
          <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-purple-50 
            dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl"
          >
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t.stats.saved}
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
                {t.stats.processingTime}
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600
                dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent"
              >
                {processingTime}s
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
              onClick={() => {
                navigator.clipboard.writeText(password)
                  .then(() => showSnackbar(t.success.passwordCopied));
              }}
              className="px-3 py-1.5 sm:py-2 dir-ltr
                bg-gray-100/50 dark:bg-gray-800/50
                text-gray-800 dark:text-gray-200
                rounded font-mono text-xs sm:text-sm
                break-all w-full
                cursor-pointer"
            >
              {password}
            </button>
            <div className={`text-xs text-gray-600 dark:text-gray-400
             ${lang === Language.AR ? 'dir-rtl' : 'dir-ltr'}`}
            >
              {t.missionAccomplished.passwordReminder.warning}
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full">
          {/* Download */}
          <button
            onClick={onDownload}
            className="aspect-square flex items-center justify-center
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-md
              group relative
              transition-all duration-200
              hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 
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
              whitespace-nowrap px-2 py-1 text-[10px] font-medium
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded opacity-0 group-hover:opacity-100
              transition-all duration-200 pointer-events-none"
            >
              {t.buttons.downloadToDevice}
            </span>
          </button>

          {/* Email */}
          <button
            onClick={() => {
              const subject = lang === Language.AR 
                ? 'ملفات مشفرة باستخدام ziplock.me 🔒'
                : 'Files encrypted with ziplock.me 🔒';
              const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(getEmailMessage(downloadUrl, password, lang))}`;
              window.location.href = mailtoUrl;
            }}
            className="aspect-square flex items-center justify-center
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-md
              group relative
              transition-all duration-200
              hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 
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
              whitespace-nowrap px-2 py-1 text-[10px] font-medium
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded opacity-0 group-hover:opacity-100
              transition-all duration-200 pointer-events-none"
            >
              {t.buttons.shareViaEmail}
            </span>
          </button>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(getWhatsAppMessage(downloadUrl, password, lang))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square flex items-center justify-center
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-md
              group relative
              transition-all duration-200
              hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 
              group-hover:text-blue-600 dark:group-hover:text-blue-400
              transition-colors duration-200" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 
              whitespace-nowrap px-2 py-1 text-[10px] font-medium
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded opacity-0 group-hover:opacity-100
              transition-all duration-200 pointer-events-none"
            >
              {t.buttons.shareViaWhatsApp}
            </span>
          </a>

          {/* Copy Link */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(downloadUrl)
                .then(() => {
                  showSnackbar(t.success.linkCopied);
                });
            }}
            className="aspect-square flex items-center justify-center
              bg-gray-50/50 dark:bg-gray-800/50
              hover:bg-gray-100 dark:hover:bg-gray-700
              rounded-md
              group relative
              transition-all duration-200
              hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 
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
              whitespace-nowrap px-2 py-1 text-[10px] font-medium
              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
              rounded opacity-0 group-hover:opacity-100
              transition-all duration-200 pointer-events-none"
            >
              {t.buttons.copyFileLink}
            </span>
          </button>
        </div>

        {/* Support Section with Indication */}
        <div className="mt-6 sm:mt-8 text-center space-y-2 sm:space-y-3 w-full px-0">
          <RichText
            text={t.donation.supportMessage}
            className={`text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center
              ${lang === Language.AR ? 'dir-rtl' : 'dir-ltr'}`}
          />
          <a
            href="https://pay.ziina.com/khourykarim"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center
              py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg
              bg-gradient-to-r from-orange-500/10 to-amber-500/10
              hover:from-orange-500/20 hover:to-amber-500/20
              dark:from-orange-400/10 dark:to-amber-400/10
              dark:hover:from-orange-400/20 dark:hover:to-amber-400/20
              text-orange-600 dark:text-orange-300
              font-medium text-sm
              transform transition-all duration-200
              hover:shadow-md hover:-translate-y-0.5
              ${lang === Language.AR ? 'flex-row-reverse' : ''}
              group`}
          >
            <span className={`text-lg group-hover:scale-110 transition-transform duration-200
             ${lang === Language.AR ? 'ml-2' : 'mr-2'}`}
            >
              ✨
            </span>
            <span className="truncate">
              {t.donation.messages[Math.floor(Math.random() * t.donation.messages.length)]}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default CompletedView 