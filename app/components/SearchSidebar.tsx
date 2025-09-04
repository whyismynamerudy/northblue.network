interface SearchSidebarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  students: Array<{
    name: string
    site: string
    skill: string
  }>
}

export default function SearchSidebar({ searchTerm, onSearchChange, students }: SearchSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="px-6 pb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:border-gray-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-medium">
            <div>NAME</div>
            <div>SITE</div>
            <div>SKILL</div>
          </div>
        </div>
        <div className="px-6">
          {students.map((student, index) => (
            <div key={index} className="py-3 border-b border-gray-800 hover:bg-gray-900 transition-colors">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-white">{student.name}</div>
                <div className="text-blue-400 hover:text-blue-300 cursor-pointer">
                  <a href={`https://${student.site}`} target="_blank" rel="noopener noreferrer">
                    {student.site}
                  </a>
                </div>
                <div className="text-gray-300">{student.skill}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
