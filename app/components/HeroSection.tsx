interface HeroSectionProps {
  isLoading?: boolean
}

export default function HeroSection({ isLoading = false }: HeroSectionProps) {
  return (
    <div className="h-screen px-6 py-8 text-center flex flex-col justify-center">      
      <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs text-gray-400 mb-4 font-mono-subtitle">
        By <a href="https://x.com/wimnr9745" target="_blank" rel="noopener noreferrer" className="underline">Rudraksh Monga</a> & <a href="https://www.linkedin.com/in/karlmichaud/" target="_blank" rel="noopener noreferrer" className="underline">Karl-Alexandre Michaud</a>. 
        <br/>
        Inspired by <a href="https://x.com/maya_l39" target="_blank" rel="noopener noreferrer" className="underline">Maya Lekhi</a>.
      </div>

        <h1 className="text-6xl font-editorial mb-6 tracking-tight text-white">
          North Blue
        </h1>
        
        <div className="text-lg text-white mb-8">
          ⌘ + u for a random North Blue site
        </div>
        
        <p className="text-lg text-white opacity-60 leading-relaxed mb-12">
        Meet the builders, creators, and dreamers of the University of Toronto. 
        These talented students and alumni are defining the next generation of leadership and creative excellence.
        Welcome to the North Blue Network.
        </p>
        
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            </div>
          ) : (
            <>
              <div className="text-lg text-white mb-2">Scroll to begin.</div>
              <svg className="w-6 h-6 animate-bounce" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
