"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion, useAnimation } from "framer-motion"
import {
  AlertCircle,
  CheckCircle,
  FileText,
  FileUp,
  Loader2,
  RefreshCw,
  Trash2,
} from "lucide-react"
import QrScanner from "qr-scanner"
import { toast } from "sonner"
import { createWorker } from "tesseract.js"

import { pdfToImg } from "@/lib/pdf-to-img"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  onScanComplete?: (file: File, extractedText: string[]) => void
  /**
   * Additional CSS class names
   */
  className?: string
}

type ScanStatus = "idle" | "scanning" | "processing" | "complete" | "error"
type DocumentType = "verification" | "certification"
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
  const [extractedText, setExtractedText] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [result, setResult] = useState({})
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const [documentType, setDocumentType] = useState<DocumentType>(
    (type as DocumentType) || "verification"
  )
  const [isLoading, setIsLoading] = useState(true)
  const workerRef = useRef<Tesseract.Worker | null>(null)

  // Load PDF.js library dynamically
  useEffect(() => {
    const loadTesseract = async () => {
      workerRef.current = await createWorker({
        logger: (m) => {
          console.log(m)
          if (m.status === "recognizing text") {
            setProcessingStatus(
              `Reconnaissance du texte... ${Math.floor(m.progress * 100)}%`
            )
          }
        },
      })
      await workerRef.current.load()
      await workerRef.current.loadLanguage("fra")
      await workerRef.current.initialize("fra")
    }

    //loadTesseract()
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

    //loadPdfJs()
    Promise.all([loadTesseract(), loadPdfJs()]).then(() => {
      setIsLoading(false)
    })
  }, [])

  // Handle file selection
  const handleFileChange = async (selectedFile: File | null) => {
    // Reset states
    setError(null)
    setStatus("idle")
    setProcessingStatus("")
    setExtractedText([])

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
      setError(
        `Le fichier est trop lourd. La taille maximale est de ${formatFileSize(
          maxFileSize
        )}.`
      )
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
        setError(
          "Format de fichier non supporté. Veuillez télécharger une image ou un fichier PDF."
        )
      }
    } catch (err) {
      console.error("Error handling file:", err)
      setError("Erreur lors du traitement du fichier. Veuillez réessayer.")
    }
  }

  // Render PDF preview
  const renderPdfPreview = async (file: File, pdfUrl: string) => {
    if (!window.pdfjsLib) {
      setError(
        "La bibliothèque PDF.js n'est pas chargée. Veuillez actualiser et réessayer."
      )
      return
    }

    try {
      setProcessingStatus("Chargement du document PDF...")

      // Read the file
      const fileReader = new FileReader()
      const pdfArrayBuffer = await new Promise<ArrayBuffer>(
        (resolve, reject) => {
          fileReader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
          fileReader.onerror = reject
          fileReader.readAsArrayBuffer(file)
        }
      )

      // Load the PDF document
      const pdf = await window.pdfjsLib.getDocument({ data: pdfArrayBuffer })
        .promise

      // Process first page only
      setProcessingStatus("Rendu de la page 1...")
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
      setError(
        "Failed to render PDF preview. The file may be corrupted or password-protected."
      )
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

  // Extract text from image using Tesseract.js
  const extractTextFromImage = async (
    imageSource: string | Blob
  ): Promise<string> => {
    setProcessingStatus("Extraction du texte...")

    try {
      if (!workerRef.current) {
        throw new Error("Tesseract worker not initialized")
      }

      const {
        data: { text },
      } = await workerRef.current.recognize(imageSource)

      return text
    } catch (error) {
      console.error("Error extracting text from image:", error)
      throw new Error("Échec de l'extraction du texte de l'image")
    }
  }

  // Process PDF file
  const processPdfFile = async (file: File): Promise<string[]> => {
    setProcessingStatus("Conversion du PDF en images...")

    try {
      const images = await pdfToImg(file, 1)
      const pages = []

      for (let i = 0; i < images.length; i++) {
        setProcessingStatus(`Traitement du document...`)
        const image = images[i]

        const text = await extractTextFromImage(image)
        pages.push(text)
      }

      return pages
    } catch (error) {
      console.error("Error processing PDF file:", error)
      throw new Error("Échec du traitement du fichier PDF")
    }
  }

  // Start scanning process
  const startScan = async () => {
    // Prevent start if not idle or no preview
    if (status !== "idle" || !preview) return

    try {
      setStatus("processing")
      // Reset scanner position

      let textResults: string[] = []

      if (preview.type === "image") {
        // Process image file
        const text = await extractTextFromImage(preview.file)
        textResults = [text]
      } else if (preview.type === "pdf") {
        // Process PDF file
        textResults = await processPdfFile(preview.file)
      }

      setProcessingStatus("amelioration du texte...")

      const result = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ text: textResults[0] }),
      })

      const data = await result.json()

      /*const formData = new FormData();
      formData.append('file', preview.file);
      const qrCode = await fetch("/api/qr-code", {
        method: "POST",
        body: formData,
      })

IndexSizeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The source width is 0
      const qrCodeData = await qrCode.json()
      console.log(qrCodeData)
      */

      //await QrScanner.scanImage(preview.file,{returnDetailedScanResult:true}).then(result=>console.log(result)).catch(e=>console.log(e))

      const qrCodeData = await QrScanner.scanImage(
        preview.type === "image" ? preview.url : preview.pdfCanvas!,
        { returnDetailedScanResult: true }
      )

      if (!qrCodeData.data) {
        qrCodeData.data = "QR code non trouvé"
      }
      // Update state with extracted text
      setExtractedText(textResults)

      data.qrcode = qrCodeData.data

      //console.log(textResults)
      console.log(data)

      setResult(data)

      // Complete scan
      setStatus("complete")
      // scannerControls.set({ top: "0%" })
      // scannerControls.stop()

      // Call callback if provided
      if (onScanComplete) {
        onScanComplete(preview.file, textResults)
      }
    } catch (err) {
      console.error("Error during scanning process:", err)
      setError(
        "Une erreur s'est produite lors du traitement. Veuillez réessayer."
      )
      setStatus("error")
    }
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
    setExtractedText([])
    setResult({})
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url)
      }
    }
  }, [preview])

  // Add a cleanup in useEffect
  useEffect(() => {
    // Clean up worker on component unmount
    if (workerRef.current) {
      workerRef.current.terminate()
    }
  }, [])

  const isMobile = useIsMobile()
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        ref={previewContainerRef}
        className={cn(
          "relative overflow-hidden rounded-md border shadow-md bg-white",
          dragActive
            ? "border-green-500 ring-2 ring-green-200"
            : "border-gray-300",
          status === "error" && "border-red-500"
        )}
        style={{ width, height: isMobile ? "300px" : height }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isLoading && (
          <div className="absolute bg-dark/50 inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">
                Chargement des ressources ... <br />
                (modèles de reconnaissance)
              </p>
            </div>
          </div>
        )}
        {/* Document preview area */}
        {!isLoading && (
          <>
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
                    src={
                      preview.pdfCanvas.toDataURL("image/png") ||
                      "/placeholder.svg"
                    }
                    alt="PDF preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {processingStatus || "Loading preview..."}
                    </p>
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
                <h3 className="text-lg font-medium text-gray-700">
                  Glisser et lâcher
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Glissez votre document ici ou cliquez pour parcourir
                </p>
                <button
                  type="button"
                  onClick={handleButtonClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  Parcourir
                </button>
                <p className="mt-4 text-xs text-gray-400">
                  Formats supportés: JPEG, PNG, GIF, PDF (Max{" "}
                  {formatFileSize(maxFileSize)})
                </p>
              </div>
            )}
          </>
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
        {status === "processing" && (
          <motion.div
            className="absolute left-0 w-full h-[20px] pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, ${scanColor}, transparent)`,
              boxShadow: `0 0 10px 5px ${scanColor}`,
              top: "0%",
            }}
            animate={{
              top: ["0%", "100%"],
              transition: {
                duration: scanDuration,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              },
            }}
          />
        )}

        {/* Scan lines overlay - only show during scanning */}
        {status === "processing" && (
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0px,transparent_3px,rgba(0,0,0,0.05)_4px)] bg-[length:100%_4px]" />
        )}

        {/* Processing overlay */}
        {status === "processing" && processingStatus && (
          <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-2" />
              <p className="text-sm font-medium">
                {processingStatus || "Traitement du document..."}
              </p>
            </div>
          </div>
        )}

        {/* Complete overlay */}
        {status === "complete" && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm font-medium">
                Document traité avec succès!
              </p>
              {extractedText.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {extractedText.length} page(s) analysée(s)
                </p>
              )}
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
            <span className="text-gray-500 text-xs">
              {formatFileSize(preview.file.size)}
            </span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-700 p-2 text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {preview && (status === "idle" || status === "complete") && (
          <button
            onClick={resetScanner}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <Trash2 className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {preview && status === "idle" && (
          <>
            <Select
              value={documentType}
              onValueChange={(value: DocumentType) => setDocumentType(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verification">Vérification</SelectItem>
                <SelectItem value="certification">Certification</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={startScan}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
            >
              Commencer
            </button>
          </>
        )}

        {status === "scanning" && (
          <button
            disabled
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed"
          >
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Numérisation en cours...
          </button>
        )}

        {status === "processing" && (
          <button
            disabled
            className="w-full flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed"
          >
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Traitement en cours...
          </button>
        )}

        {status === "complete" && (
          <>
            <button
              onClick={resetScanner}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2 text-white" />
              Scanner un autre document
            </button>
            <button
              onClick={() => {
                // Format the JSON nicely
                const formattedJson = JSON.stringify(result, null, 2)
                // Display in a styled toast
                toast(
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Données extraites:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded max-h-60 overflow-auto w-full whitespace-pre-wrap">
                      <code>{formattedJson}</code>
                    </pre>
                  </div>
                )
              }}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors" // Changed color slightly for distinction
            >
              Afficher les résultats
            </button>
          </>
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
