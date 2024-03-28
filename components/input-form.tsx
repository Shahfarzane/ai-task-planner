'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from '@/components/plan/message'
import { type AI } from '@/ai/api'
import { Button } from '@/components/ui/button'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'

export function InputForm({
  input,
  setInput
}: {
  input: string
  setInput: (value: string) => void
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex items-center max-w-2xl   ">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="rounded-md flex-1 px-2 py-2 sm:text-sm text-base bg-zinc-200/50 border border-zinc-200/80 resize-none scroll-m-2 h-[38px] transition-colors focus:border-zinc-400 focus:ring-0 focus:outline-none pb-12 dark:bg-zinc-700 dark:border-zinc-500 "
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-2 bottom-2 inline-flex gap-1 @sm:gap-2 items-center justify-end">
          <Button
            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-md shadow-md text-sm hover:text-zinc-300  border-zinc-700 disabled:bg-white disabled:border-zinc-200 disabled:text-zinc-400 disabled:shadow-none disabled:hover:text-zinc-400"
            type="submit"
            disabled={input === ''}
          >
            Send
          </Button>
        </div>
      </div>
    </form>
  )
}
