'use client'

import { useState, useEffect, useRef } from 'react'

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
  similarity?: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onStudentClick: (studentName: string) => void
}

export default function SearchModal({ isOpen, onClose, onStudentClick }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Student[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query)
    }, 500) // 500ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    setIsModelLoading(true)

    try {
      // Dynamic import - only loads in browser, not during SSR
      const { generateEmbedding } = await import('@/lib/embeddings-worker')
      
      // Generate embedding for the query
      const embedding = await generateEmbedding(searchQuery)
      setIsModelLoading(false)

      // Search using the embedding
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedding, limit: 10 })
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      
      // Transform results
      const transformedResults = (data.data || []).map((student: any) => ({
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
        profileImage: student.profile_image_url || '',
        similarity: student.similarity
      }))

      setResults(transformedResults)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search. Please try again.')
    } finally {
      setIsSearching(false)
      setIsModelLoading(false)
    }
  }

  const handleResultClick = (studentName: string) => {
    onStudentClick(studentName)
    onClose()
    setQuery('')
    setResults([])
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4">
        <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <svg 
                className="w-5 h-5 text-gray-400 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe who you're looking for... (e.g., 'AI engineer who graduated in 2025')"
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
              />
              {(isSearching || isModelLoading) && (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-white rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Status Messages */}
          {isModelLoading && (
            <div className="p-4 text-center text-gray-400 text-sm">
              Loading AI model... (first time only)
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="max-h-[60vh] overflow-y-auto">
              {results.map((student, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(student.name)}
                  className="w-full p-4 hover:bg-white/5 transition-colors text-left border-b border-gray-800 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Image */}
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-medium truncate">{student.name}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {student.gradYear}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-1 mb-1">
                        {student.header}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-white/10 text-white text-xs rounded-full">
                          {student.skill}
                        </span>
                        {student.secondarySkills?.slice(0, 2).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {student.secondarySkills && student.secondarySkills.length > 2 && (
                          <span className="px-2 py-0.5 text-gray-500 text-xs">
                            +{student.secondarySkills.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Similarity Score (optional) */}
                    {student.similarity !== undefined && (
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        {Math.round(student.similarity * 100)}% match
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          {query && !isSearching && !isModelLoading && results.length === 0 && !error && (
            <div className="p-8 text-center text-gray-500">
              No students found matching your description
            </div>
          )}

          {/* Help Text */}
          {!query && (
            <div className="p-6 text-center">
              <p className="text-gray-500 text-sm mb-3">
                Try searching for:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'fullstack engineer',
                  'AI researcher grad 2025',
                  'product designer with marketing skills',
                  'venture and entrepreneurship'
                ].map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-400 text-xs rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-0.5 bg-gray-800 rounded">↑</kbd>
                <kbd className="px-2 py-0.5 bg-gray-800 rounded">↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center space-x-1">
                <kbd className="px-2 py-0.5 bg-gray-800 rounded">esc</kbd>
                <span>close</span>
              </span>
            </div>
            <span>AI-powered semantic search</span>
          </div>
        </div>
      </div>
    </div>
  )
}