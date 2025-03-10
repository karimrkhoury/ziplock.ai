import { Component, ErrorInfo, ReactNode } from 'react';
import { Language } from '../i18n/translations';

interface Props {
  children?: ReactNode;
  language: Language;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      const isArabic = this.props.language === Language.AR;
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
          <div className="text-8xl mb-6">😵</div>
          <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 ${isArabic ? 'font-arabic' : ''}`}>
            {isArabic ? 'عذراً، حدث خطأ ما' : 'Oops, something went wrong'}
          </h2>
          <p className={`text-gray-600 dark:text-gray-400 text-center mb-6 ${isArabic ? 'font-arabic' : ''}`}>
            {isArabic ? 'حدث خطأ غير متوقع. يرجى تحديث الصفحة والمحاولة مرة أخرى.' : 
              'An unexpected error occurred. Please refresh the page and try again.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500/10 dark:bg-blue-400/10
              text-blue-600 dark:text-blue-300 rounded-lg
              hover:bg-blue-500/20 dark:hover:bg-blue-400/20
              transition-all duration-200"
          >
            {isArabic ? 'تحديث الصفحة' : 'Refresh Page'}
          </button>
          
          {/* Only show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 w-full max-w-2xl mx-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-xs">
              <details>
                <summary className="cursor-pointer mb-2 text-gray-700 dark:text-gray-300 font-medium">
                  Error Details (Development Only)
                </summary>
                <pre className="whitespace-pre-wrap text-red-600 dark:text-red-400">
                  {this.state.error && this.state.error.toString()}
                </pre>
                <pre className="mt-2 whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 