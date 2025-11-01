// app/embedding-worker.js
import { pipeline, env } from '@xenova/transformers'

// Skip local model check
env.allowLocalModels = false
env.allowRemoteModels = true

// Use the Singleton pattern to enable lazy construction of the pipeline
class EmbeddingPipeline {
  static task = 'feature-extraction'
  static model = 'Xenova/all-MiniLM-L6-v2'
  static instance = null

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback })
    }
    return this.instance
  }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
  const { type, text } = event.data

  try {
    if (type === 'generate') {
      // Get the pipeline instance
      const extractor = await EmbeddingPipeline.getInstance((data) => {
        // Send loading progress back to main thread
        self.postMessage({
          status: 'loading',
          ...data
        })
      })

      // Generate embedding
      const output = await extractor(text, {
        pooling: 'mean',
        normalize: true,
      })

      // Send the result back to the main thread
      self.postMessage({
        status: 'complete',
        embedding: Array.from(output.data)
      })
    } else if (type === 'preload') {
      // Just load the model
      await EmbeddingPipeline.getInstance((data) => {
        self.postMessage({
          status: 'loading',
          ...data
        })
      })
      
      self.postMessage({
        status: 'ready'
      })
    }
  } catch (error) {
    self.postMessage({
      status: 'error',
      error: error.message
    })
  }
})