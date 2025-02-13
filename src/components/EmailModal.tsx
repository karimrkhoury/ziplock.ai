import React, { useState } from 'react';
import { Language, translations } from '../i18n/translations';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  lang: Language;
  zipBlob: Blob | null;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, files, lang, zipBlob }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Files shared via ZipLock');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipBlob) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create form data with the zip file
      const formData = new FormData();
      formData.append('file', zipBlob, 'ziplocked-files.zip');

      // Upload to a temporary file hosting service
      const response = await fetch(import.meta.env.VITE_API_URL + '/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { downloadUrl } = await response.json();

      // Create email body with the download link
      const body = `Here are the files I want to share with you:\n\n${files
        .map((file) => `- ${file.name}`)
        .join('\n')}\n\nDownload your files here:\n${downloadUrl}`;

      // Open email client with the download link
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      onClose();
    } catch (error) {
      setUploadError(t.email.uploadError);
    } finally {
      setIsUploading(false);
    }
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

          {uploadError && (
            <div className="text-red-500 text-sm">
              {uploadError}
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