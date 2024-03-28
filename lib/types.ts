import { Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string | null
  path: string
  messages: Message[]
  sharePath?: string
  updatedAt?: Date
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    primaryEmailAddressId: string | null
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface Place {
  id?: string
  created_at?: string
  location?: string
  name?: string
  image?: string
  relationship?: string
}

export interface Contact {
  id?: string
  created_at?: string
  contactName?: string
  mobileNr?: string
  email?: string
  relationship?: string
}
