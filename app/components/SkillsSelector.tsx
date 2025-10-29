import BackgroundOverlay from './BackgroundOverlay'

interface SkillsSelectorProps {
  primarySkill: string
  secondarySkills: string[]
  skillType: 'primary' | 'secondary'
  focusedStudent?: {
    name: string
    skill: string
  } | null
}

const skills = [
  'Product', 'AI/ML', 'Fullstack', 'Frontend', 'Backend', 
  'Mobile', 'Systems', 'UI/UX', 'Marketing', 'Venture', 'Hardware'
]

export default function SkillsSelector({
  primarySkill,
  secondarySkills,
  skillType,
  focusedStudent
}: SkillsSelectorProps) {
  // Show both primary and secondary skills
  const allSelectedSkills = [...(primarySkill ? [primarySkill] : []), ...secondarySkills]

  return (
    <>
      {/* Title */}
      <h1 className="text-2xl font-editorial text-white mb-4">
        Skills
      </h1>

      {/* Primary/Secondary Display */}
      <div className="flex space-x-4 mb-4">
        <div className="flex items-center space-x-1.5">
          <div className={`w-4 h-4 border border-white rounded-full ${
            skillType === 'primary' ? 'bg-white' : 'bg-transparent'
          }`} />
          <span className={`text-xs font-medium font-mono-subtitle text-gray-400`}>
            PRIMARY
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className={`w-4 h-4 border border-white rounded-full ${
            skillType === 'secondary' ? 'bg-white' : 'bg-transparent'
          }`} />
          <span className={`text-xs font-medium font-mono-subtitle text-gray-400`}>
            SECONDARY
          </span>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 gap-2">
        {skills.map((skill, index) => {
          const isPrimary = skill === primarySkill
          const isSecondary = secondarySkills.includes(skill)
          const isSelected = isPrimary || isSecondary
          
          return (
            <div
              key={skill}
              className={`flex items-center space-x-2 py-1 rounded transition-opacity ${isSelected ? 'opacity-100' : 'opacity-10'}`}
            >
              <div className={`w-6 h-6 rounded-full ${
                isPrimary ? 'bg-white' : 
                isSecondary ? 'bg-transparent border border-white' : 
                'bg-transparent'
              }`} />
              <span className={`text-sm font-medium ${
                isSelected ? 'text-white' : 'text-gray-300'
              }`}>
                {skill}
              </span>
            </div>
          )
        })}
      </div>

      {/* Selection Info */}
      {skillType === 'secondary' && (
        <div className="mt-4 text-xs text-gray-300">
          Selected: {secondarySkills.length}/8 skills
        </div>
      )}
    </>
  )
}
