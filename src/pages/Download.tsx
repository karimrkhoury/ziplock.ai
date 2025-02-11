import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import type { StorageReference } from 'firebase/storage';

interface RouteParams {
  fileId: string;
}

const { fileId } = useParams<RouteParams>();

export const DownloadPage = () => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFile = async () => {
      try {
        const storage = getStorage();
        const fileRef = ref(storage, `zips/${fileId}`);
        const url = await getDownloadURL(fileRef);
        setDownloadUrl(url);
      } catch (err) {
        setError('File not found or has expired');
      }
    };

    if (fileId) {
      getFile();
    }
  }, [fileId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {downloadUrl ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your Encrypted Files</h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Your files are ready to download. You'll need the password to decrypt them.
            </p>
            <a
              href={downloadUrl}
              download
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg
                hover:bg-blue-600 transition-colors duration-200"
            >
              Download Files
            </a>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}; 