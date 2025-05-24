/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client"
import { Button } from "@/components/ui/button";
import React from "react"
import { Download } from "lucide-react";
interface Props {
  id: string
}

export default function DownloadButton({ id }: Props) {
  async function handleDownload() {
    try {
      const formData = new FormData()
      formData.append("diplomaId", id)

      const response = await fetch("/api/v-download", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Échec du téléchargement du diplôme.")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `diplome-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert("Une erreur est survenue lors du téléchargement.")
      console.error("Download error:", err)
    }
  }

  return (
     <Button onClick={handleDownload} className="mt-6 text-lg gap-2" size="lg">
      <Download className="w-5 h-5" />
      Télécharger le Diplôme
    </Button>
  )
}
