interface SearchSidebarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  students: Array<{
    name: string
    site: string
    skill: string
    secondarySkills?: string[]
    header: string
    description: string
    gradYear: string
    linkedinUrl?: string
    xUrl?: string
    personalSite?: string
    profileImage?: string
  }>
  onStudentClick: (studentName: string) => void
  onFilterClick: () => void
}

export default function SearchSidebar({ searchTerm, onSearchChange, students, onStudentClick, onFilterClick }: SearchSidebarProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Search */}
      <div className="px-6 pb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-6 pr-4 py-2 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none text-sm"
          />
          <button 
            onClick={onFilterClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-4">
          <div className="grid grid-cols-6 gap-4 text-xs text-gray-400 font-mono-subtitle">
            <div className="col-span-2">NAME</div>
            <div className="col-span-4">SITE</div>
          </div>
        </div>
        <div className="px-6">
          {students.map((student, index) => (
            <div key={index} className="py-3 hover:bg-gray-900 transition-colors">
              <div className="grid grid-cols-6 gap-4 text-sm">
                <div 
                  className="col-span-2 text-gray-400 cursor-pointer transition-colors"
                  onClick={() => onStudentClick(student.name)}
                >
                  {student.name}
                </div>
                <div className="col-span-4 text-gray-400 cursor-pointer">
                  <a href={`https://${student.site}`} target="_blank" rel="noopener noreferrer">
                    {student.site}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
