import { useState, useEffect, useCallback } from 'react'
import { BlobWriter, ZipWriter, BlobReader } from '@zip.js/zip.js'
import DropZone from './components/DropZone'
import { translations, Language } from './i18n/translations'
import LanguageSwitcher from './components/LanguageSwitcher'
import ZipLockLogo from './components/ZipLockLogo'
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'

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

// Update the message selection to be more stable
const getProgressMessage = (progress: number, t: typeof translations[Language]): string => {
  const messages = t.compression.messages;
  const index = Math.min(
    Math.floor(progress / 20),
    messages.length - 1
  );
  return messages[index];
};

// Update simulation for smoother progress
const simulateProgress = (
  onProgress: (progress: number) => void,
  duration: number = 2000,
  steps: number = 0.005 // One step per 1%
) => {
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    // Linear progress for more predictable percentage display
    const progress = Math.min(100, currentStep);
    onProgress(progress);
    if (currentStep >= steps) clearInterval(interval);
  }, duration / steps);

  return interval;
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

// First, define your donation messages array as a const
const DONATION_MESSAGES = [
  "Feed a hungry dev 🥙",
  "Support my shawarma addiction 🌯",
  "Help me get that premium IDE theme ✨",
  "Keep my coffee cup full ☕",
  // ... other messages
] as const; // Add 'as const' to make it a readonly tuple

// Create a type from the array
type DonationMessage = typeof DONATION_MESSAGES[number];

// Add this type for the compression stats
interface CompressionStats {
  originalSize: number;
  compressedSize: number;
  processingTime: number;
}

const App = () => {
  // Basic states
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [compressionStats, setCompressionStats] = useState<CompressionStats | null>(null);
  const [donationMessage, setDonationMessage] = useState<DonationMessage>(DONATION_MESSAGES[0]);
  const [isResetting, setIsResetting] = useState(false);
  const [removingFileId, setRemovingFileId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [funMessage, setFunMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number>(0);

  const t = translations[language];

  // Then update the useEffect that handles donation messages
  useEffect(() => {
    // Set initial message
    setDonationMessage(DONATION_MESSAGES[0]);
    
    const interval = setInterval(() => {
      updateRandomMessage();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [language]);

  // Move the useEffect inside the component
  useEffect(() => {
    if (isProcessing) {
      const messages = t.compression.funMessages;
      let index = 0;
      
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setFunMessage(messages[index]);
      }, 2000);

      // Set initial message
      setFunMessage(messages[0]);

      return () => clearInterval(interval);
    }
  }, [isProcessing, language]);

  // Add useEffect to fetch stars count
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

  const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    
    if (totalSize > MAX_TOTAL_SIZE) {
      setError(`Total size cannot exceed ${formatFileSize(MAX_TOTAL_SIZE, language)}`);
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setError(null);
  }, [language]);

  const handleCompress = async () => {
    if (files.length === 0) return;
    if (!password || password.length < 8) {
      setError(t.validation.passwordLength);
      return;
    }

    try {
      const startTime = Date.now();
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      // Always start with a minimum 2-second simulation
      const simulationPromise = new Promise<void>(resolve => {
        const interval = simulateProgress(
          (progress) => {
            // Ensure we only show whole numbers
            const displayProgress = Math.min(80, Math.floor(progress * 0.8));
            setProgress(displayProgress);
            if (progress % 20 < 1) {
              setProgressMessage(getProgressMessage(progress, t));
            }
          },
          2000
        );

        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 2000);
      });

      // Start the actual compression in parallel
      const compressionPromise = (async () => {
        const blobWriter = new BlobWriter();
        const zipWriter = new ZipWriter(blobWriter, {
          password,
          bufferedWrite: true,
          keepOrder: true
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
              const displayProgress = Math.min(100, Math.max(80, Math.floor(80 + (totalProgress * 0.2))));
              setProgress(displayProgress);
              if (Math.floor(totalProgress / 20) !== Math.floor((totalProgress - 1) / 20)) {
                setProgressMessage(getProgressMessage(totalProgress, t));
              }
            }
          });
          processedSize += file.size;
        }

        await zipWriter.close();
        return await blobWriter.getData();
      })();

      // Wait for both simulation and compression
      const [content] = await Promise.all([compressionPromise, simulationPromise]);

      // Ensure we reach 100% with a small delay
      setProgress(100);
      setProgressMessage(t.compression.messages[t.compression.messages.length - 1]);
      
      // Small delay before completing
      await new Promise(resolve => setTimeout(resolve, 500));

      const endTime = Date.now();
      const processingTime = (endTime - startTime) / 1000;
      const originalSize = files.reduce((acc, file) => acc + file.size, 0);
      
      const stats: CompressionStats = {
        originalSize,
        compressedSize: content.size,
        processingTime
      };
      setCompressionStats(stats);
      setZipBlob(content);
      setIsCompleted(true);
      
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
    // Wait for fade out animation
    setTimeout(() => {
      setFiles([]);
      setPassword('');
      setIsCompleted(false);
      setZipBlob(null);
      setError(null);
      setCompressionStats(null);
      setIsResetting(false);
    }, 200); // Match this with the transition duration
  };

  // Update the showSnackbar function
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setTimeout(() => setSnackbarMessage(null), 3500); // Changed from 5000 to 3500ms
  };

  // Keep the download functionality simple with just local blob download
  const handleDownload = () => {
    if (zipBlob) {
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ziplocked-files.zip';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const updateRandomMessage = () => {
    const currentIndex = DONATION_MESSAGES.indexOf(donationMessage);
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * DONATION_MESSAGES.length);
    } while (newIndex === currentIndex);
    
    setDonationMessage(DONATION_MESSAGES[newIndex]);
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        {/* Header with responsive design */}
        <div className="fixed top-0 right-0 w-full z-50 p-4">
          {/* Desktop view */}
          <div className="hidden md:flex items-center justify-end gap-3">
            <a 
              href="https://github.com/karimrkhoury/ziplock.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-2 rounded-lg 
                bg-gray-100 dark:bg-gray-800 
                text-gray-800 dark:text-gray-200
                hover:bg-gray-200 dark:hover:bg-gray-700
                shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span className="text-sm">{githubStars}</span>
              </div>
            </a>
            <LanguageSwitcher 
              currentLang={language}
              onLanguageChange={setLanguage}
            />
            <ThemeToggle />
          </div>

          {/* Mobile view - Hamburger button */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                text-gray-800 dark:text-gray-200 shadow-lg"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile menu */}
          <div className={`
            md:hidden fixed top-16 right-4 
            bg-white dark:bg-gray-800 
            rounded-lg shadow-xl
            transition-all duration-200 transform
            ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
          `}>
            <div className="p-2 space-y-2">
              <a 
                href="https://github.com/karimrkhoury/ziplock.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-2 rounded-lg
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-colors duration-200"
              >
                <span>GitHub</span>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{githubStars}</span>
                </div>
              </a>
              <div className="px-2 py-1">
                <LanguageSwitcher 
                  currentLang={language}
                  onLanguageChange={(lang) => {
                    setLanguage(lang);
                    setIsMobileMenuOpen(false);
                  }}
                />
              </div>
              <div className="px-2 py-1">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Main content - add flex-grow to push footer down */}
        <div className="flex-grow">
          <div className="max-w-2xl mx-auto p-8">
            <div className="text-center mb-8">
              <ZipLockLogo 
                lang={language} 
                onReset={handleReset}
              />
            </div>

            {/* Slogan */}
            <div className="text-center mb-8 font-medium tracking-wide">
              <div className={`text-base inline-flex items-center justify-center text-gray-600 dark:text-gray-300
                ${language === Language.AR ? 'flex-row-reverse gap-4' : 'space-x-2'}`}
              >
                {language === Language.AR ? (
                  // Arabic flow (right to left, but same logical order)
                  <>
                    <span>{t.tagline.zip} 📦</span>
                    <span className="text-gray-400 dark:text-gray-500">←</span>
                    <span>{t.tagline.lock} 🔒</span>
                    <span className="text-gray-400 dark:text-gray-500">←</span>
                    <span>{t.tagline.share} 🚀</span>
                    <span className="text-gray-400 dark:text-gray-500">←</span>
                    <span>{t.tagline.done} ✨</span>
                  </>
                ) : (
                  // English flow (left to right)
                  <>
                    <span>{t.tagline.zip} 📦</span>
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <span>{t.tagline.lock} 🔒</span>
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <span>{t.tagline.share} 🚀</span>
                    <span className="text-gray-400 dark:text-gray-500">→</span>
                    <span>{t.tagline.done} ✨</span>
                  </>
                )}
              </div>
            </div>

            <div className={`transition-opacity duration-200 ease-in-out
              ${isResetting ? 'opacity-0' : 'opacity-100'}`}
            >
              {!isCompleted ? (
                <div className="space-y-6">
                  <div className="relative group">
                    {/* Reduced glow effect for dropzone */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      dark:from-blue-400/20 dark:to-purple-400/20 rounded-lg blur opacity-0 
                      group-hover:opacity-100 transition duration-300">
                    </div>
                    
                    <DropZone 
                      onDrop={handleFileDrop}
                      maxSize={100 * 1024 * 1024}
                      lang={language}
                      className="relative z-10 hover:scale-[1.01] transition-transform duration-300"
                    />
                  </div>
                  
                  {/* File List */}
                  {files.length > 0 && (
                    <div className="animate-fade-slide-up">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2">
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
                              className={`flex items-center justify-between py-2 px-3 
                                bg-gray-50 dark:bg-gray-700/50 rounded-lg
                                group hover:bg-gray-100 dark:hover:bg-gray-700
                                transition-all duration-200
                                ${removingFileId === index ? 'animate-fade-out' : 'animate-slide-in'}`}
                            >
                              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                <span className="text-xl" role="img" aria-label="file type">
                                  {getFileEmoji(file.name)}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
                    </div>
                  )}

                  {files.length > 0 && (
                    <>
                      {/* Password Section when files are present */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="relative flex-1">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.secretPassword.funnyPlaceholder}
                            className="w-full h-10 px-4 bg-gray-50 dark:bg-gray-800 
                              border border-gray-200 dark:border-gray-700
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
                            // Copy to clipboard
                            navigator.clipboard.writeText(randomPassword).then(() => {
                              setPassword(randomPassword);
                              setShowPassword(true);
                              // Show random fun message with explicit clipboard mention
                              const message = t.magicPassword.messages[
                                Math.floor(Math.random() * t.magicPassword.messages.length)
                              ];
                              showSnackbar(`${message} 📋`);
                            }).catch(() => {
                              // Fallback if clipboard fails
                              setPassword(randomPassword);
                              setShowPassword(true);
                              showSnackbar(t.magicPassword.clipboardError);
                            });
                          }}
                          className="h-10 px-4 bg-blue-500/10 dark:bg-blue-400/10
                            text-blue-600 dark:text-blue-300 rounded-lg text-sm whitespace-nowrap
                            hover:bg-blue-500/20 dark:hover:bg-blue-400/20
                            transition-colors duration-200"
                          aria-label={t.buttons.magicPassword}
                        >
                          {t.buttons.magicPassword}
                        </button>
                      </div>

                      {/* Pack it up button with reduced glow and more obvious hover */}
                      <div className="mt-8 relative group">
                        {!isProcessing && (
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                            dark:from-blue-400/20 dark:to-purple-400/20 rounded-lg blur opacity-0 
                            group-hover:opacity-100 transition duration-300">
                          </div>
                        )}

                        {/* Progress bar overlay */}
                        <div className={`absolute inset-0 
                          transition-opacity duration-300 ease-in
                          ${isProcessing ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                              <div className="transition-all duration-500">
                                {progressMessage}
                              </div>
                              <div>
                                {Math.round(progress)}%
                              </div>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 
                                  dark:from-blue-400 dark:to-purple-400
                                  transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            {/* Rotating fun messages */}
                            <div className="text-xs text-center text-gray-400 dark:text-gray-500 transition-all duration-300">
                              {funMessage}
                            </div>
                          </div>
                        </div>

                        {/* Button with tooltip */}
                        <div className="relative">
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

                          {/* Tooltip - Only shows on hover when password is invalid */}
                          {(!password || password.length < 8) && (
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-max
                              px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm
                              rounded-lg shadow-lg opacity-0 group-hover:opacity-100
                              transition-opacity duration-200 pointer-events-none"
                            >
                              {t.validation.passwordTip}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                                border-8 border-transparent border-t-gray-900 dark:border-t-gray-700"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="animate-fade-in space-y-4">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold dark:text-white mb-2">
                        {t.missionAccomplished.title} 🎉
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t.missionAccomplished.message}
                      </p>
                    </div>

                    {/* Gamified Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.stats.originalSize}</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                          {compressionStats && (
                            compressionStats.originalSize < 1024 
                              ? `${compressionStats.originalSize} B`
                              : formatFileSize(compressionStats.originalSize, language)
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {compressionStats && t.fileSize[
                            compressionStats.originalSize < 1024 ? 'tiny' :
                            compressionStats.originalSize < 1024 * 1024 ? 'small' :
                            compressionStats.originalSize < 10 * 1024 * 1024 ? 'medium' : 'big'
                          ]}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.stats.saved}</div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {compressionStats && 
                            Math.round((1 - compressionStats.compressedSize / compressionStats.originalSize) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {compressionStats && t.compression[
                            compressionStats.compressedSize < compressionStats.originalSize / 2 
                              ? 'superSquish' 
                              : 'nice'
                          ]}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.stats.processingTime}</div>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {compressionStats && compressionStats.processingTime.toFixed(1)}s
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {compressionStats && t.speed[
                            compressionStats.processingTime < 1 ? 'zoom' :
                            compressionStats.processingTime < 2 ? 'fast' : 'done'
                          ]}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownload}
                        className="flex-1 py-2.5 bg-green-500/10 dark:bg-green-400/10
                          text-green-600 dark:text-green-300 rounded-lg font-medium
                          hover:bg-green-500/20 dark:hover:bg-green-400/20
                          transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <span>{t.buttons.download}</span>
                      </button>

                      <button
                        disabled
                        className="flex-1 py-2.5 bg-blue-500/10 dark:bg-blue-400/10
                          text-blue-600 dark:text-blue-300 rounded-lg font-medium
                          opacity-50 cursor-not-allowed
                          transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <span>{t.buttons.emailKey}</span>
                      </button>
                    </div>
                  </div>

                  {/* Compact Donation Section */}
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {t.donation.support}
                    </p>
                    <a
                      href="https://www.paypal.com/paypalme/khourykarim"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-yellow-500/10 dark:bg-yellow-400/10
                        text-yellow-600 dark:text-yellow-300 rounded-lg font-medium
                        hover:bg-yellow-500/20 dark:hover:bg-yellow-400/20
                        transition-all duration-200 animate-cross-fade"
                    >
                      {donationMessage}
                    </a>
                  </div>
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

        {/* Footer - will stay at bottom */}
        <footer className="w-full py-6 px-4 mt-auto">
          <div className="max-w-2xl mx-auto space-y-2 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.security}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t.credit}
            </p>
          </div>
        </footer>

        {/* Snackbar stays above everything */}
        {snackbarMessage && (
          <div className="fixed inset-x-0 top-0 flex items-center justify-center">
            <div className="px-4 py-2 mt-4 bg-gray-900 dark:bg-gray-700 text-white
              rounded-lg shadow-lg animate-slide-down text-sm
              z-50 mx-auto"
            >
              {snackbarMessage}
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

export default App 