// scripts/generate-embeddings.ts
/**
 * One-time script to generate embeddings for all existing students
 * Run with: tsx scripts/generate-embeddings.ts
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

function studentToSearchText(student: any): string {
  const parts = [
    student.name,
    student.skill,
    ...(student.secondary_skills || []),
    student.header,
    student.description,
    `graduates ${student.grad_year}`,
  ]
  return parts.filter(Boolean).join('. ')
}

async function generateEmbeddings() {
  console.log('Loading embedding model...')
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  console.log('Model loaded!\n')

  // Fetch all students
  const { data: students, error } = await supabase
    .from('students')
    .select('*')
    .is('embedding', null)

  if (error) {
    console.error('Error fetching students:', error)
    return
  }

  console.log(`Found ${students?.length || 0} students without embeddings\n`)

  if (!students || students.length === 0) {
    console.log('No students to process!')
    return
  }

  // Process each student
  let processed = 0
  for (const student of students) {
    try {
      // Generate searchable text
      const searchText = studentToSearchText(student)
      
      // Generate embedding
      const output = await embedder(searchText, {
        pooling: 'mean',
        normalize: true,
      })
      
      const embedding = Array.from(output.data)

      // Update student with embedding
      const { error: updateError } = await supabase
        .from('students')
        .update({ embedding })
        .eq('id', student.id)

      if (updateError) {
        console.error(`Error updating ${student.name}:`, updateError)
      } else {
        processed++
        console.log(`✓ ${processed}/${students.length}: ${student.name}`)
      }
    } catch (err) {
      console.error(`Error processing ${student.name}:`, err)
    }
  }

  console.log(`\nCompleted! Processed ${processed}/${students.length} students`)
}

generateEmbeddings().catch(console.error)