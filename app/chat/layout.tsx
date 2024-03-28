import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      <Header />
      <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
        <AppSidebar />
        <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
          {children}
        </div>
      </div>
    </>
  )
}
