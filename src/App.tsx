import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { BlobWriter, ZipWriter, BlobReader } from '@zip.js/zip.js'
import DropZone from './components/DropZone'
import { translations, Language } from './i18n/translations'
import LanguageSwitcher from './components/LanguageSwitcher'
import ZipLockLogo from './components/ZipLockLogo'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import CompletedView from './components/CompletedView'
import { RichText } from './components/RichText'
import { ErrorBoundary } from './components/ErrorBoundary'


// Update formatFileSize function to be more precise with bytes
const formatFileSize = (bytes: number, lang: Language): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  
  const k = 1024;
  const sizes = ['KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k)) - 1;
  const size = (bytes / Math.pow(k, i + 1)).toFixed(1);
  
  // For Arabic, put the unit after the number
  if (lang === 'ar') {
    return `${size} ${sizes[i]}`;  // e.g. "16.9 KB"
  }
  // For English, same format
  return `${size} ${sizes[i]}`;
};

// Add this helper function
const getFileEmoji = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
  // Documents
  if (['pdf', 'doc', 'docx'].includes(ext)) return '📄';
  // Spreadsheets
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊';
  // Code
  if (['js', 'ts', 'py', 'html', 'css', 'json'].includes(ext)) return '👨‍💻';
  // Archives
  if (['zip', 'rar', '7z'].includes(ext)) return '📦';
  // Audio
  if (['mp3', 'wav', 'ogg'].includes(ext)) return '🎵';
  // Video
  if (['mp4', 'mov', 'avi'].includes(ext)) return '🎬';
  // Fallback
  return '📎';
};

const generateSecurePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Add this helper function to make filenames unique
const getUniqueFileName = (existingNames: Set<string>, originalName: string): string => {
  if (!existingNames.has(originalName)) {
    existingNames.add(originalName);
    return originalName;
  }
  
  const [name, ext] = originalName.split('.');
  let counter = 1;
  let newName = `${name}_${counter}.${ext}`;
  
  while (existingNames.has(newName)) {
    counter++;
    newName = `${name}_${counter}.${ext}`;
  }
  
  existingNames.add(newName);
  return newName;
};

// Add this type for the compression stats
interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  processingTime: number;
}

// Add this near the top of the file
const mockUpload = async (_file: Blob): Promise<{ downloadUrl: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a mock file ID
  const mockId = Math.random().toString(36).substring(2, 8);
  
  // Return a mock URL
  return {
    downloadUrl: `https://ziplock.me/d/${mockId}`
  };
};

// Wrap the main App component
const AppWrapper = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/complete/:fileId" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const navigate = useNavigate();
  const { fileId } = useParams();
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [compressionStats, setCompressionStats] = useState<CompressionStats | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [removingFileId, setRemovingFileId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');  // Add this for email sharing

  const t = translations[language];

  const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB

  const handleFileDrop = (acceptedFiles: File[]) => {
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > MAX_TOTAL_SIZE) {
      setError(`Total size cannot exceed ${formatFileSize(MAX_TOTAL_SIZE, language)}`);
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setError(null);
  };

  // Update the effect to handle navigation and state
  useEffect(() => {
    if (fileId) {
      setIsCompleted(true);
      setDownloadUrl(`https://ziplock.me/d/${fileId}`);
      
      // Try to get saved data from localStorage for this file
      const savedData = localStorage.getItem(`ziplock-${fileId}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setCompressionStats(data.stats);
        // Only show password if this is the creator's session
        if (data.sessionId === localStorage.getItem('ziplock-session-id')) {
          setPassword(data.password);
          // Only try to restore blob for creator's session
          if (data.blobUrl) {
            try {
              fetch(data.blobUrl)
                .then(res => res.blob())
                .then(blob => setZipBlob(blob))
                .catch(() => setZipBlob(null));
            } catch {
              setZipBlob(null);
            }
          }
        }
      } else {
        setCompressionStats({
          originalSize: 0,
          compressedSize: 0,
          processingTime: 0
        });
      }
    } else {
      // Reset state when navigating back to home
      setFiles([]);
      setPassword('');
      setIsCompleted(false);
      setZipBlob(null);
      setError(null);
      setCompressionStats(null);
      setDownloadUrl('');
    }
  }, [fileId]);

  // Generate a session ID when the app loads
  useEffect(() => {
    if (!localStorage.getItem('ziplock-session-id')) {
      localStorage.setItem('ziplock-session-id', crypto.randomUUID());
    }
  }, []);

  const handleCompress = async () => {
    if (files.length === 0) return;
    if (!password || password.length < 8) {
      setError(t.validation.passwordLength);
      return;
    }

    try {
      const startTime = performance.now();
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      // Compression phase (0-90%)
      const compressionPromise = (async () => {
        const blobWriter = new BlobWriter();
        const zipWriter = new ZipWriter(blobWriter, {
          password,
          bufferedWrite: true,
          keepOrder: true,
          level: 9
        });

        let processedSize = 0;
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);
        const usedNames = new Set<string>();

        for (const file of files) {
          const fileReader = new BlobReader(file);
          const uniqueName = getUniqueFileName(usedNames, file.name);
          
          await zipWriter.add(uniqueName, fileReader, {
            onprogress: async (current: number, total: number) => {
              const fileProgress = (current / total) * file.size;
              const totalProgress = ((processedSize + fileProgress) / totalSize) * 100;
              // Use 90% of the progress bar for compression
              const displayProgress = Math.min(90, Math.floor(totalProgress * 0.9));
              setProgress(displayProgress);
              setProgressMessage(t.compression.messages[Math.floor(displayProgress / 10)]);
            }
          });
          processedSize += file.size;
        }

        await zipWriter.close();
        return await blobWriter.getData();
      })();

      // Wait for compression
      const content = await compressionPromise;
      setProgress(90);
      setProgressMessage(t.compression.messages[8]); // "Almost there!"

      // Upload phase (90-100%)
      const formData = new FormData();
      formData.append('file', new Blob([content]), 'ziplocked-files.zip');
      
      const uploadPromise = new Promise<{ downloadUrl: string }>((resolve, reject) => {
        if (import.meta.env.DEV) {
          // Use mock upload with realistic timing
          mockUpload(new Blob([content]))
            .then(resolve)
            .catch(reject);
          
          // Show upload progress (90-100%)
          let progress = 90;
          const interval = setInterval(() => {
            progress += 2;
            if (progress <= 100) {
              setProgress(progress);
              setProgressMessage(t.compression.messages[9]); // "Polishing the results..."
            }
            if (progress >= 100) clearInterval(interval);
          }, 300); // Slower increment for more realistic feel
        } else {
          // Real upload
          const xhr = new XMLHttpRequest();
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const uploadProgress = (event.loaded / event.total) * 10; // Last 10%
              setProgress(90 + Math.floor(uploadProgress));
              setProgressMessage(t.compression.messages[9]);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));

          xhr.open('POST', `${import.meta.env.VITE_API_URL}/upload`);
          xhr.send(formData);
        }
      });

      const { downloadUrl } = await uploadPromise;
      setDownloadUrl(downloadUrl);
      
      // Extract fileId from downloadUrl
      const fileId = downloadUrl.split('/').pop();
      
      // Calculate processing time
      const endTime = performance.now();
      const processingTime = ((endTime - startTime) / 1000).toFixed(1);
      
      // Create stats object
      const stats: CompressionStats = {
        originalSize: files.reduce((acc, file) => acc + file.size, 0),
        compressedSize: content.size,
        processingTime: parseFloat(processingTime)
      };
      
      // Save data to localStorage with session ID and blob
      const blobUrl = URL.createObjectURL(content);
      const dataToSave = {
        password,
        stats,
        sessionId: localStorage.getItem('ziplock-session-id'),
        blobUrl,
        createdAt: Date.now()
      };
      localStorage.setItem(`ziplock-${fileId}`, JSON.stringify(dataToSave));
      
      // Update URL and state
      setIsCompleted(true);
      setZipBlob(content);
      navigate(`/complete/${fileId}`);
      
      // Complete
      setProgress(100);
      setProgressMessage(t.compression.messages[9]); // "Polishing the results..."
      
      setCompressionStats(stats);

    } catch (error) {
      console.error('Compression error:', error);
      setError(error instanceof Error ? error.message : t.validation.encryptionFailed);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  // Update the reset handler
  const handleReset = () => {
    setIsResetting(true);
    if (fileId) {
      localStorage.removeItem(`ziplock-${fileId}`);
    }
    window.history.back(); // Use browser's back instead of navigate
    setTimeout(() => {
      setIsResetting(false);
    }, 200);
  };

  // Update the showSnackbar function
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(null), 3500); // Changed from 5000 to 3500ms
  };

  // Update the handleDownload function to handle downloads properly
  const handleDownload = async () => {
    // Try to download, and only show expired if we get a 404
    try {
      if (zipBlob && isCreatorSession(fileId)) {
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ziplocked-files.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For non-creators or when blob is not available, try the download URL
        const response = await fetch(downloadUrl);
        if (response.status === 404) {
          setError('expired');
          setIsCompleted(false);
          return;
        }
        // If we get here, the file exists, so redirect to download
        window.location.href = downloadUrl;
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        setError('expired');
        setIsCompleted(false);
      } else {
        // Some other error occurred
        console.error('Download error:', error);
      }
    }
  };

  // Add this ref
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Add this useEffect for click outside handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          hamburgerRef.current && 
          !mobileMenuRef.current.contains(event.target as Node) &&
          !hamburgerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    // Add both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      // Clean up
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    console.log('Environment check:', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE,
      base: import.meta.env.BASE_URL
    });
  }, []);

  // Add back the useEffect to fetch stars
  useEffect(() => {
    const fetchGithubStars = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/karimrkhoury/ziplock.ai');
        const data = await response.json();
        setGithubStars(data.stargazers_count);
      } catch (error) {
        console.error('Error fetching GitHub stars:', error);
        // Keep the default 0 if there's an error
      }
    };

    fetchGithubStars();
  }, []); // Fetch once when component mounts

  // Add cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up old data (older than 24h)
      const now = Date.now();
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ziplock-')) {
          const savedTime = localStorage.getItem(`${key}-time`);
          if (savedTime && now - parseInt(savedTime) > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}-time`);
          }
        }
      });
    };
  }, []);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any blob URLs we created
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('ziplock-')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (data.blobUrl) {
            URL.revokeObjectURL(data.blobUrl);
          }
        }
      });
    };
  }, []);

  // Add this helper to check if it's the creator's session
  const isCreatorSession = (fileId: string | undefined) => {
    if (!fileId) return false;
    const savedData = localStorage.getItem(`ziplock-${fileId}`);
    if (!savedData) return false;
    const data = JSON.parse(savedData);
    return data.sessionId === localStorage.getItem('ziplock-session-id');
  };

  // Add expired link messages to translations
  const getExpiredMessage = () => {
    const messages = t.errors.expired;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <ThemeProvider>
      <ErrorBoundary language={language}>
        <div className="fixed inset-0 min-h-screen bg-[#fafafa] dark:bg-[#0d1117] transition-colors duration-200">
          {/* Gradient overlays for both light and dark modes */}
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fafafa] to-white dark:from-[#0d1117] dark:via-[#131922] dark:to-[#0d1117] pointer-events-none" />
          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,1),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(51,78,104,0.15),transparent_70%)] pointer-events-none" />
          {/* Subtle color tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 dark:from-transparent dark:to-transparent pointer-events-none" />
        </div>

        <div className="relative min-h-screen overflow-x-hidden z-10">
          {/* Header with responsive design */}
          <div className="fixed top-0 right-0 w-full z-[60] p-3">
            {/* Desktop/tablet view */}
            <div className="hidden md:flex items-center justify-end mr-4">
              <div className="flex items-center gap-2">
                <button className="w-8 h-7 flex items-center justify-center
                  bg-white/90 backdrop-blur-sm dark:bg-[#1a2230]
                  hover:bg-white dark:hover:bg-gray-700
                  rounded-lg shadow-lg
                  transition-all duration-200"
                >
                  <LanguageSwitcher 
                    currentLang={language}
                    onLanguageChange={setLanguage}
                  />
                </button>
                <button className="w-8 h-7 flex items-center justify-center
                  bg-white/90 backdrop-blur-sm dark:bg-[#1a2230]
                  hover:bg-white dark:hover:bg-gray-700
                  rounded-lg shadow-lg
                  transition-all duration-200"
                >
                  <ThemeToggle />
                </button>
              </div>
            </div>

            {/* Mobile menu button (hamburger) */}
            <div className="md:hidden fixed top-4 right-4">
              <button
                ref={hamburgerRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-8 h-7 rounded-md 
                  bg-white/90 backdrop-blur-sm dark:bg-[#1a2230] 
                  text-gray-700 dark:text-gray-200 
                  shadow-lg
                  hover:bg-white dark:hover:bg-gray-700/50
                  transition-colors duration-200"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Main content wrapper - consistent across all states */}
          <div className="pt-12 pb-32">
            {/* Logo section */}
            <div className="w-full max-w-[440px] mx-auto px-4 sm:px-4 py-4">
              <div className="text-center mb-8">
                <div className="relative">
                  <ZipLockLogo 
                    lang={language}
                    onReset={files.length > 0 || isCompleted ? handleReset : undefined}
                  />
                </div>
                {!isCompleted && (
                  <div className="mt-6 space-y-4 relative z-10">
                    <div className={`inline-flex items-center justify-center gap-3 sm:gap-4 text-lg sm:text-xl
                      text-gray-600 dark:text-gray-300 font-medium tracking-wide
                      ${language === Language.AR ? 'font-arabic' : 'font-sans'}
                      ${language === Language.AR ? 'flex-row-reverse' : ''}`}
                    >
                      {language === Language.AR ? (
                        <>
                          <span>اِضْغَط 📦</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>شَفِّر 🔒</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>أَرْسِل 🚀</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>تَمّ ✨</span>
                        </>
                      ) : (
                        <>
                          <span>zip 📦</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>lock 🔒</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>ship 🚀</span>
                          <span className="text-gray-400 dark:text-gray-500">·</span>
                          <span>done ✨</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className={`w-full transition-opacity duration-200 ease-in-out
                ${isResetting ? 'opacity-0' : 'opacity-100'}`}
              >
                {error === 'expired' ? (
                  <div className={`flex flex-col items-center justify-center min-h-[60vh] px-4
                    text-center ${language === Language.AR ? 'font-arabic' : 'font-sans'}
                    ${language === Language.AR ? 'dir-rtl' : 'dir-ltr'}
                  `}>
                    <div className="text-8xl sm:text-9xl mb-6 animate-bounce-slow">
                      {language === Language.AR ? '😅' : '🫣'}
                    </div>
                    <h2 className={`text-2xl sm:text-3xl font-bold 
                      text-gray-900 dark:text-gray-100 
                      text-center mb-4
                      ${language === Language.AR ? 'font-ge-ss' : ''}
                    `}>
                      {t.errors.expiredTitle}
                    </h2>
                    <p className={`text-gray-600 dark:text-gray-400 
                      text-center max-w-md text-lg 
                      animate-fade-message leading-relaxed
                      ${language === Language.AR ? 'font-ge-ss' : ''}
                    `}>
                      {getExpiredMessage()}
                    </p>
                    <button
                      onClick={() => navigate('/')}
                      className={`mt-8 px-6 py-3 
                        bg-gradient-to-r from-blue-500/10 to-purple-500/10
                        dark:from-blue-400/10 dark:to-purple-400/10
                        hover:from-blue-500/20 hover:to-purple-500/20
                        dark:hover:from-blue-400/20 dark:hover:to-purple-400/20
                        text-blue-600 dark:text-blue-300 
                        rounded-lg transition-all duration-200
                        transform hover:scale-105 active:scale-95
                        ${language === Language.AR ? 'font-ge-ss' : ''}
                      `}
                    >
                      {t.buttons.startFresh} ✨
                    </button>
                  </div>
                ) : !isCompleted ? (
                  <div className={`space-y-4 sm:space-y-6 transition-all duration-300 ease-out
                    ${isCompleted ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <div className="relative group">
                      {/* Glow effect for dropzone */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                        dark:from-blue-400/20 dark:to-purple-400/20 
                        rounded-lg blur opacity-0 
                        group-hover:opacity-100 transition duration-300"
                      />
                      
                      <DropZone 
                        onDrop={handleFileDrop}
                        maxSize={100 * 1024 * 1024}
                        lang={language}
                        className="relative z-10 hover:scale-[1.01] transition-transform duration-300"
                      />
                    </div>
                    
                    {/* File List with Linear-style fade in */}
                    {files.length > 0 && (
                      <div className="opacity-0 animate-linear-fade space-y-1.5 sm:space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {files.length} {files.length === 1 ? t.fileList.filesReady : t.fileList.filesReady_plural}
                            <span className="ml-2">✨</span>
                          </div>
                          <button
                            onClick={() => {
                              const fileListElement = document.getElementById('file-list');
                              if (fileListElement) {
                                fileListElement.classList.add('animate-fade-out');
                                setTimeout(() => setFiles([]), 200);
                              }
                            }}
                            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 
                              dark:hover:text-red-300 transition-all duration-200
                              hover:scale-105 active:scale-95"
                          >
                            {t.fileList.clearAll} 🧹
                          </button>
                        </div>
                        
                        <div id="file-list" className="space-y-2">
                          {files.map((file, index) => (
                            <div 
                              key={`${file.name}-${index}`}
                              className={`flex items-center justify-between py-2 px-3 animate-fade-in
                                bg-gray-50 dark:bg-gray-700/50 rounded-lg
                                group hover:bg-gray-100 dark:hover:bg-gray-700
                                transition-colors duration-200
                                ${removingFileId === index ? 'animate-fade-out' : ''}`}
                            >
                              <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0">
                                <span className="text-xl flex-shrink-0" role="img" aria-label="file type">
                                  {getFileEmoji(file.name)}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  {formatFileSize(file.size, language)}
                                </span>
                              </div>
                              
                              <button
                                onClick={() => {
                                  setRemovingFileId(index);
                                  setTimeout(() => {
                                    setFiles(files.filter((_, i) => i !== index));
                                    setRemovingFileId(null);
                                  }, 200);
                                }}
                                className="text-gray-400 hover:text-red-500 dark:text-gray-500 
                                  dark:hover:text-red-400 opacity-0 group-hover:opacity-100
                                  transition-all duration-200 hover:scale-110 active:scale-95"
                                aria-label={t.buttons.removeFile}
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Fun message based on number of files */}
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                          {t.fileList[files.length === 1 ? 'oneFile' : 
                            files.length < 3 ? 'fewFiles' : 
                            files.length < 5 ? 'manyFiles' : 'lotsOfFiles']}
                        </div>
                      </div>
                    )}

                    {files.length > 0 && (
                      <>
                        {/* Password Section when files are present */}
                        <div className="flex flex-col gap-2 sm:gap-3 mt-3 sm:mt-4 opacity-0 animate-linear-fade-delay">
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={t.secretPassword.funnyPlaceholder}
                              className="w-full h-10 px-4 
                                bg-white/90 backdrop-blur-sm dark:bg-[#1a2230]
                                border border-gray-200/50 dark:border-gray-700
                                rounded-lg text-gray-900 dark:text-gray-100
                                placeholder-gray-500 dark:placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                                rtl:pl-12 rtl:pr-4 ltr:pl-4 ltr:pr-12"
                              dir={language === 'ar' ? 'rtl' : 'ltr'}
                            />
                            
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className={`absolute top-1/2 -translate-y-1/2
                                text-gray-400 hover:text-gray-600 dark:text-gray-500 
                                dark:hover:text-gray-300 transition-colors duration-200
                                ${language === 'ar' ? 'left-2' : 'right-2'}`}
                              aria-label={showPassword ? t.buttons.hidePassword : t.buttons.showPassword}
                            >
                              {showPassword ? '🙈' : '🙉'}
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              const randomPassword = generateSecurePassword();
                              navigator.clipboard.writeText(randomPassword).then(() => {
                                setPassword(randomPassword);
                                setShowPassword(true);
                                const message = t.magicPassword.messages[
                                  Math.floor(Math.random() * t.magicPassword.messages.length)
                                ];
                                showSnackbar(`${message} 📋`);
                              });
                            }}
                            className="h-9 px-4 bg-blue-500/10 dark:bg-blue-400/10
                              text-blue-600 dark:text-blue-300 rounded-lg text-sm
                              hover:bg-blue-500/20 dark:hover:bg-blue-400/20
                              transition-colors duration-200 whitespace-normal text-center"
                          >
                            {t.buttons.helpThinkPassword}
                          </button>
                        </div>

                        {/* Pack it up button */}
                        <div className="mt-6 sm:mt-8 relative group opacity-0 animate-linear-fade-delay">
                          {!isProcessing && (
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                              dark:from-blue-400/20 dark:to-purple-400/20 rounded-lg blur opacity-0 
                              group-hover:opacity-100 transition duration-300 z-0">
                            </div>
                          )}

                          {/* Progress bar overlay */}
                          <div className={`absolute inset-0 
                            transition-opacity duration-300 ease-in z-30
                            ${isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                          >
                            <div className="space-y-2">
                              <div className={`flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1
                                ${language === Language.AR ? 'flex-row-reverse' : ''}`}
                              >
                                <div className="transition-all duration-500">
                                  {progressMessage}
                                </div>
                                <div>
                                  {Math.round(progress)}%
                                </div>
                              </div>
                              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r from-blue-500 to-purple-500 
                                    dark:from-blue-400 dark:to-purple-400
                                    transition-all duration-700 ease-out
                                    ${language === Language.AR ? 'float-right' : 'float-left'}`}
                                  style={{ 
                                    width: `${progress}%`,
                                    transformOrigin: language === Language.AR ? 'right' : 'left'
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Tooltip - Only shows on hover when password is invalid */}
                          {(!password || password.length < 8) && (
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 
                              px-4 py-2.5 text-xs font-medium w-max min-w-[240px] max-w-[280px] text-center leading-snug
                              bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 
                              rounded-lg opacity-0 group-hover:opacity-100 shadow-lg
                              transition-all duration-200 pointer-events-none z-20"
                            >
                              {t.validation.passwordTip}
                            </div>
                          )}

                          {/* Button content */}
                          <button
                            onClick={handleCompress}
                            disabled={isProcessing || !password || password.length < 8}
                            className={`w-full py-3 px-4 
                              text-lg font-medium rounded-lg
                              border-2 relative z-10
                              transform transition-all duration-300 ease-out
                              hover:scale-[1.02] active:scale-[0.98]
                              ${!password || password.length < 8 
                                ? 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'border-transparent [background:linear-gradient(#ffffff,#ffffff)_padding-box,linear-gradient(to_right,#3b82f6,#a855f7)_border-box] dark:[background:linear-gradient(#1e293b,#1e293b)_padding-box,linear-gradient(to_right,#60a5fa,#c084fc)_border-box] text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400'
                              }
                              ${isProcessing ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            aria-label={(!password || password.length < 8) ? t.validation.passwordTip : t.buttons.packItUp}
                          >
                            {t.buttons.packItUp} 🚀
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <CompletedView
                      lang={language}
                      originalSize={compressionStats?.originalSize || 0}
                      compressedSize={compressionStats?.compressedSize || 0}
                      processingTime={compressionStats?.processingTime || 0}
                      onDownload={handleDownload}
                      formatFileSize={(bytes) => formatFileSize(bytes, language)}
                      downloadUrl={downloadUrl}
                      password={password}
                      isCreator={isCreatorSession(fileId)}
                      showSnackbar={showSnackbar}
                    />
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="absolute bottom-0 left-0 right-0 py-2 px-3 sm:px-4">
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <div className="flex flex-col gap-1 text-center">
                <div className="text-center mt-8">
                  <RichText
                    text={t.security}
                    className={`text-[11px] leading-relaxed text-gray-500 dark:text-gray-500 
                      w-full max-w-md mx-auto tracking-tight text-center block
                      ${language === Language.AR ? 'dir-rtl' : 'dir-ltr'}`}
                  />
                </div>

                {/* Credit */}
                <div className="mt-4 text-center">
                  <div className={`flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500
                    ${language === Language.AR ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t.credit}</span>
                    <span>•</span>
                    <a 
                      href="https://github.com/karimrkhoury/ziplock.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1
                        hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                    >
                      <span>⭐</span>
                      <span>{githubStars}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Snackbar stays above everything */}
          {snackbarMessage && (
            <div className="fixed inset-x-0 top-16 flex items-center justify-center z-50">
              <div className="px-6 py-3 mx-4 
                bg-gray-900 dark:bg-gray-50
                text-white dark:text-gray-900
                rounded-lg shadow-lg animate-slide-down text-sm
                max-w-md"
              >
                <div className="flex items-center justify-center gap-2">
                  {snackbarMessage}
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu */}
          <div 
            ref={mobileMenuRef}
            className={`
              md:hidden fixed top-12 right-4 
              bg-gray-50 dark:bg-[#1a2230] 
              rounded-lg shadow-lg
              p-1 flex flex-col w-8
              transition-all duration-200 transform origin-top-right
              ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
              z-50
            `}
          >
            <div className="flex flex-col gap-1">
              <div className="w-full py-2 flex items-center justify-center
                bg-gray-50 dark:bg-[#1a2230]
                hover:bg-gray-100 dark:hover:bg-gray-700
                rounded-md
                transition-all duration-200"
              >
                <LanguageSwitcher 
                  currentLang={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang);
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
              <div className="w-full py-2 flex items-center justify-center
                bg-gray-50 dark:bg-[#1a2230]
                hover:bg-gray-100 dark:hover:bg-gray-700
                rounded-md
                transition-all duration-200"
              >
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default AppWrapper 