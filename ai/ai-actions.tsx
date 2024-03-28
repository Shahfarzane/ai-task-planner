import 'server-only'

import { sleep, runAsyncFnWithoutBlocking } from '@/ai/utils'
import * as chrono from 'chrono-node'
import {
  createStreamableUI,
  getMutableAIState,
  render,
  createStreamableValue
} from 'ai/rsc'

import { nanoid } from '@/lib/utils'
import { Chat } from '@/lib/types'
import { z } from 'zod'
import {
  loading,
  BotCard,
  BotMessage,
  SystemMessage,
  Task,
  TaskManager
} from '@/components/plan'
import { AI, openai } from '@/ai/index'
import { format } from 'date-fns/format'
import { TasksSkeleton } from '@/components/plan/tasks-skeleton'
import { Tasks } from '@/components/plan/task-items'
import { TaskSkeleton } from '@/components/plan/task-skeleton'
import { SpinnerMessage, UserMessage } from '@/components/plan/message'

export async function taskManagement(
  id: string,
  title: string,
  description: string,
  date: string,
  label: string,
  isDone: boolean,
  status: string
) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const taskProcess = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {loading}
      <p className="mb-2">Processing {title}....</p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    taskProcess.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {loading}
        <p className="mb-2">Update in process.</p>
      </div>
    )

    await sleep(1000)

    taskProcess.done(
      <div>
        <p className="mb-2">{title} Processed. </p>
      </div>
    )

    systemMessage.done(<SystemMessage>{title} has been updated</SystemMessage>)

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showTaskManager',
          content: JSON.stringify({
            title,
            description,
            date,
            status: 'completed',
            isDone: false
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has made an update to the task "${title}" with the following details: Description: "${description}", Date: "${date}", Label: "${label} and ${isDone}".]`
        }
      ]
    })
  })

  return {
    taskManagementUI: taskProcess.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

export async function submitUserMessage(content: string) {
  'use server'

  const updateTaskPattern = /update task (\d+) to (.+)/
  const match = content.match(updateTaskPattern)
  const parsedDates = chrono.parseDate(content)
  const aiState = getMutableAIState<typeof AI>()

  let dateResponse = ''
  if (parsedDates) {
    const formattedDate = format(parsedDates, 'MMMM dd, yyyy')
    dateResponse = ` (interpreted date: ${formattedDate})`
  }

  if (match) {
    const [, taskId, newTitle] = match

    const updatedMessages = aiState.get().messages.map(message => {
      if (
        message.id === taskId &&
        message.role === 'function' &&
        message.name === 'showTask'
      ) {
        const taskDetails = JSON.parse(message.content)
        return {
          ...message,
          content: JSON.stringify({ ...taskDetails, title: newTitle })
        }
      }
      return message
    })

    aiState.update({ ...aiState.get(), messages: updatedMessages })

    const aiResponse = `Task ${taskId} updated to "${newTitle}".`
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: aiResponse
        }
      ]
    })
  } else {
    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'user',
          content: content + dateResponse
        }
      ]
    })
  }

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-4-0125-preview',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: `\
You are an intelligent task management assistant, designed to help users manage their tasks with enhanced understanding and interaction capabilities. You can suggest optimal times for tasks based on the user's schedule and preferences, understand complex commands, dynamically manage tasks, and offer personalized task recommendations.
You support interactive UI elements for a more intuitive task management experience, integrate with external tools for seamless scheduling, and provide advanced reporting and insights for productivity improvement. Users can provide feedback directly to you for continuous improvement.

Messages inside [] denote UI elements or user events. For example:
- "[Add Going to dinner, tonight at 18:30 PM]" means that you add the task to the list , and then check if the time interacts with the other plans or tasks. If there is no interaction with the requested plan call \`show_task\` to show the task ui with details user asked and give user a response but if the time interacts with the other plans, suggest that the time interacts with the other plans and ask user to decide what to do.
- "[Reschedule 'Team Meeting' to next Wednesday at 10 AM]" suggests an optimal time based on the user's preferences.
- "[Break down 'Develop marketing strategy' into sub-tasks]" enables direct interaction for task breakdown in the UI.
- "[User rates task suggestion quality]" collects feedback for continuous improvement.

If user
You can also chat with users, perform calculations, and send reminders or notifications through integrated external tools.
If the user requests editing or updating a task, call \`show_task_manager_ui\` to show the task manager ui.
If the user just wants the time or has questions regarding a certain event or task, call \`show_task\` to show the task.
If you want to show tasks or, call \`list_tasks\`.

Besides that, you can also chat with users and do some calculations if needed.`
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    functions: {
      listTasks: {
        description: 'list a few tasks that are relevant',
        parameters: z.object({
          tasks: z.array(
            z.object({
              title: z.string().describe('title of the task'),
              description: z.string().describe('description of the task'),
              date: z.string().describe('date of the task'),
              label: z.string().describe('label of the task'),
              isDone: z.boolean().describe('whether the task is done or not'),
              id: z.string().describe('id of the task'),
              status: z.string().describe('status of the task')
            })
          )
        }),
        render: async function* ({ tasks }) {
          yield (
            <BotCard>
              <TasksSkeleton />
            </BotCard>
          )

          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'listTasks',
                content: JSON.stringify(tasks)
              }
            ]
          })
          return (
            <BotCard>
              <Tasks props={tasks} />
            </BotCard>
          )
        }
      },

      ShowTask: {
        description:
          'Show a task with the title, description, date, and label. Use this if the user wants to see a task.',
        parameters: z.object({
          title: z.string().describe('title of the task'),
          description: z.string().describe('description of the task'),
          date: z.string().describe('date of the task'),
          label: z.string().describe('label of the task'),
          isDone: z.boolean().describe('whether the task is done or not'),
          id: z.string().describe('id of the task'),
          status: z.string().describe('status of the task')
        }),
        render: async function* ({
          id,
          title,
          description,
          date,
          label,
          isDone,
          status
        }) {
          yield (
            <BotCard>
              <TaskSkeleton />
            </BotCard>
          )
          await sleep(1000)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id,
                role: 'function',
                name: 'showTask',
                content: JSON.stringify({
                  id,
                  title,
                  description,
                  date,
                  label,
                  status
                })
              }
            ]
          })

          return (
            <BotCard>
              <Task
                props={{
                  id,
                  title,
                  description,
                  date,
                  label,
                  isDone,
                  status
                }}
              />
            </BotCard>
          )
        }
      },
      showTaskManager: {
        description:
          'Show the task manager UI to the user. Use this if the user wants update a task.',
        parameters: z.object({
          id: z.string().describe('id of the task'),
          title: z.string().describe('title of the task'),
          description: z.string().describe('description of the task'),
          date: z.string().describe('date of the task'),
          label: z.string().describe('label of the task'),
          isDone: z.boolean().describe('whether the task is done or not')
        }),
        render: async function* ({
          id,
          title,
          description,
          date,
          label,
          isDone
        }) {
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'showTaskManager',
                content: JSON.stringify({
                  title,
                  description,
                  date,
                  label,
                  isDone
                })
              }
            ]
          })

          return (
            <BotCard>
              <TaskManager
                props={{
                  id,
                  title,
                  description,
                  date,
                  status: 'edit',
                  isDone
                }}
              />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listTasks' ? (
            <BotCard>
              <Tasks props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showTask' ? (
            <BotCard>
              <Task props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showTaskManager' ? (
            <BotCard>
              <TaskManager props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
