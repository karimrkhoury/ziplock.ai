import { Language, translations } from '../i18n/translations'

interface CompletedViewProps {
  lang: Language
  originalSize: number
  compressedSize: number
  processingTime: number
  onDownload: () => void
  onReset: () => void
  onEmail: () => void
  formatFileSize: (bytes: number) => string
  selectedFiles: File[]
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
  selectedFiles
}: CompletedViewProps) {
  const t = translations[lang]
  const savedSize = originalSize - compressedSize
  const savedPercentage = Math.round((savedSize / originalSize) * 100)

  const getEmailShareLink = () => {
    const subject = encodeURIComponent('Files shared via ZipLock');
    const body = encodeURIComponent(
      `Here are the files I want to share with you:\n\n${selectedFiles
        .map((file) => `- ${file.name}`)
        .join('\n')}`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  };

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
          <span>{t.buttons.download}</span>
        </button>

        <a
          onClick={(e) => {
            e.preventDefault();
            onEmail();
          }}
          className="w-full py-2.5 bg-blue-500/10 dark:bg-blue-400/10
            text-blue-600 dark:text-blue-300 rounded-lg font-medium
            hover:bg-blue-500/20 dark:hover:bg-blue-400/20
            transition-all duration-200 flex items-center justify-center gap-2
            cursor-pointer"
        >
          <span>{t.buttons.emailKey}</span>
        </a>

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