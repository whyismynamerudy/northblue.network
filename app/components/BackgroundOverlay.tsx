interface BackgroundOverlayProps {
  children: React.ReactNode
  gradientFrom?: string
  gradientTo?: string
  gradientVia?: string
  className?: string
}

export default function BackgroundOverlay({ 
  children, 
  className = ""
}: BackgroundOverlayProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Background - Darker */}
      <div
        className={`fixed inset-0`}
        style={{
          background: 'linear-gradient(135deg, #000510 0%, #001028 100%)'
        }}
      />
      
      {/* Frosted Glass Layer - Darker tint */}
      <div className="fixed inset-0 backdrop-blur-[100px]">
        {/* Glass panels with gradient overlays - reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-blue-800/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-950/15 via-transparent to-blue-900/10" />
      </div>
      
      {/* Animated Blurred Shapes - Brighter & Bigger */}
      <div className="fixed inset-0">
        
        {/* Shape 1 - Glass orb effect - BIGGER & BRIGHTER */}
        <div className="absolute rounded-full opacity-70 animate-pulse" 
             style={{ 
               animationDuration: '8s', 
               animationDelay: '1.5s',
               top: '60%', 
               right: '8%', 
               width: '380px', 
               height: '380px',
               transform: 'translate(30%, 25%)',
               background: 'radial-gradient(circle, rgba(0, 140, 255, 0.6) 0%, rgba(0, 80, 200, 0.4) 50%, rgba(0, 32, 78, 0.2) 70%, transparent 100%)',
               filter: 'blur(70px)'
             }} />
        
        {/* Shape 2 - Subtle glass highlight - BIGGER & BRIGHTER */}
        <div className="absolute rounded-full opacity-60 animate-pulse" 
             style={{ 
               animationDuration: '13s', 
               animationDelay: '2s',
               top: '30%', 
               left: '70%', 
               width: '220px', 
               height: '220px',
               transform: 'translate(-20%, -15%)',
               background: 'radial-gradient(circle, rgba(120, 170, 255, 0.5) 0%, rgba(0, 100, 200, 0.3) 50%, rgba(0, 80, 180, 0.15) 60%, transparent 100%)',
               filter: 'blur(40px)'
             }} />
        
        {/* Shape 3 - Large frosted area - BIGGER & BRIGHTER */}
        <div className="absolute rounded-full opacity-55 animate-pulse" 
             style={{ 
               animationDuration: '15s', 
               animationDelay: '0.8s',
               bottom: '15%', 
               left: '25%', 
               width: '600px', 
               height: '600px',
               transform: 'translate(50%, 40%)',
               background: 'radial-gradient(circle, rgba(0, 130, 255, 0.45) 0%, rgba(0, 80, 180, 0.25) 40%, rgba(0, 50, 120, 0.1) 60%, transparent 100%)',
               filter: 'blur(90px)'
             }} />
        
        {/* Shape 4 - Glass panel effect - BIGGER & BRIGHTER */}
        <div className="absolute rounded-full opacity-65 animate-pulse" 
             style={{ 
               animationDuration: '17s', 
               animationDelay: '3s',
               top: '45%', 
               right: '25%', 
               width: '650px', 
               height: '450px',
               transform: 'translate(5%, -20%)',
               background: 'linear-gradient(145deg, rgba(0, 150, 255, 0.4) 0%, rgba(0, 100, 200, 0.3) 40%, rgba(0, 60, 150, 0.15) 70%, transparent 100%)',
               filter: 'blur(60px)'
             }} />

        {/* Shape 5 - Deep glass gradient - BIGGER & BRIGHTER */}
        <div className="absolute rounded-full opacity-60 animate-pulse" 
             style={{ 
               animationDuration: '20s', 
               animationDelay: '1.8s',
               bottom: '15%', 
               left: '25%', 
               width: '900px', 
               height: '900px',
               transform: 'translate(-10%, -30%)',
               filter: 'blur(100px)',
               background: 'radial-gradient(ellipse, rgba(0, 120, 240, 0.45) 0%, rgba(0, 80, 180, 0.3) 30%, rgba(0, 40, 100, 0.2) 60%, rgba(0, 10, 31, 0.1) 80%, transparent 100%)'
             }} />

        {/* Additional glass texture overlays - reduced */}
        <div className="absolute top-0 left-0 w-full h-1/2 opacity-10"
             style={{
               background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)'
             }} />
        
        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10"
             style={{
               background: 'linear-gradient(270deg, rgba(0, 150, 255, 0.05) 0%, transparent 100%)'
             }} />
      </div>
      
      {/* Subtle noise texture for glass effect */}
      <div className="fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
             backgroundRepeat: 'repeat'
           }} />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}