'use client'

import React from "react"

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
    <button
      onClick={handleDownload}
      className="mt-6 rounded-lg bg-primary px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
    >
      Télécharger le Diplôme
    </button>
  )
}
