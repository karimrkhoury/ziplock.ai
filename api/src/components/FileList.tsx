import { Language, translations } from '../i18n/translations'

interface FileListProps {
  files: File[]
  onRemoveFile: (file: File) => void
  lang: Language
  fileTypes: Record<string, string>
  formatFileSize: (bytes: number) => string
}

function FileList({ files, onRemoveFile, lang, fileTypes, formatFileSize }: FileListProps) {
  const t = translations[lang]

  if (files.length === 0) return null

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {t.secretStash.title}
      </h3>
      <div className="space-y-2">
        {files.map((file, index) => (
          <div 
            key={`${file.name}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span>{fileTypes[file.type as keyof typeof fileTypes] || fileTypes.other}</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
              <span className="text-xs text-gray-400">({formatFileSize(file.size)})</span>
            </div>
            <button
              onClick={() => onRemoveFile(file)}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              title={t.fileList.removeFile}
            >
              ✕
            </button>
          </div>
        ))}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {files.length} {files.length === 1 ? t.fileList.filesReady : t.fileList.filesReady_plural}
        </p>
      </div>
    </div>
  )
}

export default FileList 