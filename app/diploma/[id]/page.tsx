import Link from "next/link"
import { notFound } from "next/navigation"
import { getSession } from "@/app/actions"

import DownloadButton from "./download-button"
import PdfPreview from "./pdf-preview"

interface PageProps {
  params: {
    id: string
  }
}

export default async function DiplomaDetailsPage({ params }: PageProps) {
  const { id } = params
  const session = await getSession()

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v-download`
  const formData = new FormData()
  formData.append("diplomaId", id)

  const response = await fetch(apiUrl, {
    method: "POST",
    body: formData,
    cache: "no-store",
  })

  // Handle 404
  if (response.status === 404) {
    notFound()
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch diploma: ${response.status}`)
  }

  const pdfBuffer = await response.arrayBuffer()
  if (!pdfBuffer) {
    notFound()
  }

  const base64Pdf = Buffer.from(pdfBuffer).toString("base64")

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-center mb-4">
        Détails du Diplôme
      </h1>

      {/* PDF Viewer */}
      <div className="w-full max-w-4xl rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
        <PdfPreview data={base64Pdf} />
      </div>

      {/* Diploma ID */}
      <div className="text-center">
        <p className="inline-block rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-md text-gray-600">
          Diplôme ID:{" "}
          <span className="font-medium text-teal-600">{id}</span>
        </p>
      </div>

      {/* Download or Login CTA */}
      {session?.user ? (
        <DownloadButton id={id} />
      ) : (
        <Link
          href="/login"
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
        >
          <span className="relative z-10">Se connecter pour télécharger</span>
          <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
        </Link>
      )}
    </div>
  )
}
