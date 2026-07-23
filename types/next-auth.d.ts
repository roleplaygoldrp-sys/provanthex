import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      plan: string
      credits: number
    } & DefaultSession['user']
  }

  interface User {
    plan?: string
    credits?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    plan: string
    credits: number
  }
}
