interface HeaderProps {
  onJoinClick: () => void
}

export default function Header({ onJoinClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center p-6">
      <p className="text-white text-sm font-bold">mustangs.so</p>
      <button 
        onClick={onJoinClick}
        className="text-white text-sm hover:text-gray-300 transition-colors"
      >
        join
      </button>
    </div>
  )
}
