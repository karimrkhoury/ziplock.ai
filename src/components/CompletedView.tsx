import { Language, translations } from '../i18n/translations'
import { useState } from 'react'

interface CompletedViewProps {
  lang: Language
  originalSize: number
  compressedSize: number
  processingTime: number
  onDownload: () => void
  onReset: () => void
  onEmail: () => void
  formatFileSize: (bytes: number) => string
  downloadUrl: string
  password: string
}

function CompletedView({ 
  lang, 
  originalSize, 
  compressedSize, 
  processingTime,
  onDownload,
  onReset,
  onEmail,
  formatFileSize,
  downloadUrl,
  password
}: CompletedViewProps) {
  const t = translations[lang]
  const savedSize = originalSize - compressedSize
  const savedPercentage = Math.round((savedSize / originalSize) * 100)
  const [isCopying, setIsCopying] = useState(false)

  return (
    <div className="mt-8 space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t.missionAccomplished.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.missionAccomplished.message}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t.stats.originalSize}</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{formatFileSize(originalSize)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t.stats.saved}</div>
          <div className="font-medium text-green-600 dark:text-green-400">{savedPercentage}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{t.stats.processingTime}</div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{processingTime}s</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onDownload}
          className="w-full py-2.5 bg-green-500/10 dark:bg-green-400/10
            text-green-600 dark:text-green-300 rounded-lg font-medium
            hover:bg-green-500/20 dark:hover:bg-green-400/20
            transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>📱 {t.buttons.downloadToDevice}</span>
        </button>

        <button
          onClick={onEmail}
          className="w-full py-2.5 bg-blue-500/10 dark:bg-blue-400/10
            text-blue-600 dark:text-blue-300 rounded-lg font-medium
            hover:bg-blue-500/20 dark:hover:bg-blue-400/20
            transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>📧 {t.buttons.shareViaEmail}</span>
        </button>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `🔒 Secured files via ZipLock!\n\n📦 Download: ${downloadUrl}\n\n🔑 Password: ${password}\n\n⏰ Link expires in 24 hours!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 bg-emerald-500/10 dark:bg-emerald-400/10
            text-emerald-600 dark:text-emerald-300 rounded-lg font-medium
            hover:bg-emerald-500/20 dark:hover:bg-emerald-400/20
            transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>💬 {t.buttons.shareViaWhatsApp}</span>
        </a>

        <button
          onClick={() => {
            setIsCopying(true)
            navigator.clipboard.writeText(
              `🔒 Secured files via ZipLock!\n\n📦 Download: ${downloadUrl}\n\n🔐 Password: ${password}\n\n⏰ Link expires in 24 hours!`
            ).then(() => {
              showSnackbar(t.success.linkCopied)
              setTimeout(() => setIsCopying(false), 1000)
            })
          }}
          className={`w-full py-2.5 bg-purple-500/10 dark:bg-purple-400/10
            text-purple-600 dark:text-purple-300 rounded-lg font-medium
            hover:bg-purple-500/20 dark:hover:bg-purple-400/20
            transition-all duration-200 flex items-center justify-center gap-2
            relative overflow-hidden
            ${isCopying ? 'animate-pulse' : ''}`}
          disabled={isCopying}
        >
          <span className={`flex items-center gap-2 transition-transform duration-200
            ${isCopying ? 'scale-90' : ''}`}
          >
            {isCopying ? '✨ Copied!' : '🔗 ' + t.buttons.copyFileLink}
          </span>
          
          {isCopying && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="absolute w-full h-full bg-purple-500/10 dark:bg-purple-400/10
                animate-ripple rounded-lg"
              />
            </span>
          )}
        </button>

        <button
          onClick={onReset}
          className="w-full py-2 px-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 
            dark:hover:text-gray-300 rounded-lg transition-colors duration-200"
        >
          {t.buttons.startFresh}
        </button>
      </div>
    </div>
  )
}

export default CompletedView 