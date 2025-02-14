import React, { useState } from 'react';
import { Language, translations } from '../i18n/translations';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  lang: Language;
  zipBlob: Blob | null;
  error: string | null;
  onError: (error: string | null) => void;
  password: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, files, lang, zipBlob, error, onError, password }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Files shared via ZipLock');
  const [isUploading, setIsUploading] = useState(false);
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug environment variables
    console.log('Environment:', {
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      mode: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_URL
    });

    if (!zipBlob) {
      onError(t.email.noFile);
      return;
    }

    setIsUploading(true);
    onError(null);

    try {
      const formData = new FormData();
      formData.append('file', zipBlob, 'ziplocked-files.zip');

      if (!import.meta.env.VITE_API_URL) {
        throw new Error('API URL not configured');
      }

      const apiUrl = `${import.meta.env.VITE_API_URL}/upload`;
      console.log('Uploading to:', apiUrl, 'API URL:', import.meta.env.VITE_API_URL);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        throw new Error(`Upload failed: ${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);

      if (!data.downloadUrl) {
        throw new Error('No download URL in response');
      }

      const body = `
🚀 Files sent with love via ZipLock!

📦 Contents:
${files.map((file) => `• ${file.name} (${formatFileSize(file.size)})`).join('\n')}

🔐 Your secret password:
${password}

📥 Download your files:
${data.downloadUrl}

⚡️ Quick Instructions:
1. Click the download link
2. Enter the password when prompted
3. Enjoy your files!

⏰ Note: This link will self-destruct in 24 hours!

🔒 Secured with love by ziplock.me
`;

      const mailtoUrl = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : t.email.uploadError);
    } finally {
      setIsUploading(false);
    }
  };

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {t.buttons.emailKey}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.email.to}
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md bg-white dark:bg-gray-700 
                text-gray-900 dark:text-gray-100"
              placeholder="email@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.email.subject}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                rounded-md bg-white dark:bg-gray-700 
                text-gray-900 dark:text-gray-100"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300 rounded-lg
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors duration-200"
            >
              {t.buttons.cancel}
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg
                hover:bg-blue-600 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin">⚡</span>
                  {t.email.uploading}
                </>
              ) : (
                t.buttons.send
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal; 