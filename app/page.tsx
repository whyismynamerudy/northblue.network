'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import JoinForm from './components/JoinForm'
import ProfileCard from './components/ProfileCard'
import SkillsSelector from './components/SkillsSelector'
import SearchSidebar from './components/SearchSidebar'
import HeroSection from './components/HeroSection'
import BackgroundOverlay from './components/BackgroundOverlay'

interface Student {
  name: string
  site: string
  skill: string
  header: string
  description: string
  gradYear: string
  linkedinUrl?: string
  xUrl?: string
  personalSite?: string
  profileImage?: string
}

const students: Student[] = [
  { 
    name: "Jade Franson", 
    site: "jadefranson.com", 
    skill: "Design",
    header: "Jade is a creative designer passionate about visual storytelling.",
    description: "Jade specializes in brand identity and digital design, with a focus on creating memorable user experiences. Loves photography and hiking.",
    gradYear: "2024",
    linkedinUrl: "https://linkedin.com/in/jadefranson",
    xUrl: "https://x.com/jadefranson",
    personalSite: "https://jadefranson.com"
  },
  { 
    name: "Advik Unni", 
    site: "linkedin.com/in/advik-unni/", 
    skill: "Product",
    header: "Advik is a product manager building innovative solutions.",
    description: "Advik leads product development for early-stage startups, with expertise in user research and data-driven decision making.",
    gradYear: "2023",
    linkedinUrl: "https://linkedin.com/in/advik-unni",
    xUrl: "https://x.com/advikunni"
  },
  { 
    name: "Miki Safronov", 
    site: "x.com/shubgaur", 
    skill: "Fullstack",
    header: "Miki is a fullstack developer passionate about clean code.",
    description: "Miki builds scalable web applications using modern technologies. Enjoys contributing to open source projects and mentoring.",
    gradYear: "2025",
    xUrl: "https://x.com/shubgaur",
    personalSite: "https://mikisafronov.dev"
  },
  { 
    name: "Sarah Chen", 
    site: "sarahchen.dev", 
    skill: "Design",
    header: "Sarah is a UX designer focused on accessibility and inclusion.",
    description: "Sarah creates inclusive digital experiences that work for everyone. Passionate about design systems and user research.",
    gradYear: "2024",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    personalSite: "https://sarahchen.dev"
  },
  { 
    name: "Alex Rodriguez", 
    site: "alexr.tech", 
    skill: "Hardware",
    header: "Alex is a hardware engineer building the future of IoT.",
    description: "Alex designs embedded systems and IoT devices, with a focus on energy efficiency and wireless communication protocols.",
    gradYear: "2023",
    linkedinUrl: "https://linkedin.com/in/alexrodriguez",
    personalSite: "https://alexr.tech"
  },
  { 
    name: "Emma Wilson", 
    site: "emmawilson.co", 
    skill: "Product",
    header: "Emma is a product strategist driving growth at scale.",
    description: "Emma helps companies identify and execute on growth opportunities through data analysis and user insights.",
    gradYear: "2022",
    linkedinUrl: "https://linkedin.com/in/emmawilson",
    personalSite: "https://emmawilson.co"
  },
  { 
    name: "David Kim", 
    site: "davidkim.io", 
    skill: "Fullstack",
    header: "David is a software engineer building robust systems.",
    description: "David specializes in backend architecture and database optimization, with experience in microservices and cloud platforms.",
    gradYear: "2024",
    linkedinUrl: "https://linkedin.com/in/davidkim",
    personalSite: "https://davidkim.io"
  },
  { 
    name: "Lisa Zhang", 
    site: "lisazhang.com", 
    skill: "Design",
    header: "Lisa is a visual designer creating stunning interfaces.",
    description: "Lisa combines artistic vision with technical expertise to create beautiful and functional digital products.",
    gradYear: "2025",
    linkedinUrl: "https://linkedin.com/in/lisazhang",
    personalSite: "https://lisazhang.com"
  },
  { 
    name: "Michael Torres", 
    site: "michaelt.dev", 
    skill: "Hardware",
    header: "Michael is an electrical engineer innovating in robotics.",
    description: "Michael develops control systems for autonomous robots, with expertise in sensor fusion and machine learning integration.",
    gradYear: "2023",
    linkedinUrl: "https://linkedin.com/in/michaeltorres",
    personalSite: "https://michaelt.dev"
  },
  { 
    name: "Rachel Green", 
    site: "rachelgreen.xyz", 
    skill: "Product",
    header: "Rachel is a product leader focused on user-centric design.",
    description: "Rachel bridges the gap between user needs and business goals, creating products that users love and companies can scale.",
    gradYear: "2022",
    linkedinUrl: "https://linkedin.com/in/rachelgreen",
    personalSite: "https://rachelgreen.xyz"
  },
  { 
    name: "James Park", 
    site: "jamespark.co", 
    skill: "Fullstack",
    header: "James is a developer passionate about performance optimization.",
    description: "James builds fast, efficient web applications with a focus on user experience and code quality.",
    gradYear: "2024",
    linkedinUrl: "https://linkedin.com/in/jamespark",
    personalSite: "https://jamespark.co"
  },
  { 
    name: "Anna Lee", 
    site: "annalee.design", 
    skill: "Design",
    header: "Anna is a creative director shaping brand experiences.",
    description: "Anna leads design teams in creating cohesive brand experiences across all touchpoints and platforms.",
    gradYear: "2023",
    linkedinUrl: "https://linkedin.com/in/annalee",
    personalSite: "https://annalee.design"
  },
  { 
    name: "Chris Johnson", 
    site: "chrisj.tech", 
    skill: "Hardware",
    header: "Chris is a systems engineer building reliable infrastructure.",
    description: "Chris designs and implements robust hardware systems for mission-critical applications in aerospace and automotive.",
    gradYear: "2025",
    linkedinUrl: "https://linkedin.com/in/chrisjohnson",
    personalSite: "https://chrisj.tech"
  },
  { 
    name: "Maya Patel", 
    site: "mayapatel.io", 
    skill: "Product",
    header: "Maya is a product manager driving innovation in fintech.",
    description: "Maya leads product development for financial technology solutions, with expertise in regulatory compliance and user experience.",
    gradYear: "2024",
    linkedinUrl: "https://linkedin.com/in/mayapatel",
    personalSite: "https://mayapatel.io"
  },
  { 
    name: "Ryan O'Connor", 
    site: "ryanoc.dev", 
    skill: "Fullstack",
    header: "Ryan is a software architect building scalable platforms.",
    description: "Ryan designs and implements large-scale distributed systems, with expertise in cloud architecture and DevOps practices.",
    gradYear: "2023",
    linkedinUrl: "https://linkedin.com/in/ryanoconnor",
    personalSite: "https://ryanoc.dev"
  },
]

export default function Home() {
  const [studentsList, setStudentsList] = useState(students)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStudents, setFilteredStudents] = useState(students)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [primarySkill, setPrimarySkill] = useState<string>('Product')
  const [secondarySkills, setSecondarySkills] = useState<string[]>(['Design', 'Fullstack'])
  const [skillType, setSkillType] = useState<'primary' | 'secondary'>('primary')

  useEffect(() => {
    const filtered = studentsList.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStudents(filtered)
  }, [searchTerm, studentsList])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'u') {
        event.preventDefault()
        const randomStudent = studentsList[Math.floor(Math.random() * studentsList.length)]
        window.open(`https://${randomStudent.site}`, '_blank')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [studentsList])

  const addStudent = (newStudent: Omit<Student, 'site'> & { site: string }) => {
    const student: Student = {
      ...newStudent,
      site: newStudent.personalSite || newStudent.linkedinUrl || newStudent.xUrl || 'no-site.com'
    }
    setStudentsList(prev => [...prev, student])
  }

  const scrollToStudent = (studentName: string) => {
    const elementId = studentName.toLowerCase().replace(/\s+/g, '-')
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  return (
    <BackgroundOverlay 
      gradientFrom="from-gray-900" 
      gradientVia="via-gray-800" 
      gradientTo="to-black"
      className="min-h-screen"
    >
      <Header onJoinClick={() => setShowJoinForm(true)} />
      <div className="min-h-screen flex">        

        {/* Left Column - Search */}
        <div className="w-1/4 fixed left-0 top-0 h-full z-10">
                  <SearchSidebar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          students={filteredStudents}
          onStudentClick={scrollToStudent}
        />
        </div>

        {/* Middle Column - Profile Cards */}
        <div className="w-1/3 max-w-1/3 overflow-y-auto mx-auto">
          <HeroSection />
          
          <div className="p-6 pb-40 space-y-40">
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

        {/* Right Column - Skills Selector */}
        <div className="w-1/4 p-6 fixed right-0 top-0 h-full overflow-y-auto">
          <SkillsSelector
            primarySkill={primarySkill}
            secondarySkills={secondarySkills}
            skillType={skillType}
          />
        </div>

        {/* Join Form Modal */}
        <JoinForm isOpen={showJoinForm} onClose={() => setShowJoinForm(false)} onAddStudent={addStudent} />
      </div>
    </BackgroundOverlay>
  )
}
