'use client'

// lib/embeddings-worker.ts
// This uses a Web Worker to run embeddings in a separate thread

let worker: Worker | null = null

function getWorker(): Worker {
  if (worker === null) {
    worker = new Worker(new URL('../app/embedding-worker.js', import.meta.url), {
      type: 'module'
    })
  }
  return worker
}

/**
 * Generate embedding vector for text using Web Worker
 * @param text - Input text to embed
 * @returns 384-dimensional vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const workerInstance = getWorker()
    
    const handleMessage = (event: MessageEvent) => {
      const { status, embedding, error } = event.data
      
      if (status === 'complete') {
        workerInstance.removeEventListener('message', handleMessage)
        resolve(embedding)
      } else if (status === 'error') {
        workerInstance.removeEventListener('message', handleMessage)
        reject(new Error(error))
      } else if (status === 'loading') {
        // Log loading progress
        console.log('Loading embedding model:', event.data)
      }
    }
    
    workerInstance.addEventListener('message', handleMessage)
    workerInstance.postMessage({ type: 'generate', text })
  })
}

/**
 * Preload the model in the background
 */
export async function preloadEmbeddingModel(): Promise<boolean> {
  return new Promise((resolve) => {
    const workerInstance = getWorker()
    
    const handleMessage = (event: MessageEvent) => {
      const { status } = event.data
      
      if (status === 'ready') {
        workerInstance.removeEventListener('message', handleMessage)
        resolve(true)
      } else if (status === 'error') {
        workerInstance.removeEventListener('message', handleMessage)
        resolve(false)
      } else if (status === 'loading') {
        console.log('Preloading model:', event.data)
      }
    }
    
    workerInstance.addEventListener('message', handleMessage)
    workerInstance.postMessage({ type: 'preload' })
  })
}

/**
 * Generate embeddings for student profile
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