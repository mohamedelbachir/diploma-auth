"use client"

import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container my-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle />
            Erreur de chargement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Impossible de charger les informations de votre profil. Veuillez
            réessayer plus tard.
          </p>
          <p className="mt-2 text-sm text-destructive">
            {error.message || "Une erreur inattendue s'est produite"}
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={reset}>
            Réessayer
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
