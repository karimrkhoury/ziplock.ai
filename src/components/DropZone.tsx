import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Language } from '../i18n/translations';

interface DropZoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  error?: string | null;
  readonly maxSize?: number;
  readonly className?: string;
  readonly lang: Language;
}

const DropZone: React.FC<DropZoneProps> = ({ 
  onDrop, 
  maxSize = 100 * 1024 * 1024, // 100MB default
  lang = Language.EN,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Optimize file handling with useCallback to prevent unnecessary re-renders
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setIsProcessing(true);
    
    // Use a small timeout to allow the UI to update before processing large files
    // This prevents the UI from freezing during file processing
    setTimeout(() => {
      try {
        onDrop(acceptedFiles);
      } finally {
        setIsProcessing(false);
      }
    }, 50);
  }, [onDrop]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({ 
    onDrop: handleDrop,
    maxSize,
    noClick: false,
    noKeyboard: false,
    multiple: true,
    useFsAccessApi: false, // Disable File System Access API for better compatibility
  });

  // Update dragging state with debounce to prevent flickering
  useEffect(() => {
    if (isDragActive) {
      setIsDragging(true);
    } else {
      const timer = setTimeout(() => setIsDragging(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isDragActive]);

  // Get appropriate message based on language and drag state
  const getMessage = () => {
    if (isProcessing) {
      return lang === Language.AR ? 'جاري معالجة الملفات...' : 'Processing files...';
    }
    
    if (isDragActive) {
      if (isDragReject) {
        return lang === Language.AR ? 'عفواً، هذا النوع من الملفات غير مدعوم' : 'Sorry, this file type is not supported';
      }
      return lang === Language.AR ? 'أفلت الملفات هنا' : 'Drop files here';
    }
    
    return lang === Language.AR 
      ? 'اسحب وأفلت الملفات هنا، أو انقر للاختيار' 
      : 'Drag and drop files here, or click to select';
  };

  return (
    <div className="relative">
      <div 
        {...getRootProps()} 
        className={`
          flex flex-col items-center justify-center
          p-6 sm:p-8
          border-2 border-dashed rounded-lg
          transition-all duration-200 ease-in-out
          cursor-pointer
          ${isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/50'}
          ${isDragReject ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : ''}
          ${isDragAccept ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : ''}
          ${isProcessing ? 'opacity-70 pointer-events-none' : 'opacity-100'}
          ${className}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-5xl mb-4">
          {isProcessing ? '⏳' : isDragActive ? '📂' : '📁'}
        </div>
        
        <p className={`text-center text-sm sm:text-base
          ${isDragReject ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
          ${lang === Language.AR ? 'font-arabic' : 'font-sans'}
        `}>
          {getMessage()}
        </p>
        
        <p className={`mt-2 text-xs text-gray-500 dark:text-gray-500
          ${lang === Language.AR ? 'font-arabic' : 'font-sans'}
        `}>
          {lang === Language.AR 
            ? `الحد الأقصى لحجم الملف: ${Math.round(maxSize / (1024 * 1024))} ميجابايت`
            : `Maximum file size: ${Math.round(maxSize / (1024 * 1024))} MB`
          }
        </p>
      </div>
    </div>
  );
};

export default DropZone; 