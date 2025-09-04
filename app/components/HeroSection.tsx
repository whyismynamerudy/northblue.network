export default function HeroSection() {
  return (
    <div className="h-screen px-6 py-8 text-center flex flex-col justify-center">      
      <div className="text-center max-w-2xl mx-auto">
      <div className="text-sm text-gray-300 mb-4 font-mono-subtitle">
        By <a href="https://mayalekhi.ca" target="_blank" rel="noopener noreferrer" className="underline">Maya Lekhi</a>. Updated 1/2/25.
      </div>

        <h1 className="text-6xl font-editorial mb-6 tracking-tight text-white">
          MUSTANGS<span className="italic">.so</span>
        </h1>
        
        <div className="text-lg text-gray-300 mb-8">
          ⌘ + u for a random trojan site
        </div>
        
        <p className="text-xl text-gray-200 leading-relaxed mb-12">
          Welcome to the directory of students and alumni at the University of Western Ontario. 
          This project documents one of the most talented student bodies in the world—meet the Mustang Network.
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
