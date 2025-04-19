"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "@/providers/SessionProvider"
import { LogOut, Menu, User, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/app/actions"

const Header = () => {
  const [open, setOpen] = useState(false)
  const { user } = useSession()
  console.log(user)
  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <span className="text-xl font-bold text-white">Dip</span>
            </div>
            <span className="text-xl font-semibold">AI</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Accueil
          </Link>
          <Link
            href="/verify?type=verification"
            className="text-sm font-medium hover:text-primary"
          >
            Vérifier
          </Link>
          <Link
            href="/verify?type=certification"
            className="text-sm font-medium hover:text-primary"
          >
            Certifier
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="default"
                className="hidden md:flex gap-2"
                asChild
              >
                <Link href="/profil">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                className="hidden md:flex gap-2"
                onClick={handleLogout}
                variant={"outline"}
              >
                <LogOut className="h-5 w-5" />
                Se déconnecter
              </Button>
            </>
          ) : (
            <Button variant="default" className="hidden md:flex" asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <span className="sr-only">Menu</span>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-10">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/verify?type=verification"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Vérifier
                </Link>
                <Link
                  href="/verify?type=certification"
                  className="text-sm font-medium hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Certifier
                </Link>

                {user ? (
                  <>
                    <Button
                      className="w-full justify-start"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/profil">Profil</Link>
                    </Button>
                    <Button
                      className="w-full justify-start"
                      asChild
                      onClick={handleLogout}
                      variant={"outline"}
                    >
                      <Link href="/logout">Se déconnecter</Link>
                    </Button>
                  </>
                ) : (
                  <div className="mt-4 space-y-2">
                    <Button
                      className="w-full justify-start"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/login">Se connecter</Link>
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
