"use client"

import Link from "next/link"
import { FileWarning } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DiplomaNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="mb-8 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent text-center">
        Diplôme Non Trouvé
      </h1>

      {/* Message Card */}
      <Card className="w-full max-w-md border border-amber-200 bg-amber-50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-4">
            <FileWarning className="h-16 w-16 text-amber-500" />
            <div className="absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-amber-200" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-amber-700">
            Diplôme introuvable
          </h3>
          <p className="mb-2 text-amber-600">
            Le diplôme que vous recherchez n&apos;existe pas ou n&apos;est pas
            disponible.
          </p>
          <p className="text-gray-600">
            Veuillez vérifier l&apos;identifiant du diplôme et réessayer.
          </p>
        </CardContent>
      </Card>

      {/* Button */}
      <div className="mt-8">
        <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white text-base px-6 py-3 shadow-lg">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  )
}
