import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/ai/api'
import { auth, redirectToSignIn } from '@clerk/nextjs'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const { userId } = auth()

  if (!userId) {
    return {}
  }

  const chat = await getChat(params.id, userId)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = auth()

  if (!userId) {
    redirectToSignIn()
  }

  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat id={chat.id} session={userId} initialMessages={chat.messages} />
    </AI>
  )
}
