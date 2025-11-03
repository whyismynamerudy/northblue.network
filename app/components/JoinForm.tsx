'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateEmbedding, studentToSearchText } from '@/lib/embeddings-worker'

interface JoinFormProps {
  isOpen: boolean
  onClose: () => void
  onAddStudent: (student: any) => void
  mode?: 'create' | 'edit'
  initialData?: Partial<FormData> & { id?: string; profileImageUrl?: string }
}

interface FormData {
  name: string
  header: string
  description: string
  primarySkill: string
  secondarySkills: string[]
  gradYear: string
  email: string
  personalSite: string
  xUrl: string
  linkedinUrl: string
  profilePhoto: File | null
}

interface FormErrors {
  name?: string
  header?: string
  description?: string
  primarySkill?: string
  secondarySkills?: string
  gradYear?: string
  email?: string
  personalSite?: string
  xUrl?: string
  linkedinUrl?: string
  profilePhoto?: string
}

const skills = ['Product', 'AI/ML', 'Fullstack', 'Frontend', 'Backend', 'Mobile', 'Systems', 'UI/UX', 'Marketing', 'Venture', 'Hardware']

export default function JoinForm({ isOpen, onClose, onAddStudent, mode = 'create', initialData }: JoinFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    header: '',
    description: '',
    primarySkill: '',
    secondarySkills: [],
    gradYear: '',
    email: '',
    personalSite: '',
    xUrl: '',
    linkedinUrl: '',
    profilePhoto: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isDragging, setIsDragging] = useState(false)
  const [isGeneratingEmbedding, setIsGeneratingEmbedding] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGeneratingEmbedding) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, isGeneratingEmbedding])

  // Check if content is scrollable and update indicator
  useEffect(() => {
    if (!isOpen) return

    const checkScroll = () => {
      const container = document.querySelector('.modal-scroll-container')
      if (container) {
        const hasScroll = container.scrollHeight > container.clientHeight
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10
        setShowScrollIndicator(hasScroll && !isAtBottom)
      }
    }

    // Check initially and on scroll
    setTimeout(checkScroll, 100) // Small delay to ensure content is rendered
    
    const container = document.querySelector('.modal-scroll-container')
    container?.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    return () => {
      container?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [isOpen, formData])

  // Hydrate initial values for edit mode
  useEffect(() => {
    if (!isOpen) return
    if (!initialData) return
    setFormData(prev => ({
      ...prev,
      name: initialData.name ?? prev.name,
      header: initialData.header ?? prev.header,
      description: initialData.description ?? prev.description,
      primarySkill: initialData.primarySkill ?? prev.primarySkill,
      secondarySkills: initialData.secondarySkills ?? prev.secondarySkills,
      gradYear: initialData.gradYear ?? prev.gradYear,
      email: initialData.email ?? prev.email,
      personalSite: initialData.personalSite ?? prev.personalSite,
      xUrl: initialData.xUrl ?? prev.xUrl,
      linkedinUrl: initialData.linkedinUrl ?? prev.linkedinUrl,
      profilePhoto: null,
    }))
  }, [isOpen, initialData])

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
      setFormData(prev => ({ ...prev, profilePhoto: file }))
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    const file = event.dataTransfer?.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please upload an image file' }))
        return
      }
      setFormData(prev => ({ ...prev, profilePhoto: file }))
      if (errors.profilePhoto) {
        setErrors(prev => ({ ...prev, profilePhoto: '' }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Please enter a value'
    if (!formData.header.trim()) newErrors.header = 'Please enter a value'
    if (!formData.primarySkill) newErrors.primarySkill = 'Please select an option'
    if (!formData.gradYear.trim()) newErrors.gradYear = 'Please enter a value'
    if (mode === 'create') {
      if (!formData.profilePhoto || formData.profilePhoto === null) newErrors.profilePhoto = 'Please upload a file'
    }
    
    // Optional email format validation
    if (formData.email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email'
      }
    }
    
    // Check character count for description (350 characters max)
    if (formData.description.trim()) {
      const charCount = formData.description.trim().length
      if (charCount > 350) {
        newErrors.description = `Description must be ≤350 characters (currently ${charCount})`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Step 1: Upload profile photo
        let profileImageUrl = undefined
        if (formData.profilePhoto) {
          const uploadForm = new FormData()
          uploadForm.append('file', formData.profilePhoto)
          const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: uploadForm
          })
          if (!uploadRes.ok) {
            console.error('Error uploading image:', await uploadRes.text())
          } else {
            const json = await uploadRes.json()
            profileImageUrl = json.publicUrl
          }
        }
        
        // EDIT MODE: update existing record and return early
        if (mode === 'edit') {
          const studentId = initialData?.id
          if (!studentId) {
            setErrors(prev => ({ ...prev, name: 'Missing student id for edit.' }))
            return
          }

          const sessionRes = await supabase?.auth.getSession()
          const accessToken = sessionRes?.data.session?.access_token
          if (!accessToken) {
            setErrors(prev => ({ ...prev, name: 'You must be signed in to edit.' }))
            return
          }

          const updatePayload: any = {
            name: formData.name,
            skill: formData.primarySkill,
            secondary_skills: formData.secondarySkills,
            header: formData.header,
            description: formData.description,
            grad_year: formData.gradYear,
            personal_site: formData.personalSite,
            x_url: formData.xUrl,
            linkedin_url: formData.linkedinUrl
          }
          if (profileImageUrl) updatePayload.profile_image_url = profileImageUrl

          const updateRes = await fetch(`/api/students/${studentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
            body: JSON.stringify(updatePayload)
          })

          if (!updateRes.ok) {
            let errorText = 'Error updating student. Please try again.'
            try {
              const json = await updateRes.json()
              errorText = json?.error || errorText
            } catch (_) {}
            setErrors(prev => ({ ...prev, name: errorText }))
            return
          }

          // Regenerate embedding after update
          setIsGeneratingEmbedding(true)
          try {
            const searchText = studentToSearchText({
              name: formData.name,
              skill: formData.primarySkill,
              secondarySkills: formData.secondarySkills,
              header: formData.header,
              description: formData.description,
              gradYear: formData.gradYear
            })

            const embedding = await generateEmbedding(searchText)
            const embeddingRes = await fetch('/api/students/update-embedding', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentId, embedding })
            })
            if (!embeddingRes.ok) {
              console.error('Failed to store embedding (student still updated):', await embeddingRes.text())
            } else {
              console.log('✓ Embedding regenerated successfully')
            }
          } catch (embeddingError) {
            console.error('Failed to generate embedding (student still updated):', embeddingError)
          } finally {
            setIsGeneratingEmbedding(false)
          }

          onClose()
          setErrors({})
          return
        }
        
        // Step 2: Create new student object for Supabase
        const newStudent = {
          name: formData.name,
          site: formData.personalSite.replace(/^https?:\/\//, '').replace(/^www\./, ''),
          skill: formData.primarySkill,
          secondary_skills: formData.secondarySkills,
          header: formData.header,
          description: formData.description,
          grad_year: formData.gradYear,
          email: formData.email,
          personal_site: formData.personalSite,
          x_url: formData.xUrl,
          linkedin_url: formData.linkedinUrl,
          profile_image_url: profileImageUrl
        }
                
        // Step 3: Insert student into database
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent)
        })
        
        if (!res.ok) {
          let errorText = 'Error adding student. Please try again.'
          try {
            const json = await res.json()
            errorText = json?.error || errorText
          } catch (e) {
            try {
              errorText = await res.text()
            } catch (_) {}
          }

          if (res.status === 409) {
            const newErrors: FormErrors = { ...errors }
            if (/LinkedIn/i.test(errorText)) {
              newErrors.linkedinUrl = errorText
            } else if (/personal site/i.test(errorText)) {
              newErrors.personalSite = errorText
            } else {
              newErrors.name = errorText
            }
            setErrors(newErrors)
            return
          }

          setErrors(prev => ({ ...prev, name: errorText }))
          return
        }

        const insertedStudent = await res.json()
        
        // Step 4: Generate embedding for the new student
        setIsGeneratingEmbedding(true)
        try {
          // Create searchable text from student data
          const searchText = studentToSearchText({
            name: formData.name,
            skill: formData.primarySkill,
            secondarySkills: formData.secondarySkills,
            header: formData.header,
            description: formData.description,
            gradYear: formData.gradYear
          })

          // Generate the embedding vector
          const embedding = await generateEmbedding(searchText)

          // Step 5: Update the student record with the embedding
          const embeddingRes = await fetch('/api/students/update-embedding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentId: insertedStudent.data?.id,
              embedding
            })
          })

          if (!embeddingRes.ok) {
            console.error('Failed to store embedding (student still added):', await embeddingRes.text())
            // Don't fail the whole operation - embedding can be generated later
          } else {
            console.log('✓ Embedding generated successfully')
          }
        } catch (embeddingError) {
          console.error('Failed to generate embedding (student still added):', embeddingError)
          // Don't fail the whole operation - embedding can be generated later
        } finally {
          setIsGeneratingEmbedding(false)
        }
        
        // Step 6: Add student to the local list for immediate display
        onAddStudent({
          name: formData.name,
          header: formData.header,
          description: formData.description,
          skill: formData.primarySkill,
          secondarySkills: formData.secondarySkills,
          gradYear: formData.gradYear,
          email: formData.email,
          personalSite: formData.personalSite,
          xUrl: formData.xUrl,
          linkedinUrl: formData.linkedinUrl,
          profileImage: profileImageUrl
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
          email: '',
          personalSite: '',
          xUrl: '',
          linkedinUrl: '',
          profilePhoto: null,
        })
        setErrors({})
      } catch (error) {
        console.error('Error:', error)
        setErrors(prev => ({ ...prev, name: 'Error adding student. Please try again.' }))
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] pb-8">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${isGeneratingEmbedding ? 'cursor-not-allowed' : 'cursor-auto'}`}
        onClick={() => !isGeneratingEmbedding && onClose()}
      />
      
      {/* Modal centered */}
      <style>{`
        .modal-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="relative">
        <div 
          className="modal-scroll-container relative w-full max-w-3xl mx-4 max-h-[85vh] overflow-y-auto"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
        <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-editorial text-white">Join North Blue</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              disabled={isGeneratingEmbedding}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Grad Year - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="Maya Lekhi"
              />
              {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
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
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                  errors.gradYear ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="2025"
              />
              {errors.gradYear && <p className="text-red-400 text-sm mt-2">{errors.gradYear}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
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
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                errors.header ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="Maya is a fullstack engineer that works at Microsoft."
            />
            {errors.header && <p className="text-red-400 text-sm mt-2">{errors.header}</p>}
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-lg font-light text-white">
                Description
              </label>
              <span className={`text-sm ${(() => {
                const charCount = formData.description.trim().length
                return charCount > 350 ? 'text-red-400' : 'text-gray-400'
              })()}`}>
                {formData.description.trim().length}/350 characters
              </span>
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-700'
              }`}
              placeholder="I'm a developer, designer, hackathon winner, and startup founder."
            />
            {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
          </div>

          {/* Primary Skills */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Primary skills (pick 1) *
            </label>
            <select
              value={formData.primarySkill}
              onChange={(e) => handleInputChange('primarySkill', e.target.value)}
              className={`w-full px-4 py-3 bg-black border rounded-lg text-white focus:outline-none focus:border-gray-600 transition-colors cursor-pointer ${
                errors.primarySkill ? 'border-red-500' : 'border-gray-700'
              }`}
            >
              <option value="" className="bg-black">Select primary skill</option>
              {skills.map(skill => (
                <option key={skill} value={skill} className="bg-black">{skill}</option>
              ))}
            </select>
            {errors.primarySkill && <p className="text-red-400 text-sm mt-2">{errors.primarySkill}</p>}
          </div>

          {/* Secondary Skills */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Secondary skills (pick 0-8)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <label key={skill} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.secondarySkills.includes(skill)}
                    onChange={() => handleSecondarySkillToggle(skill)}
                    className="w-4 h-4 text-black bg-black border-gray-700 rounded focus:ring-gray-600 focus:ring-2 checked:bg-white checked:border-white cursor-pointer"
                  />
                  <span className="text-white text-base group-hover:text-gray-300 transition-colors">{skill}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Site */}
            <div>
              <label className="block text-lg font-light text-white mb-3">
                Personal site
              </label>
              <input
                type="url"
                value={formData.personalSite}
                onChange={(e) => handleInputChange('personalSite', e.target.value)}
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                  errors.personalSite ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="joshuawolk.com"
              />
              {errors.personalSite && <p className="text-red-400 text-sm mt-2">{errors.personalSite}</p>}
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
                className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base"
                placeholder="x.com/joshuawolk"
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
                className={`w-full px-4 py-3 bg-transparent border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors text-base ${
                  errors.linkedinUrl ? 'border-red-500' : 'border-gray-700'
                }`}
                placeholder="linkedin.com/in/joshgwolk"
              />
              {errors.linkedinUrl && <p className="text-red-400 text-sm mt-2">{errors.linkedinUrl}</p>}
            </div>
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-lg font-light text-white mb-3">
              Profile Photo *
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging ? 'border-gray-500 bg-white/5' : 'border-gray-700 hover:border-gray-600'
              }`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <svg className="mx-auto h-16 w-16 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-4 text-base text-gray-400">
                  {formData.profilePhoto ? (
                    <span className="text-white">{formData.profilePhoto.name}</span>
                  ) : (
                    <>Click to choose a file or drag here</>
                  )}
                </p>
                <p className="text-sm text-gray-500 mt-2">Size limit: 10 MB</p>
              </label>
            </div>
            {errors.profilePhoto && <p className="text-red-400 text-sm mt-2">{errors.profilePhoto}</p>}
          </div>

          {/* Submit Button with embedding status */}
          <div className="pt-4 border-t border-gray-800">
            {Object.values(errors).some(Boolean) && (
              <p className="text-red-400 text-sm mb-4 text-center">Please correct the errors above</p>
            )}
            
            {isGeneratingEmbedding && (
              <p className="text-blue-400 text-sm mb-4 text-center flex items-center justify-center">
                <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></span>
                Uploading data...
              </p>
            )}
            
            <button
              type="submit"
              disabled={isGeneratingEmbedding}
              className="w-full bg-white text-black hover:bg-gray-200 font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Submit
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
        </div>
        </div>
        
        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex justify-center pb-4">
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent w-full h-32 absolute bottom-0"></div>
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <svg className="w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span className="text-white/60 text-xs mt-1">Scroll for more</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}