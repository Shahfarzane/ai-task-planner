import { Sidebar } from '@/components/sidebar'
import { ChatHistory } from '@/components/chat-history'
import { redirectToSignIn, auth } from '@clerk/nextjs'

export async function AppSidebar() {
  const { userId } = auth()
  if (!userId) {
    return redirectToSignIn()
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      {/* @ts-ignore */}
      <ChatHistory userId={userId} />
    </Sidebar>
  )
}
