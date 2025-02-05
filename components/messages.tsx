import { UIState } from '@/ai/types'

export interface ChatList {
  messages: UIState
}

export function Messages({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          {message.display}
          {index < messages.length - 1 && <hr className="my-4" />}
        </div>
      ))}
    </div>
  )
}
