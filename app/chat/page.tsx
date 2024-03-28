import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/ai/api'
import { auth } from '@clerk/nextjs'

export const metadata = {
  title: 'VisionaryAI - Your Personal Assistant'
}

export default async function IndexPage() {
  const id = nanoid()
  const { session } = await auth()


  
  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} />
    </AI>
  )
}
