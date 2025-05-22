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

  try {
    // Fetch and process the PDF on the server
    const formData = new FormData()
    formData.append("diplomaId", id)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v-download`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    })

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
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl border border-gray-100 transition-all">
          <div className="mb-8 flex items-center justify-center">
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
                Diplôme ID: <span className="font-medium text-teal-600">{id}</span>
              </p>
            </div>

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
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl border border-gray-100 transition-all">
          <div className="mb-8 flex items-center justify-center">
            <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
              Détails du Diplôme
            </h1>
          </div>

          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 transition-all">
            <div className="relative mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-16 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-200 animate-pulse"></div>
            </div>

            <h3 className="text-xl font-semibold text-red-700 mb-2">Erreur lors du traitement du diplôme</h3>
            <p className="text-center text-red-600 max-w-md">
              Nous n'avons pas pu récupérer les informations du diplôme demandé. Veuillez réessayer ultérieurement.
            </p>

            <Link
              href="/"
              className="mt-8 group relative overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <span className="relative z-10">Retour à l'accueil</span>
              <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
