"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { FileUp, Loader2, CheckCircle, AlertCircle, Trash2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DocumentScannerProps {
  /**
   * The default image URL to be scanned (optional)
   */
  defaultImage?: string
  /**
   * The duration of the scanning animation in seconds
   * @default 3
   */
  scanDuration?: number
  /**
   * The color of the scanning light
   * @default "rgba(0, 255, 0, 0.3)"
   */
  scanColor?: string
  /**
   * Whether to auto-start the scanning animation
   * @default false
   */
  autoStart?: boolean
  /**
   * The width of the scanner container
   * @default "100%"
   */
  width?: string | number
  /**
   * The height of the scanner container
   * @default "auto"
   */
  height?: string | number
  /**
   * Maximum file size in bytes
   * @default 10485760 (10MB)
   */
  maxFileSize?: number
  /**
   * Callback when scanning is complete
   */
  onScanComplete?: (file: File) => void
  /**
   * Additional CSS class names
   */
  className?: string
}

type ScanStatus = "idle" | "scanning" | "processing" | "complete" | "error"
type FilePreview = {
  file: File
  url: string
  type: "image" | "pdf"
  pdfCanvas?: HTMLCanvasElement
}

export function DocumentScanner({
  defaultImage,
  scanDuration = 3,
  scanColor = "rgba(0, 255, 0, 0.3)",
  autoStart = false,
  width = "100%",
  height = 400,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  onScanComplete,
  className,
}: DocumentScannerProps) {
  const [preview, setPreview] = useState<FilePreview | null>(null)
  const [status, setStatus] = useState<ScanStatus>("idle")
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processingStatus, setProcessingStatus] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const scannerControls = useAnimation()

  // Load PDF.js library dynamically
  useEffect(() => {
    const loadPdfJs = async () => {
      // Skip if already loaded
      if (window.pdfjsLib) return

      try {
        // Create script element for PDF.js
        const script = document.createElement("script")
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
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

    loadPdfJs()
  }, [])

  // Handle file selection
  const handleFileChange = async (selectedFile: File | null) => {
    // Reset states
    setError(null)
    setStatus("idle")
    setProcessingStatus("")

    // Clear previous preview
    if (preview?.url) {
      URL.revokeObjectURL(preview.url)
    }

    if (!selectedFile) {
      setPreview(null)
      return
    }

    // Validate file size
    if (selectedFile.size > maxFileSize) {
      setError(`File is too large. Maximum size is ${formatFileSize(maxFileSize)}.`)
      return
    }

    try {
      // Check file type
      if (selectedFile.type.startsWith("image/")) {
        // Handle image files
        const imageUrl = URL.createObjectURL(selectedFile)
        setPreview({
          file: selectedFile,
          url: imageUrl,
          type: "image",
        })

        // Auto start scanning if enabled
        if (autoStart) {
          setTimeout(() => startScan(), 500)
        }
      } else if (selectedFile.type === "application/pdf") {
        // Handle PDF files
        setProcessingStatus("Loading PDF preview...")
        const pdfUrl = URL.createObjectURL(selectedFile)

        // Create initial preview with just the URL
        setPreview({
          file: selectedFile,
          url: pdfUrl,
          type: "pdf",
        })

        // Render PDF preview
        await renderPdfPreview(selectedFile, pdfUrl)

        // Auto start scanning if enabled
        if (autoStart) {
          setTimeout(() => startScan(), 500)
        }
      } else {
        setError("Unsupported file type. Please upload an image or PDF file.")
      }
    } catch (err) {
      console.error("Error handling file:", err)
      setError("Failed to process file. Please try again.")
    }
  }

  // Render PDF preview
  const renderPdfPreview = async (file: File, pdfUrl: string) => {
    if (!window.pdfjsLib) {
      setError("PDF.js library not loaded. Please refresh and try again.")
      return
    }

    try {
      setProcessingStatus("Loading PDF document...")

      // Read the file
      const fileReader = new FileReader()
      const pdfArrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
        fileReader.onerror = reject
        fileReader.readAsArrayBuffer(file)
      })

      // Load the PDF document
      const pdf = await window.pdfjsLib.getDocument({ data: pdfArrayBuffer }).promise

      // Process first page only
      setProcessingStatus("Rendering page 1...")
      const page = await pdf.getPage(1)

      // Render the page on a canvas
      const viewport = page.getViewport({ scale: 1.5 }) // Higher scale for better quality
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise

      // Update preview with canvas
      setPreview((prev) => {
        if (prev) {
          return {
            ...prev,
            pdfCanvas: canvas,
          }
        }
        return prev
      })

      setProcessingStatus("")
    } catch (err) {
      console.error("Error rendering PDF:", err)
      setError("Failed to render PDF preview. The file may be corrupted or password-protected.")
    }
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  // Handle button click to open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // Start scanning process
  const startScan = async () => {
    if (status !== "idle" || !preview) return

    setStatus("scanning")

    // Reset scanner position
    await scannerControls.start({ top: "0%" })

    // Start scanning animation
    await scannerControls.start({
      top: "100%",
      transition: { duration: scanDuration, ease: "linear" },
    })

    // Simulate processing
    setStatus("processing")

    // Simulate backend processing
    setTimeout(() => {
      setStatus("complete")
      if (onScanComplete) {
        onScanComplete(preview.file)
      }
    }, 1500)
  }

  // Reset the component
  const resetScanner = () => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url)
    }
    setPreview(null)
    setStatus("idle")
    setError(null)
    setProcessingStatus("")
    scannerControls.start({ top: "0%" })
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [preview])

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        ref={previewContainerRef}
        className={cn(
          "relative overflow-hidden rounded-md border shadow-md bg-white",
          dragActive ? "border-green-500 ring-2 ring-green-200" : "border-gray-300",
          status === "error" && "border-red-500",
        )}
        style={{ width, height }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Document preview area */}
        {preview ? (
          <div className="w-full h-full flex items-center justify-center p-5">
            {preview.type === "image" ? (
              <img
                src={preview.url || "/placeholder.svg"}
                alt="Document preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : preview.pdfCanvas ? (
              <img
                src={preview.pdfCanvas.toDataURL("image/png") || "/placeholder.svg"}
                alt="PDF preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">{processingStatus || "Loading preview..."}</p>
              </div>
            )}
          </div>
        ) : defaultImage ? (
          <img
            src={defaultImage || "/placeholder.svg"}
            alt="Default document"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <FileUp className="w-12 h-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-700">Drag & Drop</h3>
            <p className="text-sm text-gray-500 mb-4">Drop your document here or click to browse</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Select File
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Supported formats: JPEG, PNG, GIF, PDF (Max {formatFileSize(maxFileSize)})
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />

        {/* Scanner light effect - only show during scanning */}
        {status === "scanning" && (
          <motion.div
            className="absolute left-0 w-full h-[20px] pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, ${scanColor}, transparent)`,
              boxShadow: `0 0 10px 5px ${scanColor}`,
              top: "0%",
            }}
            animate={scannerControls}
          />
        )}

        {/* Scan lines overlay - only show during scanning */}
        {status === "scanning" && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,0.05)_4px)] bg-[length:100%_4px]" />
        )}

        {/* Processing overlay */}
        {status === "processing" && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-2" />
              <p className="text-sm font-medium">Processing document...</p>
            </div>
          </div>
        )}

        {/* Complete overlay */}
        {status === "complete" && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm font-medium">Document processed successfully!</p>
            </div>
          </div>
        )}

        {/* File info - show when file is selected */}
        {preview && status === "idle" && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-2 text-sm flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-gray-500" />
              <span className="truncate">{preview.file.name}</span>
            </div>
            <span className="text-gray-500 text-xs">{formatFileSize(preview.file.size)}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-700 p-2 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {preview && status === "idle" && (
          <button
            onClick={startScan}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
          >
            Start Scanning
          </button>
        )}

        {status === "scanning" && (
          <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed">
            Scanning...
          </button>
        )}

        {status === "processing" && (
          <button disabled className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed">
            Processing...
          </button>
        )}

        {status === "complete" && (
          <button
            onClick={resetScanner}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Scan Another Document
          </button>
        )}

        {preview && (
          <button
            onClick={resetScanner}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

// Add types for the PDF.js library
declare global {
  interface Window {
    pdfjsLib: any
  }
}
