"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CameraIcon } from "lucide-react"

export default function ButtonScan() {
  const pathname = usePathname()
  const linksToExclude = ["/diploma", "/verify"]
  return <>
    {!linksToExclude.includes(pathname) && (
      <Link href="/diploma?type=scan">
        <div className="fixed bottom-5 right-3 z-50 flex items-center justify-center rounded-full bg-blue-500 p-3 font-mono text-xs text-white shadow-lg shadow-blue-500/50">
          <CameraIcon className="h-5 w-5" />
        </div>
      </Link>
    )}
  </>
}
