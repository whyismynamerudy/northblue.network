'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface JoinFormProps {
  isOpen: boolean
  onClose: () => void
  onAddStudent: (student: any) => void
}

interface FormData {
  name: string
  header: string
  description: string
  primarySkill: string
  secondarySkills: string[]
  gradYear: string
  personalSite: string
  xUrl: string
  linkedinUrl: string
  profilePhoto: File | null
  profileImageBase64?: string
}

interface FormErrors {
  name?: string
  header?: string
  description?: string
  primarySkill?: string
  secondarySkills?: string
  gradYear?: string
  personalSite?: string
  xUrl?: string
  linkedinUrl?: string
  profilePhoto?: string
}

const skills = ['Product', 'Fullstack', 'Frontend', 'Backend', 'Mobile', 'Design', 'Art', 'Marketing', 'Venture', 'Hardware']

export default function JoinForm({ isOpen, onClose, onAddStudent }: JoinFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    header: '',
    description: '',
    primarySkill: '',
    secondarySkills: [],
    gradYear: '',
    personalSite: '',
    xUrl: '',
    linkedinUrl: '',
    profilePhoto: null,
    profileImageBase64: undefined
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof FormErrors]: '' }))
    }
  }

  const handleSecondarySkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      secondarySkills: prev.secondarySkills.includes(skill)
        ? prev.secondarySkills.filter(s => s !== skill)
        : [...prev.secondarySkills, skill]
    }))
  }


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData(prev => ({ ...prev, profilePhoto: file, profileImageBase64: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Please enter a value'
    if (!formData.header.trim()) newErrors.header = 'Please enter a value'
    if (!formData.primarySkill) newErrors.primarySkill = 'Please select an option'
    if (!formData.gradYear.trim()) newErrors.gradYear = 'Please enter a value'
    if (!formData.profilePhoto || formData.profilePhoto === null) newErrors.profilePhoto = 'Please upload a file'
    
    // Check word count for description (45 words max)
    if (formData.description.trim()) {
      const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length
      if (wordCount > 45) {
        newErrors.description = `Description must be <45 words (currently ${wordCount} words)`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Create new student object for Supabase
        const newStudent = {
          name: formData.name,
          site: formData.personalSite.replace(/^https?:\/\//, '').replace(/^www\./, ''),
          skill: formData.primarySkill,
          secondary_skills: formData.secondarySkills,
          header: formData.header,
          description: formData.description,
          grad_year: formData.gradYear,
          personal_site: formData.personalSite,
          x_url: formData.xUrl,
          linkedin_url: formData.linkedinUrl,
          profile_image: formData.profileImageBase64 || undefined
        }
                
        if (!supabase) {
          console.error('Supabase not configured')
          alert('Database not configured. Please check your environment variables.')
          return
        }
        
        // Insert into Supabase
        const { data, error } = await supabase
          .from('students')
          .insert([newStudent])
          .select()
        
        if (error) {
          console.error('Error adding student:', error)
          alert('Error adding student. Please try again.')
          return
        }
        
        // Add student to the local list for immediate display
        onAddStudent({
          name: formData.name,
          header: formData.header,
          description: formData.description,
          skill: formData.primarySkill,
          secondarySkills: formData.secondarySkills,
          gradYear: formData.gradYear,
          personalSite: formData.personalSite,
          xUrl: formData.xUrl,
          linkedinUrl: formData.linkedinUrl,
          profileImage: formData.profileImageBase64 || undefined
        })
        
        // Close modal and reset form
        onClose()
        setFormData({
          name: '',
          header: '',
          description: '',
          primarySkill: '',
          secondarySkills: [],
          gradYear: '',
          personalSite: '',
          xUrl: '',
          linkedinUrl: '',
          profilePhoto: null,
          profileImageBase64: undefined
        })
        setErrors({})
      } catch (error) {
        console.error('Error:', error)
        alert('Error adding student. Please try again.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        onClick={onClose}
      />
      
      {/* Modal positioned bottom right */}
      <div className="absolute bottom-8 right-4 bg-black p-2 w-[352px] max-h-[80vh] overflow-y-auto rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-center mb-2">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-2"></div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Maya Lekhi"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Header */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Header *
            </label>
            <input
              type="text"
              value={formData.header}
              onChange={(e) => handleInputChange('header', e.target.value)}
              className={`w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base ${
                errors.header ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Maya is a fullstack engineer that works at Microsoft."
            />
            {errors.header && <p className="text-red-400 text-sm mt-1">{errors.header}</p>}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-light text-white">
                Description
              </label>
              <span className={`text-sm ${(() => {
                const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length
                return wordCount > 45 ? 'text-red-400' : 'text-gray-400'
              })()}`}>
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="I'm a developer, designer, hackathon winner, and startup founder."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Primary Skills */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Primary skills (pick 1) *
            </label>
            <select
              value={formData.primarySkill}
              onChange={(e) => handleInputChange('primarySkill', e.target.value)}
                              className={`w-full px-3 py-2 bg-black border rounded-md text-white focus:outline-none focus:ring-2 ${
                  errors.primarySkill ? 'border-red-500' : 'border-gray-800'
                }`}
            >
              <option value="">Primary skills (pick 1)</option>
              {skills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
            {errors.primarySkill && <p className="text-red-400 text-sm mt-1">{errors.primarySkill}</p>}
          </div>

          {/* Secondary Skills */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Secondary skills (pick 0-8)
            </label>
            <div className="grid grid-cols-2 gap-1">
              {skills.map((skill) => (
                <label key={skill} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.secondarySkills.includes(skill)}
                    onChange={() => handleSecondarySkillToggle(skill)}
                    className="w-4 h-4 text-black bg-black border-gray-800 rounded focus:ring-gray-700 focus:ring-2 checked:bg-white checked:text-black"
                  />
                  <span className="text-white text-base">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grad Year */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Grad year *
            </label>
            <input
              type="text"
              value={formData.gradYear}
              onChange={(e) => handleInputChange('gradYear', e.target.value)}
              className={`w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base ${
                errors.gradYear ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="2025"
            />
            {errors.gradYear && <p className="text-red-400 text-sm mt-1">{errors.gradYear}</p>}
          </div>

          {/* Personal Site */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Personal site
            </label>
            <input
              type="url"
              value={formData.personalSite}
              onChange={(e) => handleInputChange('personalSite', e.target.value)}
              className="w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base"
              placeholder="https://www.joshuawolk.com/"
            />
          </div>

          {/* X URL */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              X Url
            </label>
            <input
              type="url"
              value={formData.xUrl}
              onChange={(e) => handleInputChange('xUrl', e.target.value)}
              className="w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base"
              placeholder="https://x.com/joshuawolk"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              LinkedIn Url
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className="w-full px-2 py-1 bg-transparent border border-gray-800 rounded-md text-white placeholder-gray-700 focus:outline-none text-base"
              placeholder="https://www.linkedin.com/in/joshgwolk/"
            />
          </div>


          {/* Profile Photo */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Profile Photo *
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-2 text-base text-gray-700">
                  {formData.profilePhoto ? formData.profilePhoto.name : 'Click to choose a file or drag here'}
                </p>
                <p className="text-base text-gray-800 mt-2">Size limit: 10 MB</p>
              </label>
            </div>
            {errors.profilePhoto && <p className="text-red-400 text-sm mt-1">{errors.profilePhoto}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white hover:text-gray-600 font-medium py-2 px-3 rounded-full transition-colors flex items-center justify-center text-base"
          >
            Submit
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
