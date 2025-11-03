'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import JoinForm from '@/app/components/JoinForm'

export default function EditProfilePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [sessionReady, setSessionReady] = useState<boolean>(false)
  const [initialData, setInitialData] = useState<any>(null)

  // On mount, check for existing session and handle auth state changes
  useEffect(() => {
    let isMounted = true
    const init = async () => {
      const sessionRes = await supabase?.auth.getSession()
      const sess = sessionRes?.data.session || null
      if (isMounted) {
        if (sess?.user?.email) {
          await loadStudentByEmail(sess.user.email)
          setSessionReady(true)
        }
      }
    }
    init()

    const { data: listener } = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        await loadStudentByEmail(session.user.email)
        setSessionReady(true)
      }
    }) || { data: { subscription: { unsubscribe: () => {} } } } as any

    return () => {
      isMounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  const loadStudentByEmail = async (e: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/students?email=${encodeURIComponent(e)}`, { cache: 'no-store' })
      if (!res.ok) {
        setStatus('Failed to load profile')
        return
      }
      const json = await res.json()
      const s = json?.data
      if (!s) {
        setStatus('No profile found for this email. Use Join to create one.')
        return
      }
      setInitialData({
        id: s.id,
        name: s.name || '',
        header: s.header || '',
        description: s.description || '',
        primarySkill: s.skill || '',
        secondarySkills: s.secondary_skills || [],
        gradYear: s.grad_year || '',
        email: s.email || '',
        personalSite: s.personal_site || '',
        xUrl: s.x_url || '',
        linkedinUrl: s.linkedin_url || '',
        profileImageUrl: s.profile_image_url || ''
      })
      setStatus('')
    } catch (err) {
      setStatus('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('Enter your email')
      return
    }
    try {
      setLoading(true)
      setStatus('Sending email...')
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/edit-profile` : undefined
      const { error } = await supabase!.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo } })
      if (error) {
        setStatus(error.message)
        return
      }
      setStatus('Check your email for the sign-in link.')
    } catch (err: any) {
      setStatus(err?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  if (sessionReady && initialData) {
    return (
      <div className="min-h-screen bg-black p-6">
        <JoinForm 
          isOpen={true} 
          onClose={() => { window.location.href = '/' }} 
          onAddStudent={() => {}} 
          mode="edit"
          initialData={initialData}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] pb-8">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => { window.location.href = '/' }}
      />
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-6 relative">
          <button
            onClick={() => { window.location.href = '/' }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-white text-2xl mb-4">Edit your profile</h1>
          <p className="text-gray-400 text-sm mb-6">Enter the email linked to your profile to receive a sign-in link.</p>
          <form onSubmit={sendMagicLink} className="space-y-4">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-gray-200 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
          {status && <p className="text-gray-300 text-sm mt-4">{status}</p>}
        </div>
      </div>
    </div>
  )
}


