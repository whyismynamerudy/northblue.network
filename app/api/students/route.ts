import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars for server API routes')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('name, site, skill, secondary_skills, header, description, grad_year, linkedin_url, x_url, personal_site, profile_image_url')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const newStudent = {
      name: body.name,
      site: typeof body.personal_site === 'string' ? body.personal_site.replace(/^https?:\/\//, '').replace(/^www\./, '') : body.site,
      skill: body.skill,
      secondary_skills: body.secondary_skills || [],
      header: body.header || '',
      description: body.description || '',
      grad_year: body.grad_year || '',
      personal_site: body.personal_site || null,
      x_url: body.x_url || null,
      linkedin_url: body.linkedin_url || null,
      profile_image_url: body.profile_image_url || null
    }

    if (!newStudent.name || !newStudent.skill || !newStudent.grad_year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('students')
      .insert([newStudent])
      .select()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data?.[0] || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}


