import { useDropzone } from 'react-dropzone'
import type { DropEvent, FileRejection } from 'react-dropzone'
import { useState, useCallback } from 'react'
import { Language, translations } from '../i18n/translations'

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  error?: string | null;
  readonly maxSize?: number
  readonly className?: string
  readonly lang: Language
}

function DropZone({ onDrop, maxSize = 100 * 1024 * 1024, className = '', lang }: DropZoneProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [sizeError, setSizeError] = useState<string | null>(null)

  const t = translations[lang];

  const handleDrop = useCallback(async (
    acceptedFiles: File[], 
    rejectedFiles: FileRejection[]
  ) => {
    // Check for oversized files first
    const oversizedFiles = rejectedFiles.filter(
      rejection => rejection.errors[0]?.code === 'file-too-large'
    );
    
    if (oversizedFiles.length > 0) {
      const fileNames = oversizedFiles.map(f => f.file.name).join(', ');
      const message = lang === 'ar' 
        ? `${t.errors.tooLarge}${fileNames}`
        : `${t.errors.tooLarge}${fileNames}`;
      setSizeError(message);
      setTimeout(() => setSizeError(null), 3000);
      return;
    }

    setIsLoading(true);
    try {
      // Process files with minimal delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      onDrop(acceptedFiles);
    } finally {
      setIsLoading(false);
    }
  }, [onDrop, lang, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
    maxSize,
    noClick: false,
    preventDropOnDocument: true,
    useFsAccessApi: false,
  })

  return (
    <div className="relative">
      <div 
        {...getRootProps()} 
        className={`p-8 border-2 border-transparent
          rounded-lg cursor-pointer
          [background:linear-gradient(#ffffff,#ffffff)_padding-box,linear-gradient(to_right,#3b82f6,#a855f7)_border-box]
          dark:[background:linear-gradient(#1e293b,#1e293b)_padding-box,linear-gradient(to_right,#60a5fa,#c084fc)_border-box]
          hover:text-blue-600 dark:hover:text-blue-400
          transition-all duration-300 ease-out
          ${isDragActive ? 'scale-[1.02]' : ''}
          ${className}`}
      >
        <input {...getInputProps()} />
        <div className={`text-center ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
          {isDragActive ? (
            <p className="text-blue-500 dark:text-blue-400">{t.dropzone}</p>
          ) : sizeError ? (
            <p className="text-red-500 dark:text-red-400 animate-fade-in">
              {sizeError}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <span>{t.dropzone}</span>
              <span className={`w-4 h-4 transition-opacity duration-200 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
                <span className="block w-4 h-4 border-2 border-blue-200 dark:border-blue-900 
                  border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"
                />
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DropZone 