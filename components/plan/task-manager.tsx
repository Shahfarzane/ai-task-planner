'use client'

import { ChangeEvent, useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { format } from 'date-fns'

import { CalendarIcon } from '@radix-ui/react-icons'
import { AI } from '@/ai'

interface TaskManager {
  title: string
  id: string
  description?: string
  date?: string
  label?: 'Default' | 'Completed' | 'Important' | 'Cancelled'
  isDone: boolean
  status?: string
  dueDate?: string
  extra?: string
  onTitleChange?: (newTitle: string) => void
}

export function TaskManager({
  props: {
    title,
    description,
    date,
    label = 'Default',
    isDone,
    status = 'edit',
    onTitleChange
  }
}: {
  props: TaskManager
}) {
  const id = useId()
  const [taskIsDone, setTaskIsDone] = useState(isDone)
  const [taskManagementUI, setTaskManagementUI] =
    useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { taskManagement } = useActions()
  const [titleValue, setTitleValue] = useState(title)
  const [descriptionValue, setDescriptionValue] = useState(description || '')

  const [dateValue, setDateValue] = useState(
    date || format(new Date(), 'yyyy-MM-dd')
  )

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitleValue(newTitle)
    console.log('New title set to:', newTitle)

    if (onTitleChange) {
      onTitleChange(newTitle)
    }

    const message = {
      role: 'system' as 'system',
      content: `[User has changed the title to "${newTitle}".]`,
      id
    }

    setAIState(prevAIState => ({
      ...prevAIState,
      messages: [...prevAIState.messages, message]
    }))
  }
  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    const newDate = e.target.value

    setDateValue(newDate)

    const message = {
      role: 'system' as 'system',
      content: `[User has updated the date of "${title}" to "${newDate}".]`,
      id
    }

    setAIState(prevAIState => ({
      ...prevAIState,
      messages: [...prevAIState.messages, message]
    }))
  }
  function handleDescriptionChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newDescription = e.target.value
    setDescriptionValue(newDescription)
    const message = {
      role: 'system' as 'system',
      content: `[User has changed the description of "${title}" to "${newDescription}".]`,
      id
    }

    setAIState(prevAIState => ({
      ...prevAIState,
      messages: [...prevAIState.messages, message]
    }))
  }

  function onCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.checked
    setTaskIsDone(newValue)

    const message = {
      role: 'system' as 'system',
      content: `[User has changed to ${newValue ? 'complete' : 'incomplete'} ${title}.]`,

      id
    }

    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message]
      })

      return
    }

    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  return (
    <div className="max-w-2xl mx-auto my-4  rounded-lg shadow-md p-6 text-sm border">
      {taskManagementUI ? (
        <div className="mt-4 ">{taskManagementUI}</div>
      ) : status === 'edit' ? (
        <>
          <div className="flex items-center space-x-2 mb-4">
            <input
              className="text-base font-semibold w-full bg-background"
              value={titleValue}
              onChange={handleTitleChange}
            />
          </div>
          <hr className="border-t border-gray-200 my-4" />
          <div className="flex items-center space-x-2 mb-4">
            <textarea
              className="text-gray-500 w-full h-16"
              value={descriptionValue}
              onChange={handleDescriptionChange}
            />
          </div>

          <hr className="border-t border-gray-200 my-4" />
          <div className="flex items-center space-x-2 mb-4">
            <CalendarIcon className="text-gray-500" />
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="date"
                className="text-gray-500"
                value={dateValue}
                onChange={handleDateChange}
              />
            </div>
          </div>

          <hr className="border-t border-gray-200 my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="task-completion"
                type="checkbox"
                checked={taskIsDone}
                onChange={onCheckboxChange}
              />

              <label className="text-gray-500" htmlFor="task-completion">
                Completed?
              </label>
            </div>
          </div>
          <button
            className="mt-6 w-full rounded-lg bg-green-400 px-4 py-2 font-bold text-zinc-900 hover:bg-green-500"
            onClick={async () => {
              const response = await taskManagement(
                titleValue,
                descriptionValue,
                dateValue,
                label,
                isDone
              )
              setTaskManagementUI(response.taskManagementUI)

              setMessages((currentMessages: any) => [
                ...currentMessages,
                response.newMessage
              ])
            }}
          >
            Save
          </button>
        </>
      ) : status === 'completed' ? (
        <p className="">You have updated {title}.</p>
      ) : status === 'cancelled' ? (
        <p className="">You have cancelled the process</p>
      ) : null}
    </div>
  )
}
