import { useState } from 'react'
import { Language, translations } from '../i18n/translations'

interface SecretPasswordProps {
  password: string
  onPasswordChange: (password: string) => void
  onGeneratePassword: () => void
  lang: Language
}

interface TranslationType {
  title: string;
  funnyPlaceholder: string;
  savedPassword: string;
  placeholder: string;
}

function SecretPassword({ password, onPasswordChange, onGeneratePassword, lang }: SecretPasswordProps) {
  const [showPassword, setShowPassword] = useState(false)
  const t = translations[lang]

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {t.secretPassword.title}
      </h3>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder={t.secretPassword.funnyPlaceholder}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
            placeholder-gray-400 dark:placeholder-gray-500"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {showPassword ? t.buttons.hidePassword : t.buttons.showPassword}
          </button>
          <button
            onClick={onGeneratePassword}
            className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t.buttons.magicPassword}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecretPassword 