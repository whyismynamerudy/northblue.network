import BackgroundOverlay from './BackgroundOverlay'

interface SkillsSelectorProps {
  primarySkill: string
  secondarySkills: string[]
  skillType: 'primary' | 'secondary'
}

const skills = [
  'Design', 'Frontend', 'Backend', 'Product', 'Fullstack', 
  'Mobile', 'Hardware', 'Marketing', 'Venture', 'Art'
]

export default function SkillsSelector({
  primarySkill,
  secondarySkills,
  skillType
}: SkillsSelectorProps) {
  const currentSkills = skillType === 'primary' ? [primarySkill].filter(Boolean) : secondarySkills

  return (
    <>
        {/* Title */}
        <h1 className="text-2xl font-editorial text-white mb-6">
          Skills
        </h1>

        {/* Primary/Secondary Display */}
        <div className="flex space-x-6 mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 border-white rounded-full ${
              skillType === 'primary' ? 'bg-white' : 'bg-transparent'
            }`} />
            <span className={`text-sm font-medium font-mono-subtitle ${
              skillType === 'primary' ? 'text-white' : 'text-gray-300'
            }`}>
              PRIMARY
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 border-2 border-white rounded-full ${
              skillType === 'secondary' ? 'bg-white' : 'bg-transparent'
            }`} />
            <span className={`text-sm font-medium font-mono-subtitle ${
              skillType === 'secondary' ? 'text-white' : 'text-gray-300'
            }`}>
              SECONDARY
            </span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 gap-4">
          {skills.map((skill, index) => {
            const isSelected = currentSkills.includes(skill)
            
            return (
              <div
                key={skill}
                className={`flex items-center space-x-3 p-2 rounded ${
                  isSelected ? 'bg-white bg-opacity-20' : ''
                }`}
              >
                <div className={`w-4 h-4 border-2 border-white ${
                  skillType === 'primary' ? 'rounded-full' : 'rounded'
                } ${
                  isSelected ? 'bg-white' : 'bg-transparent'
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
            Selected: {currentSkills.length}/8 skills
          </div>
        )}
        </>
  )
}
