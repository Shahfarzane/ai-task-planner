import { useId } from 'react'
import { format } from 'date-fns'
import { useAIState } from 'ai/rsc'

interface Task {
  id?: string
  title: string
  description?: string
  date?: string
  label?: string
  isDone?: boolean
  status?: string
}

export function Task({
  props: {
    title,
    description,
    label,
    date = format(new Date(), 'MM dd, yyyy'),
    isDone,
    status
  }
}: {
  props: Task
}) {
  const [aiState, setAIState] = useAIState()
  const id = useId()
  const normalizedLabel = label ? label.toLowerCase() : 'default'
  const normalizedDate = date ? date : format(new Date(), 'MM/dd/yyyy')

  const labelToColorClass: { [key: string]: string } = {
    urgent: 'bg-red-500',
    high: 'bg-yellow-500',
    medium: 'bg-blue-500',
    completed: 'bg-green-500',
    default: 'bg-green-200'
  }
  const colorClass =
    labelToColorClass[normalizedLabel] || labelToColorClass['default']

  return (
    <div className="max-w-lg" key={id}>
      <div className="space-y-4">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg ${colorClass} dark:bg-emerald-800`}
        >
          <div className="flex flex-col">
            <span className="text-sm text-semibold">{title}</span>
            <p className="text-xs text-green-800 dark:text-emerald-200">
              {description}
            </p>
          </div>
          <span className="text-xs">{normalizedDate}</span>
        </div>
      </div>
    </div>
  )
}
