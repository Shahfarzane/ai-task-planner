'use client'

import { useActions, useUIState } from 'ai/rsc'
import { Task } from './task'
import { AI } from '@/ai'

interface Task {
  id?: string
  title: string
  description?: string
  date?: string
  label?: string
  isDone?: boolean
  status?: string
}

export function Tasks({ props: tasks }: { props: Task[] }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <div className="flex w-full flex-col gap-2">
      {tasks.map((task, index) => (
        <div
          key={index}
          className="cursor-pointer"
          onClick={async () => {
            const response = await submitUserMessage(`View ${task.title}`)
            setMessages(currentMessages => [...currentMessages, response])
          }}
        >
          <Task props={task} />
        </div>
      ))}
    </div>
  )
}
