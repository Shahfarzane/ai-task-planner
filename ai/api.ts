import { saveToDb } from '@/app/actions'
import { createAI, getAIState } from 'ai/rsc'
import { Chat } from '@/lib/types'
import { currentUser } from '@clerk/nextjs'
import { AIState, UIState } from './types'
import {
  submitUserMessage,
  taskManagement,
  getUIStateFromAIState
} from './ai-actions'
import { nanoid } from '@/lib/utils'

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    taskManagement
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'
    const user = await currentUser()

    if (user?.id) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'
    const user = await currentUser()

    if (user && user.id) {
      const { chatId, messages } = state

      const createdAt = new Date()

      const userId = user.id
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }
      await saveToDb(chat)
    } else {
      return
    }
  }
})
