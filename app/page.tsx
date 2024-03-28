'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="">
      <div className="py-24 sm:py-32 lg:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="mb-8 inline-flex items-center px-3 py-1 text-xs font-medium">
              VisionaryAI beta version 🎉
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Viosionary.AI
            </h1>
            <p className="mt-6 text-lg leading-8">
              A better way to use ChatGPT. Its more than just text.
              <br />
              Transform Your Daily Habits into Achievement
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/chat">
                <Button className="mt-8">Get early access</Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 flow-root sm:mt-24">
            <Image
              src="/hero1.png"
              alt="chat"
              priority={false}
              width={2432}
              height={1442}
              className="rounded-md "
            />
          </div>
        </div>
      </div>
    </div>
  )
}
