"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface PdfPreviewProps {
  data: string // base64 PDF data
}

export default function PdfPreview({ data }: PdfPreviewProps) {
  const [imageData, setImageData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  useEffect(() => {
    const loadAndRender = async () => {
      if (!window.pdfjsLib) {
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })

        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"
      }

      try {
        const arrayBuffer = base64ToArrayBuffer(data)
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        canvas.height = viewport.height
        canvas.width = viewport.width

        await page.render({ canvasContext: context, viewport }).promise

        const imgData = canvas.toDataURL("image/png")
        setImageData(imgData)
        setLoading(false)
      } catch (error) {
        console.error("Error rendering PDF:", error)
        setLoading(false)
      }
    }

    loadAndRender()
  }, [data])

  return (
    <div className="relative select-none w-full flex justify-center">
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="h-10 w-10 relative">
            <svg
              className="animate-spin text-teal-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Chargement de l'aperçu...</p>
        </div>
      )}

      {imageData && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <Image
              src={imageData || "/placeholder.svg"}
              alt="Aperçu du Diplôme"
              width={600}
              height={Math.round(600 * 1.414)} // A4 ratio
              className="rounded-lg border border-gray-200 shadow-lg pointer-events-none bg-white transition-all"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onPointerDown={(e) => {
                // Prevent long-press save on mobile
                if (e.pointerType === "touch") e.preventDefault()
              }}
            />
            <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-md opacity-70">
              Aperçu
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
