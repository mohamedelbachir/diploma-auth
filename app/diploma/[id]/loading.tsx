export default function DiplomaLoading() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-700">
          Détails du Diplôme
        </h1>
        <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
          <div className="relative flex items-center justify-center">
            <div className="h-32 w-32">
              <svg
                className="animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl font-medium text-gray-900">
              Chargement du diplôme...
            </h3>
            <p className="mt-2 text-gray-500">
              Veuillez patienter pendant le traitement du document.
            </p>
          </div>

          {/* Skeleton for diploma preview */}
          <div className="mt-8 h-[600px] w-full animate-pulse rounded-lg bg-gray-300"></div>
        </div>
      </div>
    </div>
  )
}
