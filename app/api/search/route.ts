// app/api/search/route.ts
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
    const { embedding, limit = 10 } = body

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json({ error: 'Invalid embedding' }, { status: 400 })
    }

    // Call the Supabase function for semantic search
    const { data, error } = await supabase.rpc('search_students_semantic', {
      query_embedding: embedding,
      match_count: limit
    })

    if (error) {
      console.error('Supabase search error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error('Search error:', err)
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
  }
}