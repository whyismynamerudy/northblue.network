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
      
      {/* Animated Blurred Shapes */}
      <div className="fixed inset-0">
        
        {/* Shape 2 - Extra Large */}
        <div className="absolute bg-[#00204E] rounded-full opacity-70 animate-pulse" 
             style={{ 
               animationDuration: '8s', 
               animationDelay: '1.5s',
               top: '60%', 
               right: '8%', 
                width: '260px', 
                height: '260px',
               transform: 'translate(30%, 25%)',
                filter: 'blur(70px)'
             }} />
        
        {/* Shape 3 - Medium */}
        <div className="absolute bg-[#00204E] rounded-full opacity-70 animate-pulse" 
             style={{ 
               animationDuration: '13s', 
               animationDelay: '2s',
               top: '30%', 
               left: '70%', 
                width: '140px', 
                height: '140px',
               transform: 'translate(-20%, -15%)',
                filter: 'blur(35px)'
             }} />
        
        {/* Shape 4 - Huge */}
        <div className="absolute bg-[#00204E] rounded-full opacity-60 animate-pulse" 
             style={{ 
               animationDuration: '15s', 
               animationDelay: '0.8s',
               bottom: '15%', 
               left: '25%', 
                width: '420px', 
                height: '420px',
               transform: 'translate(50%, 40%)',
                filter: 'blur(80px)'
             }} />
        
        {/* Shape 5 - Large */}
        <div className="absolute bg-[#00204E] rounded-full opacity-60 animate-pulse" 
             style={{ 
               animationDuration: '17s', 
               animationDelay: '3s',
               top: '45%', 
               right: '25%', 
                width: '480px', 
                height: '320px',
               transform: 'translate(5%, -20%)',
                filter: 'blur(50px)'
             }} />

        {/* Shape 6 - Huge */}
        <div className="absolute rounded-full opacity-70 animate-pulse" 
             style={{ 
               animationDuration: '20s', 
               animationDelay: '1.8s',
               bottom: '15%', 
               left: '25%', 
                width: '700px', 
                height: '700px',
               transform: 'translate(-10%, -30%)',
                filter: 'blur(90px)',
                background: 'linear-gradient(135deg, #00204E, #000000)'
             }} />

      </div>
      
      
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
