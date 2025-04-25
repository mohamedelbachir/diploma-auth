"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CameraIcon } from "lucide-react"

export default function ButtonScan() {
  const pathname = usePathname()
  const linksToExclude = ["/diploma", "/verify"]
  return (
    !linksToExclude.includes(pathname) && (
      <Link href="/diploma?type=scan">
        <div className="fixed bottom-3 right-3 z-50 flex items-center justify-center rounded-full bg-blue-500 p-3 font-mono text-xs text-white">
          <CameraIcon className="h-5 w-5" />
        </div>
      </Link>
    )
  )
}
