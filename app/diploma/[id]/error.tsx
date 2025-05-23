/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import { Link } from "lucide-react"

function ErrorPage() {
  return (
    <>
      <div className="mb-8 flex w-full items-center justify-center">
        <h1 className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-center text-3xl font-bold text-transparent">
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
          <div className="absolute -right-2 -top-2 size-6 animate-pulse rounded-full bg-red-200"></div>
        </div>

        <h3 className="mb-2 text-xl font-semibold text-red-700">
          Erreur lors du traitement du diplôme
        </h3>
        <p className="max-w-md text-center text-red-600">
          Nous n&apos;avons pas pu récupérer les informations du diplôme
          demandé. Veuillez réessayer ultérieurement.
        </p>

        <Link
          href="/"
          className="group relative mt-8 overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          <span className="relative z-10">Retour à l&apos;accueil</span>
          <span className="absolute inset-0 bg-white opacity-0 transition-opacity group-hover:opacity-20"></span>
        </Link>
      </div>
    </>
  )
}

export default ErrorPage
