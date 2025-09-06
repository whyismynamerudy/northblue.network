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
      <div className={`fixed inset-0 bg-black`} />
      
      {/* Animated Blurred Shapes */}
      <div className="fixed inset-0">
        
        {/* Shape 2 - Extra Large */}
        <div className="absolute bg-purple-400 rounded-full opacity-20 animate-pulse" 
             style={{ 
               animationDuration: '8s', 
               animationDelay: '1.5s',
               top: '60%', 
               right: '8%', 
               width: '200px', 
               height: '200px',
               transform: 'translate(30%, 25%)',
               filter: 'blur(80px)'
             }} />
        
        {/* Shape 3 - Medium */}
        <div className="absolute bg-indigo-400 rounded-full opacity-30 animate-pulse" 
             style={{ 
               animationDuration: '13s', 
               animationDelay: '2s',
               top: '30%', 
               left: '70%', 
               width: '80px', 
               height: '80px',
               transform: 'translate(-20%, -15%)',
               filter: 'blur(50px)'
             }} />
        
        {/* Shape 4 - Huge */}
        <div className="absolute bg-pink-400 rounded-full opacity-15 animate-pulse" 
             style={{ 
               animationDuration: '15s', 
               animationDelay: '0.8s',
               bottom: '15%', 
               left: '25%', 
               width: '300px', 
               height: '300px',
               transform: 'translate(50%, 40%)',
               filter: 'blur(100px)'
             }} />
        
        {/* Shape 5 - Large */}
        <div className="absolute bg-cyan-400 rounded-full opacity-25 animate-pulse" 
             style={{ 
               animationDuration: '17s', 
               animationDelay: '3s',
               top: '45%', 
               right: '25%', 
               width: '350px', 
               height: '250px',
               transform: 'translate(5%, -20%)',
               filter: 'blur(70px)'
             }} />

        {/* Shape 6 - Huge */}
        <div className="absolute rounded-full opacity-35 animate-pulse" 
             style={{ 
               animationDuration: '20s', 
               animationDelay: '1.8s',
               bottom: '15%', 
               left: '25%', 
               width: '500px', 
               height: '500px',
               transform: 'translate(-10%, -30%)',
               filter: 'blur(100px)',
               background: 'linear-gradient(135deg,rgb(149, 86, 178),rgb(28, 33, 135))'
             }} />

      </div>
      
      {/* Image Overlay */}
      <div 
        className="fixed inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/overlay.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
