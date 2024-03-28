import OpenAI from 'openai'

export * from './types'
export * from './utils'
export * from './api'
export { submitUserMessage, taskManagement } from './ai-actions'
export {
  loading,
  BotCard,
  BotMessage,
  SystemMessage,
  Task,
  TaskManager
} from '@/components/plan'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})
