"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface PdfPreviewProps {
  image: ArrayBuffer
}

export default function PdfPreview({ image }: PdfPreviewProps) {
  const [imageData, setImageData] = useState<string | null>(null)
  const loadPdfJs = async () => {
    // Skip if already loaded
    if (window.pdfjsLib) return

    try {
      // Create script element for PDF.js
      const script = document.createElement("script")
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
      script.async = true
      document.body.appendChild(script)

      // Wait for script to load
      await new Promise((resolve) => {
        script.onload = resolve
      })

      // Set PDF.js worker
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js"

      console.log("PDF.js loaded successfully")
    } catch (err) {
      console.error("Error loading PDF.js:", err)
    }
  }
  useEffect(() => {
    loadPdfJs()
  }, [])
  useEffect(() => {
    const convertPdfToImage = async () => {
      if (window.pdfjsLib) {
        const pdf = await window.pdfjsLib.getDocument(image)
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1.0 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.height = viewport.height
        canvas.width = viewport.width
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }
        await page.render(renderContext).promise
        const imageData = canvas.toDataURL("image/png")
        setImageData(imageData)
      }
    }
    convertPdfToImage()
  }, [image])
  return (
    <Image
      src={imageData || ""}
      alt="Aperçu du Diplôme"
      width={600}
      height={Math.round(600 * 1.414)} // Assuming A4 aspect ratio
      className="rounded-md border border-gray-300 shadow-lg"
    />
  )
}
