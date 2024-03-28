'use client'

import dynamic from 'next/dynamic'
import { TaskSkeleton } from './task-skeleton'
import { TasksSkeleton } from './tasks-skeleton'

export { loading } from './loading'
export { BotCard, BotMessage, SystemMessage } from './message'

const Task = dynamic(() => import('./task').then(mod => mod.Task), {
  ssr: false,
  loading: () => <TaskSkeleton />
})

const TaskManager = dynamic(
  () => import('./task-manager').then(mod => mod.TaskManager),
  {
    ssr: false,
    loading: () => (
      <div className="h-[375px] rounded-xl border  p-4 text-green-200 sm:h-[314px]" />
    )
  }
)

const Tasks = dynamic(() => import('./task-items').then(mod => mod.Tasks), {
  ssr: false,
  loading: () => <TasksSkeleton />
})

export { Task, TaskManager, Tasks }
