import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Language } from '../i18n/translations';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  language: Language;
}

export function ErrorBoundary({ children, language }: ErrorBoundaryProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {children}
      <div 
        id="error-boundary" 
        style={{ display: 'none' }}
        className={`flex flex-col items-center justify-center min-h-[60vh] px-4
          ${language === Language.AR ? 'font-arabic' : 'font-sans'}
          ${language === Language.AR ? 'dir-rtl' : 'dir-ltr'}`}
      >
        <div className="text-8xl sm:text-9xl mb-6 animate-bounce-slow">
          {language === Language.AR ? '😅' : '🫣'}
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold 
          text-gray-900 dark:text-gray-100 
          text-center mb-4
          ${language === Language.AR ? 'font-ge-ss' : ''}`}
        >
          {language === Language.AR ? 'عذراً! انتهت صلاحية هذا الرابط' : 'Oops! This link has expired'}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-6 py-3 bg-blue-500/10 dark:bg-blue-400/10
            text-blue-600 dark:text-blue-300 rounded-lg
            hover:bg-blue-500/20 dark:hover:bg-blue-400/20
            transition-all duration-200"
        >
          {language === Language.AR ? 'البدء من جديد ✨' : 'Start Fresh ✨'}
        </button>
      </div>
    </div>
  );
} 