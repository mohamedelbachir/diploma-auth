export default function DiplomaLoading() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl border border-gray-100 transition-all">
        <div className="mb-8 flex items-center justify-center">
          <h1 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
            Détails du Diplôme
          </h1>
        </div>

        <div className="flex w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all">
          <div className="relative flex items-center justify-center">
            <div className="h-24 w-24 relative">
              <svg
                className="animate-spin text-teal-500"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 h-8 w-8 rounded-full bg-emerald-100 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 h-6 w-6 rounded-full bg-teal-200 animate-pulse delay-300"></div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-xl font-medium text-gray-900">Chargement du diplôme...</h3>
            <p className="mt-2 text-gray-500">Veuillez patienter pendant le traitement du document.</p>
          </div>

          {/* Enhanced skeleton for diploma preview */}
          <div className="mt-8 w-full space-y-4">
            <div className="h-8 w-3/4 mx-auto animate-pulse rounded-lg bg-gray-200"></div>
            <div className="h-[500px] w-full animate-pulse rounded-xl bg-gradient-to-b from-gray-200 to-gray-300 shadow-inner relative overflow-hidden">
              {/* Decorative elements to make it look like a document */}
              <div className="absolute top-8 left-8 right-8 h-4 bg-white opacity-20 rounded"></div>
              <div className="absolute top-16 left-8 right-8 h-4 bg-white opacity-20 rounded"></div>
              <div className="absolute top-24 left-8 right-8 h-4 bg-white opacity-20 rounded"></div>
              <div className="absolute top-36 left-8 right-40 h-20 bg-white opacity-10 rounded"></div>
              <div className="absolute bottom-8 right-8 h-16 w-16 bg-white opacity-30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
