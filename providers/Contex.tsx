"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

import { getSession } from "@/app/actions"

import { SessionData } from "../lib"

interface ContextState {
  user: SessionData
}

export const Context = createContext<ContextState | undefined>(undefined)
export const useAuth = () => useContext(Context)
function SessionContexProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<SessionData>()
  const pathname = usePathname()
  useEffect(() => {
    const session = async () => {
      const s = await getSession()
      setUser(s)
      console.log(s)
    }
    session()
    console.log(user)
  }, [pathname])
  const contextValue: ContextState = {
    user: user!,
  }
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}

export default SessionContexProvider
