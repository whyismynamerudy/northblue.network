'use client'

import { useState } from 'react'

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
  clubs: string[]
  phoneNumber: string
  profilePhoto: File | null
}

const skills = ['Product', 'Fullstack', 'Frontend', 'Backend', 'Mobile', 'Design', 'Art', 'Marketing', 'Venture', 'Hardware']
const clubs = ['SEP', 'LavaLab', 'TroyLabs', 'Spark', 'Sundays']

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
    clubs: [],
    phoneNumber: '',
    profilePhoto: null
  })

  const [errors, setErrors] = useState<Partial<FormData>>({})

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
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

  const handleClubToggle = (club: string) => {
    setFormData(prev => ({
      ...prev,
      clubs: prev.clubs.includes(club)
        ? prev.clubs.filter(c => c !== club)
        : [...prev.clubs, club]
    }))
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) newErrors.name = 'Please enter a value'
    if (!formData.header.trim()) newErrors.header = 'Please enter a value'
    if (!formData.description.trim()) newErrors.description = 'Please enter a value'
    if (!formData.primarySkill) newErrors.primarySkill = 'Please select an option'
    if (!formData.gradYear.trim()) newErrors.gradYear = 'Please enter a value'
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Please enter a value'
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Please upload a file'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Create new student object
      const newStudent = {
        name: formData.name,
        header: formData.header,
        description: formData.description,
        skill: formData.primarySkill,
        gradYear: formData.gradYear,
        personalSite: formData.personalSite,
        xUrl: formData.xUrl,
        linkedinUrl: formData.linkedinUrl,
        profileImage: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : undefined
      }
      
      // Add student to the list
      onAddStudent(newStudent)
      
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
        clubs: [],
        phoneNumber: '',
        profilePhoto: null
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="w-full max-w-2xl mx-4 rounded-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Join USC.so</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Joshua Wolk"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Header */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Header *
            </label>
            <input
              type="text"
              value={formData.header}
              onChange={(e) => handleInputChange('header', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.header ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="Maya is a fullstack engineer that works at Microsoft."
            />
            {errors.header && <p className="text-red-400 text-sm mt-1">{errors.header}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="I'm a designer, developer, debate world champion, and award-winning writer."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Primary Skills */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Primary skills (pick 1) *
            </label>
            <select
              value={formData.primarySkill}
              onChange={(e) => handleInputChange('primarySkill', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.primarySkill ? 'border-red-500' : 'border-gray-600'
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
            <label className="block text-sm font-medium text-white mb-2">
              Secondary skills (pick 0-8)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill) => (
                <label key={skill} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.secondarySkills.includes(skill)}
                    onChange={() => handleSecondarySkillToggle(skill)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grad Year */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Grad year *
            </label>
            <input
              type="text"
              value={formData.gradYear}
              onChange={(e) => handleInputChange('gradYear', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.gradYear ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="2025"
            />
            {errors.gradYear && <p className="text-red-400 text-sm mt-1">{errors.gradYear}</p>}
          </div>

          {/* Personal Site */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Personal site
            </label>
            <input
              type="url"
              value={formData.personalSite}
              onChange={(e) => handleInputChange('personalSite', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.joshuawolk.com/"
            />
          </div>

          {/* X URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              X Url
            </label>
            <input
              type="url"
              value={formData.xUrl}
              onChange={(e) => handleInputChange('xUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://x.com/joshuawolk"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              LinkedIn Url
            </label>
            <input
              type="url"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://www.linkedin.com/in/joshgwolk/"
            />
          </div>

          {/* Clubs */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Clubs
            </label>
            <div className="space-y-3">
              {clubs.map((club) => (
                <label key={club} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.clubs.includes(club)}
                    onChange={() => handleClubToggle(club)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">{club}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Phone number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-600'
              }`}
              placeholder="3144018708"
            />
            <p className="text-xs text-gray-400 mt-1">Not posted, we just use this for contact.</p>
            {errors.phoneNumber && <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
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
                <p className="mt-2 text-sm text-gray-300">
                  {formData.profilePhoto ? formData.profilePhoto.name : 'Click to choose a file or drag here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Size limit: 10 MB</p>
              </label>
            </div>
            {errors.profilePhoto && <p className="text-red-400 text-sm mt-1">{errors.profilePhoto}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center"
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
