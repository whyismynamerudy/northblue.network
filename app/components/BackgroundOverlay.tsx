interface BackgroundOverlayProps {
  children: React.ReactNode
  gradientFrom?: string
  gradientTo?: string
  gradientVia?: string
  className?: string
}

export default function BackgroundOverlay({ 
  children, 
  gradientFrom = "from-blue-900",
  gradientTo = "to-purple-900", 
  gradientVia = "via-indigo-800",
  className = ""
}: BackgroundOverlayProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Base Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientVia} ${gradientTo}`} />
      
      {/* Image Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: 'url(/image.png)',
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
