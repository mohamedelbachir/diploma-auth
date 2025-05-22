import Link from "next/link"

export default function DiplomaNotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-700">
          Diplôme Non Trouvé
        </h1>
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
            Le diplôme que vous recherchez n&apos;existe pas ou n&apos;est pas
            disponible.
          </p>
          <p className="mt-2 text-center text-gray-600">
            Veuillez vérifier l&apos;identifiant du diplôme et réessayer.
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
