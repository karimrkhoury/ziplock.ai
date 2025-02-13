function LockLogo(): JSX.Element {
  return (
    <div className="inline-flex items-center">
      <div className="relative group select-none">
        {/* Main text */}
        <h1 className="text-7xl font-black tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="relative inline-block backdrop-blur-sm">
            {/* Highlight effect with translucency */}
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 via-blue-100/20 to-purple-100/20 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out backdrop-blur-md" />
            
            {/* Text with gradient */}
            <span className="relative inline-block mix-blend-overlay dark:mix-blend-difference">
              <span className="relative z-10">
                <span className="bg-gradient-to-r from-gray-800/90 to-gray-600/90 dark:from-gray-100/90 dark:to-white/90 bg-clip-text text-transparent backdrop-blur-sm">
                  zip
                </span>
                <span className="bg-gradient-to-r from-blue-400/90 via-blue-500/90 to-purple-400/90 bg-clip-text text-transparent backdrop-blur-sm">
                  lock
                </span>
              </span>
            </span>
          </span>
        </h1>

        {/* Translucent line indicator */}
        <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400/80 via-purple-400/80 to-pink-400/80 group-hover:w-full transition-all duration-500 ease-out backdrop-blur-sm" />
      </div>
    </div>
  )
}

export default LockLogo 