"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-center text-3xl font-bold text-transparent">
        Détails du Diplôme
      </h1>

      {/* Error card */}
      <Card className="w-full max-w-md border-red-200 bg-red-50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-4">
            <AlertTriangle className="h-16 w-16 text-red-500" />
            <div className="absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full bg-red-200" />
          </div>

          <h3 className="mb-2 text-xl font-semibold text-red-700">
            Erreur lors du traitement du diplôme
          </h3>
          <p className="mb-6 text-red-600">
            Nous n&apos;avons pas pu récupérer les informations du diplôme
            demandé. Veuillez réessayer ultérieurement.
          </p>

          <Button asChild className="bg-red-500 hover:bg-red-600">
            <Link href="/">
              Retour à l&apos;accueil
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
