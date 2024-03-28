'use client'

import { cn } from '@/lib/utils'
import { Messages } from '@/components/messages'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { usePathname, useRouter } from 'next/navigation'
import { Message } from '@/ai/types'
import { InputForm } from './input-form'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session: any
}

export function Chat({ id, className, session }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const [_, setNewChatId] = useLocalStorage('id', id)

  useEffect(() => {
    if (session?.userId) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.userId, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  })

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? <Messages messages={messages} /> : ''}
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full  duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto my-6 sm:max-w-2xl sm:px-4">
          <InputForm input={input} setInput={setInput} />
        </div>
      </div>
    </>
  )
}
