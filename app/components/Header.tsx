interface HeaderProps {
  onJoinClick: () => void
}

export default function Header({ onJoinClick }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
      <p className="text-white text-sm">northblue.network</p>
      <button 
        onClick={onJoinClick}
        className="text-white text-sm hover:text-gray-300 transition-colors"
      >
        join
      </button>
    </div>
  )
}
