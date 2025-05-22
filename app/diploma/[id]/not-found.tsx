import Link from "next/link"

export default function DiplomaNotFound() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl border border-gray-100 transition-all">
        <div className="mb-8 flex items-center justify-center">
          <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600">
            Diplôme Non Trouvé
          </h1>
        </div>

        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 p-8 transition-all">
          <div className="relative mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-16 text-amber-500"
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
            <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-200 animate-pulse"></div>
          </div>

          <h3 className="text-xl font-semibold text-amber-700 mb-2">Diplôme introuvable</h3>
          <p className="text-center text-amber-600 max-w-md mb-2">
            Le diplôme que vous recherchez n&apos;existe pas ou n&apos;est pas disponible.
          </p>
          <p className="text-center text-gray-600 max-w-md">
            Veuillez vérifier l&apos;identifiant du diplôme et réessayer.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            <span className="relative z-10">Retour à l'accueil</span>
            <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
          </Link>
        </div>
      </div>
    </div>
  )
}
