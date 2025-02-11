import { Language, translations } from '../i18n/translations'
import { useTheme } from '../context/ThemeContext'

interface ProcessingOverlayProps {
  progress: number
  isProcessing: boolean
  lang: Language
}

function ProcessingOverlay({ progress, isProcessing, lang }: ProcessingOverlayProps) {
  const t = translations[lang]
  const { theme } = useTheme()

  if (!isProcessing) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {t.processing.compressing}
            </h3>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className={`relative h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className={`absolute inset-y-0 left-0 transition-all duration-300 ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className={`text-sm text-center animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {progress < 30 ? t.processingTime.fast :
             progress < 70 ? t.processingTime.medium :
             t.processingTime.slow}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProcessingOverlay 