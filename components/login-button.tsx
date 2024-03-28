import { SignInButton, auth } from '@clerk/nextjs'
import { ChatHistory } from './chat-history'
import { MobileNavBar } from './navbar'
import { Toggle } from './toggle'
export async function LoginButton() {
  const { userId } = await auth()
  return (
    <>
      {userId ? (
        <>
          <MobileNavBar>
            <ChatHistory userId={userId} />
          </MobileNavBar>
          <Toggle />
        </>
      ) : (
        <SignInButton afterSignInUrl="/chat" />
      )}
    </>
  )
}
