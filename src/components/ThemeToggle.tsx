import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div 
      onClick={toggleTheme}
      className="w-full h-full flex items-center justify-center
        text-gray-700 dark:text-gray-200
        transition-all duration-200
        cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </div>
  )
} 