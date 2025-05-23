/* eslint-disable tailwindcss/migration-from-tailwind-2 */
/* eslint-disable tailwindcss/classnames-order */
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
  let data = ""
  // Fetch and process the PDF on the server
  const formData = new FormData()
  formData.append("diplomaId", id)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v-download`,
    {
      method: "POST",
      body: formData,
      cache: "no-store",
    }
  )

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Failed to fetch diploma: ${response.status}`)
  }

  const pdfBuffer = await response.arrayBuffer()
  const base64Pdf = Buffer.from(pdfBuffer).toString("base64")
  data = base64Pdf

  if (!pdfBuffer) {
    notFound()
  }

  return (
    <>
      <>
        <div className="w-full mb-8 flex items-center justify-center">
          <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
            Détails du Diplôme
          </h1>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="w-full rounded-xl border border-gray-200 p-4 bg-gray-50 shadow-inner">
            <PdfPreview data={data} />
          </div>

          <div className="text-center">
            <p className="text-md text-gray-600 bg-gray-50 px-4 py-2 rounded-full inline-block border border-gray-200">
              Diplôme ID:{" "}
              <span className="font-medium text-teal-600">{id}</span>
            </p>
          </div>

          {session?.user ? (
            <DownloadButton id={id} />
          ) : (
            <Link
              href="/login"
              className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              <span className="relative z-10">
                Se connecter pour télécharger
              </span>
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
            </Link>
          )}
        </div>
      </>
    </>
  )
}
