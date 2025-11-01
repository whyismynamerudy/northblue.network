'use client'

// lib/embeddings.client.ts
// This file ONLY runs in the browser, never on the server

let embeddingPipeline: any = null
let isLoading = false
let loadPromise: Promise<any> | null = null

/**
 * Initialize the embedding model (lazy-loaded)
 * Uses Sentence-BERT model optimized for semantic similarity
 */
async function getEmbeddingPipeline() {
  if (embeddingPipeline) {
    return embeddingPipeline
  }

  if (isLoading && loadPromise) {
    return loadPromise
  }

  isLoading = true
  
  // Dynamic import of transformers to ensure it only loads in browser
  loadPromise = import('@xenova/transformers').then(async ({ pipeline, env }) => {
    // Configure to run in browser only (not Node.js)
    env.allowLocalModels = false
    env.allowRemoteModels = true
    env.backends.onnx.wasm.numThreads = 1
    
    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    embeddingPipeline = pipe
    isLoading = false
    return pipe
  }).catch((error) => {
    isLoading = false
    loadPromise = null
    throw error
  })

  return loadPromise
}

/**
 * Generate embedding vector for text
 * @param text - Input text to embed
 * @returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const pipeline = await getEmbeddingPipeline()
  
  // Generate embedding
  const output = await pipeline(text, {
    pooling: 'mean',
    normalize: true,
  })

  // Convert to regular array
  return Array.from(output.data)
}

/**
 * Preload the model in the background
 * Call this on app initialization for better UX
 */
export async function preloadEmbeddingModel() {
  try {
    await getEmbeddingPipeline()
    return true
  } catch (error) {
    console.error('Failed to preload embedding model:', error)
    return false
  }
}

/**
 * Generate embeddings for student profile
 * Combines relevant fields into searchable text
 */
export function studentToSearchText(student: {
  name: string
  skill: string
  secondarySkills?: string[]
  header: string
  description: string
  gradYear: string
}): string {
  const parts = [
    student.name,
    student.skill,
    ...(student.secondarySkills || []),
    student.header,
    student.description,
    `graduates ${student.gradYear}`,
  ]
  
  return parts.filter(Boolean).join('. ')
}