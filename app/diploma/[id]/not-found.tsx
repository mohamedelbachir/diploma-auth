import Link from "next/link"

export default function DiplomaNotFound() {
  return (
    <>
      <div className="mb-8 flex w-full items-center justify-center">
        <h1 className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-center text-3xl font-bold text-transparent">
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
          <div className="absolute -right-2 -top-2 size-6 animate-pulse rounded-full bg-amber-200"></div>
        </div>

        <h3 className="mb-2 text-xl font-semibold text-amber-700">
          Diplôme introuvable
        </h3>
        <p className="mb-2 max-w-md text-center text-amber-600">
          Le diplôme que vous recherchez n&apos;existe pas ou n&apos;est pas
          disponible.
        </p>
        <p className="max-w-md text-center text-gray-600">
          Veuillez vérifier l&apos;identifiant du diplôme et réessayer.
        </p>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
          className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
        >
          <span className="relative z-10">Retour à l&apos;accueil</span>
          <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
        </Link>
      </div>
    </>
  )
}
