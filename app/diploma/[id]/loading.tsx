"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DiplomaLoading() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <h1 className="mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
        Détails du Diplôme
      </h1>

      {/* Loading card */}
      <Card className="w-full max-w-md border border-gray-200 bg-gray-50 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative mb-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="absolute -left-4 -top-4 h-8 w-8 animate-pulse rounded-full bg-secondary/20" />
            <div className="absolute -bottom-4 -right-4 h-6 w-6 animate-pulse rounded-full bg-primary/20 delay-300" />
          </div>

          <p className="text-sm text-gray-600 text-center">
            Chargement des informations du diplôme en cours...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
