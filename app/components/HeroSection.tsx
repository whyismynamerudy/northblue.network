export default function HeroSection() {
  return (
    <div className="h-screen px-6 py-8 text-center flex flex-col justify-center">      
      <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs text-gray-400 mb-4 font-mono-subtitle">
        By <a href="https://x.com/maya_l39" target="_blank" rel="noopener noreferrer" className="underline">Maya Lekhi</a>. Inspired by <a href="https://x.com/joshuawolk" target="_blank" rel="noopener noreferrer" className="underline">Josh Wolk</a>.
      </div>

        <h1 className="text-6xl font-editorial mb-6 tracking-tight text-white">
          MUSTANGS
        </h1>
        
        <div className="text-lg text-white mb-8">
          ⌘ + u for a random mustang site
        </div>
        
        <p className="text-lg text-white opacity-60 leading-relaxed mb-12">
        Meet the creators, builders, and dreamers of Western University. 
        Welcome to the Mustangs Network.
        </p>
        
        <div className="flex flex-col items-center">
          <div className="text-lg mb-2">Scroll to begin.</div>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
