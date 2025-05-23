export default function DiplomaLoading() {
  return (
    <>
      <div className="mb-8 flex w-full items-center justify-center">
        <h1 className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-center text-3xl font-bold text-transparent">
          Détails du Diplôme
        </h1>
      </div>

      <div className="flex w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-8 transition-all">
        <div className="relative flex items-center justify-center">
          <div className="relative size-24">
            <svg
              className="animate-spin text-teal-500"
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

            {/* Decorative elements */}
            <div className="absolute -left-4 -top-4 size-8 animate-pulse rounded-full bg-emerald-100"></div>
            <div className="absolute -bottom-4 -right-4 size-6 animate-pulse rounded-full bg-teal-200 delay-300"></div>
          </div>
        </div>
      </div>
    </>
  )
}
