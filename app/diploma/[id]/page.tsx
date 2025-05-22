import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPdfAsImage } from "@/lib/pdf-utils"
import { getSession } from "@/app/actions"
import DownloadButton from "./download-button"
interface PageProps {
  params: {
    id: string
  }
}

export default async function DiplomaDetailsPage({ params }: PageProps) {
  const { id } = params
  const session = await getSession()
  try {
    // Fetch and process the PDF on the server
    const diplomaImageData = await getPdfAsImage(id)

    if (!diplomaImageData) {
      notFound()
    }

    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-700">
            Détails du Diplôme
          </h1>
          <div className="flex flex-col items-center gap-6">
            <Image
              src={`data:image/png;base64,${diplomaImageData}`}
              alt="Aperçu du Diplôme"
              width={600}
              height={Math.round(600 * 1.414)} // Assuming A4 aspect ratio
              className="rounded-md border border-gray-300 shadow-lg"
            />
            <p className="text-md mt-2 text-center text-gray-600">
              Ceci est la description du diplôme pour l&apos;ID : {id}
            </p>
            {session?.user?<DownloadButton id={id}/>:<Link href="/login" className="mt-6 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">Se connecter pour télécharger</Link>}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-700">
            Détails du Diplôme
          </h1>
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
              Erreur lors du traitement du diplôme.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
