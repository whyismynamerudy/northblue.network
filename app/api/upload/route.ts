import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars for server API routes')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as unknown as File | null

    if (!file) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    const originalName = (file as any).name || 'upload'
    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'png'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file as any)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: publicData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    return NextResponse.json({ publicUrl: publicData.publicUrl, fileName })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}


