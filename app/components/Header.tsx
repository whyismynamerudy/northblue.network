interface HeaderProps {
  onJoinClick: () => void
  onEditClick: () => void
}

export default function Header({ onJoinClick, onEditClick }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center p-6">
      <p className="text-white text-sm">northblue.network</p>
      <div className="flex items-center gap-4">
      <button 
          onClick={onJoinClick}
          className="text-white text-sm underline underline-offset-4 decoration-gray-400/60 hover:decoration-white transition-colors"
        >
          join
        </button>
        <button
          onClick={onEditClick}
          className="text-white text-sm underline underline-offset-4 decoration-gray-400/60 hover:decoration-white transition-colors"
        >
          edit profile
        </button>
      </div>
    </div>
  )
}
