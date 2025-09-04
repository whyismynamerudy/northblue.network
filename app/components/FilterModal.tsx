'use client'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSkills: string[]
  selectedYears: string[]
  onSkillToggle: (skill: string) => void
  onYearToggle: (year: string) => void
}

const skills = ['Frontend', 'Backend', 'Fullstack', 'Product', 'Marketing', 'Design', 'Venture', 'Mobile']
const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']

export default function FilterModal({ 
  isOpen, 
  onClose, 
  selectedSkills, 
  selectedYears, 
  onSkillToggle, 
  onYearToggle 
}: FilterModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 w-80 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Skills</h3>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((skill) => (
              <button
                key={skill}
                onClick={() => onSkillToggle(skill)}
                className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mb-6"></div>

        {/* Years Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Years</h3>
          <div className="grid grid-cols-3 gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => onYearToggle(year)}
                className={`px-3 py-2 rounded-md text-sm border transition-colors ${
                  selectedYears.includes(year)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Clear All Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              selectedSkills.forEach(skill => onSkillToggle(skill))
              selectedYears.forEach(year => onYearToggle(year))
            }}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
}
