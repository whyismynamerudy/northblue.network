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
      {/* Base Background */}
      <div
        className={`fixed inset-0`}
        style={{
          background: 'linear-gradient(135deg, #000A1F 0%, #00204E 100%)'
        }}
      />
      
      {/* Frosted Glass Layer */}
      <div className="fixed inset-0 backdrop-blur-[100px]">
        {/* Glass panels with gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-950/30 via-transparent to-blue-900/20" />
      </div>
      
      {/* Animated Blurred Shapes */}
      <div className="fixed inset-0">
        
        {/* Shape 1 - Glass orb effect */}
        <div className="absolute rounded-full opacity-40 animate-pulse" 
             style={{ 
               animationDuration: '8s', 
               animationDelay: '1.5s',
               top: '60%', 
               right: '8%', 
               width: '260px', 
               height: '260px',
               transform: 'translate(30%, 25%)',
               background: 'radial-gradient(circle, rgba(0, 112, 243, 0.4) 0%, rgba(0, 32, 78, 0.2) 70%, transparent 100%)',
               filter: 'blur(70px)'
             }} />
        
        {/* Shape 2 - Subtle glass highlight */}
        <div className="absolute rounded-full opacity-30 animate-pulse" 
             style={{ 
               animationDuration: '13s', 
               animationDelay: '2s',
               top: '30%', 
               left: '70%', 
               width: '140px', 
               height: '140px',
               transform: 'translate(-20%, -15%)',
               background: 'radial-gradient(circle, rgba(100, 150, 255, 0.3) 0%, rgba(0, 80, 180, 0.15) 60%, transparent 100%)',
               filter: 'blur(35px)'
             }} />
        
        {/* Shape 3 - Large frosted area */}
        <div className="absolute rounded-full opacity-25 animate-pulse" 
             style={{ 
               animationDuration: '15s', 
               animationDelay: '0.8s',
               bottom: '15%', 
               left: '25%', 
               width: '420px', 
               height: '420px',
               transform: 'translate(50%, 40%)',
               background: 'radial-gradient(circle, rgba(0, 100, 220, 0.25) 0%, rgba(0, 50, 120, 0.1) 50%, transparent 100%)',
               filter: 'blur(80px)'
             }} />
        
        {/* Shape 4 - Glass panel effect */}
        <div className="absolute rounded-full opacity-35 animate-pulse" 
             style={{ 
               animationDuration: '17s', 
               animationDelay: '3s',
               top: '45%', 
               right: '25%', 
               width: '480px', 
               height: '320px',
               transform: 'translate(5%, -20%)',
               background: 'linear-gradient(145deg, rgba(0, 120, 255, 0.2) 0%, rgba(0, 60, 150, 0.15) 50%, transparent 100%)',
               filter: 'blur(50px)'
             }} />

        {/* Shape 5 - Deep glass gradient */}
        <div className="absolute rounded-full opacity-30 animate-pulse" 
             style={{ 
               animationDuration: '20s', 
               animationDelay: '1.8s',
               bottom: '15%', 
               left: '25%', 
               width: '700px', 
               height: '700px',
               transform: 'translate(-10%, -30%)',
               filter: 'blur(90px)',
               background: 'radial-gradient(ellipse, rgba(0, 90, 200, 0.25) 0%, rgba(0, 40, 100, 0.15) 40%, rgba(0, 10, 31, 0.2) 70%, transparent 100%)'
             }} />

        {/* Additional glass texture overlays */}
        <div className="absolute top-0 left-0 w-full h-1/2 opacity-20"
             style={{
               background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%)'
             }} />
        
        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-15"
             style={{
               background: 'linear-gradient(270deg, rgba(0, 150, 255, 0.08) 0%, transparent 100%)'
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