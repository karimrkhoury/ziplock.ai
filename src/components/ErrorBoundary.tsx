import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Language } from '../i18n/translations';

interface Props {
  children: ReactNode;
  language: Language;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Clear localStorage if there's a JSON parse error
    if (error.message.includes('JSON')) {
      console.log('Clearing localStorage due to JSON error');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ziplock-')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  handleReset = () => {
    // Clear localStorage and reload the page
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('ziplock-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset error state
    this.setState({
      hasError: false,
      error: null
    });
    
    // Redirect to home page
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, language } = this.props;

    if (hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#fafafa] dark:bg-[#0d1117]">
          <div className={`flex flex-col items-center justify-center min-h-[60vh] px-4
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
              {language === Language.AR ? 'عذراً! حدث خطأ ما' : 'Oops! Something went wrong'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
              {language === Language.AR 
                ? 'نحن نعمل على إصلاح المشكلة. يرجى المحاولة مرة أخرى.' 
                : 'We\'re working on fixing the issue. Please try again.'}
            </p>
            <button
              onClick={this.handleReset}
              className="mt-4 px-6 py-3 bg-blue-500/10 dark:bg-blue-400/10
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

    return children;
  }
}

export default ErrorBoundary; 