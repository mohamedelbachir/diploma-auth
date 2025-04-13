import React from "react"
import { redirect } from "next/navigation"

import { getSession } from "../actions"

export default async function ProfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.user) {
    redirect("/login")
  }
  return <>{children}</>
}
