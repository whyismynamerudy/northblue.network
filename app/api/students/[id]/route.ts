import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars for server API routes')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pathId = params.id
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userRes, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || !userRes?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = userRes.user.email.toLowerCase()

    // Use the service role client for DB operations after verifying ownership
    // This bypasses RLS while still enforcing auth via our checks

    // Resolve target record by email to avoid client-side id mismatch
    const { data: studentsByEmail, error: findErr } = await supabase
      .from('students')
      .select('id, email')
      .ilike('email', userEmail)
      .order('created_at', { ascending: false })
      .limit(1)

    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 400 })
    const student = Array.isArray(studentsByEmail) ? studentsByEmail[0] : null
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const studentEmail = (student.email || '').toLowerCase()
    const isUnclaimed = studentEmail.length === 0
    if (!isUnclaimed && studentEmail !== userEmail) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()

    const update: any = {}
    // If record is unclaimed, bind it to this user's email on first update
    if (isUnclaimed) update.email = userEmail
    if (typeof body.name === 'string') update.name = body.name
    if (typeof body.header === 'string') update.header = body.header
    if (typeof body.description === 'string') update.description = body.description
    if (typeof body.skill === 'string') update.skill = body.skill
    if (Array.isArray(body.secondary_skills)) update.secondary_skills = body.secondary_skills
    if (typeof body.grad_year === 'string') update.grad_year = body.grad_year
    if (typeof body.personal_site === 'string' || body.personal_site === null) update.personal_site = body.personal_site
    if (typeof body.x_url === 'string' || body.x_url === null) update.x_url = body.x_url
    if (typeof body.linkedin_url === 'string' || body.linkedin_url === null) update.linkedin_url = body.linkedin_url
    if (typeof body.profile_image_url === 'string' || body.profile_image_url === null) update.profile_image_url = body.profile_image_url

    // Maintain the derived `site` from personal_site if provided
    if ('personal_site' in update) {
      const ps = update.personal_site || ''
      update.site = typeof ps === 'string' ? ps.replace(/^https?:\/\//, '').replace(/^www\./, '') : null
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('students')
      .update(update)
      .eq('id', student.id)
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data?.[0] || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}


