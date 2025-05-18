"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import * as pdfjsLib from "pdfjs-dist"

// Configure the workerSrc for pdfjs-dist
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

interface PageProps {
  params: {
    id: string
  }
}

export default function DiplomaDetailsPage({ params }: PageProps) {
  const { id } = params
  const [diplomaImageUrl, setDiplomaImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchAndRenderDiploma = async () => {
      setLoading(true)
      setError(null)
      setDiplomaImageUrl(null)

      try {
        const response = await fetch(`/api/v-download?id=${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("Diplôme non trouvé.")
          } else {
            setError("Erreur lors de la récupération du diplôme.")
          }
          setLoading(false)
          return
        }

        const pdfData = await response.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
        const page = await pdf.getPage(1) // Get the first page

        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        canvas.height = viewport.height
        canvas.width = viewport.width
        const context = canvas.getContext("2d")

        if (!context) {
          setError("Erreur lors de la création du contexte du canvas.")
          setLoading(false)
          return
        }

        await page.render({ canvasContext: context, viewport }).promise
        setDiplomaImageUrl(canvas.toDataURL("image/png"))
      } catch (err) {
        console.error("Error processing PDF:", err)
        setError("Erreur lors du traitement du PDF.")
      } finally {
        setLoading(false)
      }
    }

    fetchAndRenderDiploma()
  }, [id])

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-700">
          Détails du Diplôme
        </h1>
        <div className="flex flex-col items-center gap-6">
          {loading && (
            <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-6">
              <svg
                className="mb-3 size-10 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-center text-lg text-gray-600">
                Chargement du diplôme...
              </p>
            </div>
          )}
          {error && (
            <div className="flex w-full flex-col items-center justify-center rounded-lg border border-red-300 bg-red-50 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3 size-10 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-center text-lg font-semibold text-red-600">
                {error}
              </p>
            </div>
          )}
          {!loading && !error && diplomaImageUrl && (
            <>
              <Image
                src={diplomaImageUrl}
                alt="Aperçu du Diplôme"
                width={600}
                height={Math.round(600 * 1.414)} // Assuming A4 aspect ratio
                className="rounded-md border border-gray-300 shadow-lg"
              />
              <p className="text-md mt-2 text-center text-gray-600">
                Ceci est la description du diplôme pour l&apos;ID : {id}
              </p>
            </>
          )}
          {!loading && !error && !diplomaImageUrl && (
            <div className="flex w-full flex-col items-center justify-center rounded-lg border border-yellow-300 bg-yellow-50 p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mb-3 size-10 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-center text-lg font-semibold text-yellow-700">
                Le diplôme n&apos;est pas disponible pour cet ID.
              </p>
            </div>
          )}

          {!loading && !error && (
            <a
              href={`/api/v-download?id=${id}`}
              download={`diplome-${id}.pdf`}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              Télécharger le Diplôme
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
