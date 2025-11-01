import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars for server API routes')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { studentId, embedding } = body

    if (!studentId) {
      return NextResponse.json({ error: 'studentId is required' }, { status: 400 })
    }

    if (!embedding || !Array.isArray(embedding) || embedding.length !== 384) {
      return NextResponse.json({ error: 'Invalid embedding: must be array of 384 numbers' }, { status: 400 })
    }

    // Update the student record with the embedding
    const { data, error } = await supabase
      .from('students')
      .update({ embedding })
      .eq('id', studentId)
      .select()

    if (error) {
      console.error('Error updating embedding:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('Update embedding error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}