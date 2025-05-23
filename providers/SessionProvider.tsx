"use client"

import { PropsWithChildren, createContext, useContext } from "react"

import { SessionData } from "../lib"

export const SessionContext = createContext<SessionData>({
  user: null,
})

export const SessionProvider = ({
  children,
  session,
}: PropsWithChildren<{ session: SessionData }>) => {
  // Ensure we're working with a plain object
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
