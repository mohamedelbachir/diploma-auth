"use client"

import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { useToast } from "@/hooks/use-toast"
import ConversionOptions, {
  ConversionFormat,
} from "@/components/ConversionOptions"
import ConversionResult from "@/components/ConversionResult"
import FileUpload from "@/components/FileUpload"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

const VerifyPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [isConverted, setIsConverted] = useState<boolean>(false)
  const [selectedFormat, setSelectedFormat] = useState<ConversionFormat>("word")
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Get the operation type from the URL query parameter
  const getOperationType = () => {
    const type = searchParams.get("type")
    if (type) return type

    // Fallback to path-based detection for backward compatibility
    const path = pathname
    if (path.includes("verification")) return "verification"
    if (path.includes("generation")) return "generation"
    if (path.includes("archivage")) return "archivage"
    if (path.includes("partage")) return "partage"
    if (path.includes("certification")) return "certification"
    if (path.includes("qrcode")) return "qrcode"

    // For backward compatibility with old routes
    if (path.includes("pdf-to-word")) return "verification"
    if (path.includes("pdf-to-excel")) return "generation"
    if (path.includes("pdf-to-ppt")) return "certification"
    if (path.includes("pdf-to-text")) return "archivage"
    if (path.includes("pdf-to-html")) return "partage"
    if (path.includes("pdf-to-jpg")) return "qrcode"

    return "verification" // Default
  }

  // Get document ID if provided in query params
  const documentId = searchParams.get("id")

  // Service display names map
  const serviceDisplayNames: Record<string, string> = {
    verification: "Vérification de diplôme",
    generation: "Génération de diplôme",
    archivage: "Archivage sécurisé",
    partage: "Partage de diplôme",
    certification: "Certification blockchain",
    qrcode: "Vérification par QR code",
  }

  const operationType = getOperationType()
  const pageTitle =
    serviceDisplayNames[operationType] || "Vérification de diplôme"

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setIsConverted(false)
  }

  const handleConvert = (format: ConversionFormat) => {
    if (!file) return

    setSelectedFormat(format)
    setIsConverting(true)

    // Simulate processing
    setTimeout(() => {
      setIsConverting(false)
      setIsConverted(true)
      toast({
        title: "Traitement terminé",
        description: `Votre diplôme a été ${
          operationType === "verification"
            ? "vérifié"
            : operationType === "generation"
            ? "généré"
            : operationType === "archivage"
            ? "archivé"
            : operationType === "partage"
            ? "préparé pour le partage"
            : operationType === "certification"
            ? "certifié avec blockchain"
            : "doté d'un QR code"
        }`,
      })
    }, 2000) // Simulate 2 second processing time
  }

  const handleDownload = () => {
    // In a real app, this would download the result
    toast({
      title: "Téléchargement commencé",
      description: "Votre document sera téléchargé sous peu",
    })
  }

  const handleNewConversion = () => {
    setFile(null)
    setIsConverted(false)
  }

  // Custom descriptions based on operation type
  const getServiceDescription = () => {
    switch (operationType) {
      case "verification":
        return "Vérifiez l'authenticité de n'importe quel diplôme en le téléchargeant. Notre système analysera le document et confirmera sa validité."
      case "generation":
        return "Créez des diplômes officiels avec signatures numériques sécurisées pour votre institution académique."
      case "archivage":
        return "Stockez vos diplômes de manière sécurisée dans notre base de données chiffrée pour un accès facile à tout moment."
      case "partage":
        return "Partagez vos diplômes avec des employeurs ou d'autres institutions de manière sécurisée et vérifiable."
      case "certification":
        return "Ajoutez une couche de sécurité supplémentaire en certifiant vos diplômes avec la technologie blockchain."
      case "qrcode":
        return "Générez un QR code unique pour chaque diplôme permettant une vérification instantanée de son authenticité."
      default:
        return "Sécurisez et authentifiez vos diplômes avec notre solution complète."
    }
  }

  // Get step descriptions based on operation type
  const getStepDescriptions = () => {
    switch (operationType) {
      case "verification":
        return [
          "Téléchargez le diplôme à vérifier",
          "Choisissez les options de vérification",
          "Obtenez le rapport de vérification",
        ]
      case "generation":
        return [
          "Téléchargez le modèle ou choisissez un template",
          "Ajoutez les informations du diplômé",
          "Générez et téléchargez le diplôme officiel",
        ]
      case "certification":
        return [
          "Téléchargez le diplôme à certifier",
          "Choisissez le type de certification blockchain",
          "Obtenez votre diplôme certifié avec preuve blockchain",
        ]
      default:
        return [
          "Téléchargez votre document",
          "Choisissez les options disponibles",
          "Téléchargez ou partagez le résultat",
        ]
    }
  }

  const stepDescriptions = getStepDescriptions()

  return (
    <>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2 gradient-blue bg-clip-text text-transparent">
            {pageTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {getServiceDescription()}
          </p>
          {documentId && (
            <p className="text-sm text-muted-foreground mt-2">
              Document ID: {documentId}
            </p>
          )}
        </div>

        {!isConverted ? (
          <>
            <FileUpload onFileSelect={handleFileSelect} />

            <ConversionOptions
              onConvert={handleConvert}
              isConverting={isConverting}
              isFileSelected={!!file}
            />
          </>
        ) : (
          <ConversionResult
            fileName={file ? file.name : "diplome.pdf"}
            format={selectedFormat}
            onDownload={handleDownload}
            onNewConversion={handleNewConversion}
          />
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Comment ça fonctionne
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">{stepDescriptions[0]}</h3>
              <p className="text-sm text-muted-foreground">
                {operationType === "verification"
                  ? "Déposez le document PDF du diplôme ou cliquez pour parcourir vos fichiers"
                  : operationType === "generation"
                  ? "Choisissez parmi nos modèles ou téléchargez le vôtre"
                  : "Téléchargez votre document PDF ou cliquez pour parcourir vos fichiers"}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">{stepDescriptions[1]}</h3>
              <p className="text-sm text-muted-foreground">
                {operationType === "verification"
                  ? "Sélectionnez les paramètres de vérification souhaités"
                  : operationType === "generation"
                  ? "Entrez les informations de l'étudiant et les détails du diplôme"
                  : "Configurez les options selon vos besoins"}
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">{stepDescriptions[2]}</h3>
              <p className="text-sm text-muted-foreground">
                {operationType === "verification"
                  ? "Consultez et téléchargez le rapport d'authenticité"
                  : operationType === "generation"
                  ? "Téléchargez votre diplôme officiel prêt à l'emploi"
                  : operationType === "certification"
                  ? "Obtenez votre certificat avec la preuve blockchain"
                  : "Téléchargez ou partagez le résultat final"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VerifyPage
