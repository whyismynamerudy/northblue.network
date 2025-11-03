'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import JoinForm from './components/JoinForm'
import ProfileCard from './components/ProfileCard'
import SkillsSelector from './components/SkillsSelector'
import SearchSidebar from './components/SearchSidebar'
import FilterModal from './components/FilterModal'
import HeroSection from './components/HeroSection'
import BackgroundOverlay from './components/BackgroundOverlay'
import SearchModal from './components/SearchModal'
import EditProfileEmailModal from './components/EditProfileEmailModal'

interface Student {
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
}


export default function Home() {
  const [studentsList, setStudentsList] = useState<Student[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [primarySkill, setPrimarySkill] = useState<string>('')
  const [secondarySkills, setSecondarySkills] = useState<string[]>([])
  const [skillType, setSkillType] = useState<'primary' | 'secondary'>('primary')
  const [focusedStudent, setFocusedStudent] = useState<Student | null>(null)
  const [showSidebars, setShowSidebars] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedYears, setSelectedYears] = useState<string[]>([])
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showEditEmailModal, setShowEditEmailModal] = useState(false)

  // Preload embedding model in background
  useEffect(() => {
    // Dynamic import to avoid loading on server
    import('@/lib/embeddings-worker').then(({ preloadEmbeddingModel }) => {
      preloadEmbeddingModel().then((success) => {
        if (success) {
          console.log('Embedding model preloaded successfully')
        }
      })
    })
  }, [])

  // Load students from API on component mount
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await fetch('/api/students', { cache: 'no-store' })
        if (!res.ok) {
          console.error('Error loading students:', await res.text())
          return
        }
        const json = await res.json()
        const data = json.data || []
        const transformedStudents = data.map((student: any) => ({
          name: student.name,
          site: student.site,
          skill: student.skill,
          secondarySkills: student.secondary_skills || [],
          header: student.header || '',
          description: student.description || '',
          gradYear: student.grad_year || '',
          linkedinUrl: student.linkedin_url,
          xUrl: student.x_url,
          personalSite: student.personal_site,
          profileImage: student.profile_image_url || ''
        }))
        setStudentsList(transformedStudents)
        setFilteredStudents(transformedStudents)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    loadStudents()
  }, [])

  useEffect(() => {
    const filtered = studentsList.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.site.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.includes(student.skill) ||
        (student.secondarySkills && student.secondarySkills.some(skill => selectedSkills.includes(skill)))
      
      const matchesYears = selectedYears.length === 0 || 
        selectedYears.includes(student.gradYear)
      
      return matchesSearch && matchesSkills && matchesYears
    })
    setFilteredStudents(filtered)
  }, [searchTerm, studentsList, selectedSkills, selectedYears])

  // Command+K handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command+U - Random student
      if ((event.metaKey || event.ctrlKey) && event.key === 'u') {
        event.preventDefault()
        const randomStudent = studentsList[Math.floor(Math.random() * studentsList.length)]
        window.open(`https://${randomStudent.site}`, '_blank')
      }
      
      // Command+K - Open search modal
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setShowSearchModal(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [studentsList])

  // Track scroll position to show/hide sidebars
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const heroHeight = window.innerHeight
      setShowSidebars(scrollTop > heroHeight * 0.3)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track which student is in focus based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const profileCards = filteredStudents.map(student => 
        document.getElementById(student.name.toLowerCase().replace(/\s+/g, '-'))
      ).filter(Boolean) as HTMLElement[]

      if (profileCards.length === 0) return

      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const scrollBottom = scrollTop + windowHeight

      let focusedCard = null
      let maxVisibleHeight = 0
      
      for (const card of profileCards) {
        const cardTop = card.offsetTop
        const cardBottom = cardTop + card.offsetHeight
        
        const visibleTop = Math.max(cardTop, scrollTop)
        const visibleBottom = Math.min(cardBottom, scrollBottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight
          focusedCard = card
        }
      }

      if (focusedCard) {
        const student = filteredStudents.find(s => 
          s.name.toLowerCase().replace(/\s+/g, '-') === focusedCard.id
        )
        if (student && student !== focusedStudent) {
          setFocusedStudent(student)
          setPrimarySkill(student.skill)
          setSecondarySkills(student.secondarySkills || [])
          setSkillType('primary')
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredStudents, focusedStudent])

  const addStudent = (newStudent: Omit<Student, 'site'> & { site: string }) => {
    const student: Student = {
      ...newStudent,
      site: newStudent.personalSite || newStudent.linkedinUrl || newStudent.xUrl || 'no-site.com',
      secondarySkills: newStudent.secondarySkills || []
    }
    setStudentsList(prev => [...prev, student])
  }

  const scrollToStudent = (studentName: string) => {
    const elementId = studentName.toLowerCase().replace(/\s+/g, '-')
    const element = document.getElementById(elementId)
    if (element) {
      const elementTop = element.offsetTop
      const offset = 100
      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      })
    }
  }

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    )
  }

  return (
    <BackgroundOverlay 
      gradientFrom="from-gray-900" 
      gradientVia="via-gray-800" 
      gradientTo="to-black"
      className="min-h-screen"
    >
      <Header onJoinClick={() => setShowJoinForm(true)} onEditClick={() => setShowEditEmailModal(true)} />
      <div className="min-h-screen flex pt-16">        

        {/* Left Column - Search - Hidden on mobile and iPad */}
        <div className={`w-1/4 fixed left-0 top-16 h-full z-10 transition-opacity duration-500 hidden lg:block ${
          showSidebars ? 'opacity-100' : 'opacity-0'
        }`}>
          <SearchSidebar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            students={filteredStudents}
            onStudentClick={scrollToStudent}
            onFilterClick={() => setShowFilterModal(true)}
          />
        </div>

        {/* Middle Column - Profile Cards - Responsive width */}
        <div className="w-full lg:w-1/3 lg:max-w-1/3 overflow-y-auto mx-auto px-4 lg:px-0">
          <HeroSection isLoading={filteredStudents.length === 0} />
          
          <div className="p-4 lg:p-6 pb-20 lg:pb-40 mb-[20vh] space-y-40 lg:space-y-64">
            {filteredStudents.map((student, index) => (
              <ProfileCard
                key={index}
                id={student.name.toLowerCase().replace(/\s+/g, '-')}
                name={student.name}
                gradYear={student.gradYear}
                role={student.header}
                description={student.description}
                linkedinUrl={student.linkedinUrl}
                xUrl={student.xUrl}
                personalSite={student.personalSite}
                profileImage={student.profileImage}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Skills Selector - Hidden on mobile and iPad */}
        <div className={`w-1/4 p-6 fixed right-0 top-16 h-full overflow-y-auto transition-opacity duration-500 hidden lg:block ${
          showSidebars ? 'opacity-100' : 'opacity-0'
        }`}>
          <SkillsSelector
            primarySkill={primarySkill}
            secondarySkills={secondarySkills}
            skillType={skillType}
            focusedStudent={focusedStudent}
          />
        </div>

        {/* Join Form Modal */}
        <JoinForm isOpen={showJoinForm} onClose={() => setShowJoinForm(false)} onAddStudent={addStudent} />
        
        {/* Filter Modal */}
        <FilterModal 
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          selectedSkills={selectedSkills}
          selectedYears={selectedYears}
          onSkillToggle={handleSkillToggle}
          onYearToggle={handleYearToggle}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onStudentClick={scrollToStudent}
        />
        
        {/* Edit Profile Email Modal */}
        <EditProfileEmailModal 
          isOpen={showEditEmailModal}
          onClose={() => setShowEditEmailModal(false)}
        />
      </div>
    </BackgroundOverlay>
  )
}