'use client'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { Chat } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SidebarItemsProps {
  chats?: Chat[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  const pathname = usePathname()
  const [newId, setNewId] = useLocalStorage('id', null)

  return (
    <AnimatePresence>
      {chats?.map((chat, index) => {
        const isActive = pathname === chat.path
        const shouldAnimate = index === 0 && isActive && newId

        if (!chat?.id) return null

        return (
          <motion.div
            key={chat?.id}
            exit={{
              opacity: 0,
              height: 0
            }}
          >
            <motion.div
              className="relative h-8"
              variants={{
                initial: {
                  height: 0,
                  opacity: 0
                },
                animate: {
                  height: 'auto',
                  opacity: 1
                }
              }}
              initial={shouldAnimate ? 'initial' : undefined}
              animate={shouldAnimate ? 'animate' : undefined}
              transition={{
                duration: 0.25,
                ease: 'easeIn'
              }}
            >
              <Link
                href={chat.path}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'group w-full px-8 transition-colors hover:bg-zinc-200/40 dark:hover:bg-zinc-300/10',
                  isActive && 'bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800'
                )}
              >
                <div
                  className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
                  title={chat.title}
                >
                  <span className="whitespace-nowrap">
                    {shouldAnimate ? (
                      chat.title.split('').map((character, index) => (
                        <motion.span
                          key={index}
                          variants={{
                            initial: {
                              opacity: 0,
                              x: -100
                            },
                            animate: {
                              opacity: 1,
                              x: 0
                            }
                          }}
                          initial={shouldAnimate ? 'initial' : undefined}
                          animate={shouldAnimate ? 'animate' : undefined}
                          transition={{
                            duration: 0.25,
                            ease: 'easeIn',
                            delay: index * 0.05,
                            staggerChildren: 0.05
                          }}
                          onAnimationComplete={() => {
                            if (index === chat.title.length - 1) {
                              setNewId(null)
                            }
                          }}
                        >
                          {character}
                        </motion.span>
                      ))
                    ) : (
                      <span>{chat.title}</span>
                    )}
                  </span>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}
