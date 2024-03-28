import { Skeleton } from '../ui/skeleton'

export const TasksSkeleton = () => {
  return (
    <div className="-mt-2 flex w-full flex-col gap-2 py-4">
      <Skeleton className="flex h-[60px] w-full cursor-pointer flex-row gap-2 rounded-lg  p-2 text-left"></Skeleton>
      <Skeleton className="flex h-[60px] w-full cursor-pointer flex-row gap-2 rounded-lg  p-2 text-left"></Skeleton>
    </div>
  )
}
