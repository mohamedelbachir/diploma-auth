import { DocumentScanner } from "@/components/document-scanner"

export default function Home() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2 gradient-blue bg-clip-text text-transparent">
          Vérification et certification de diplômes
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Vérifiez la validité de votre diplôme en ligne
        </p>
      </div>
      <div className="w-full max-w-3xl mx-auto my-5">
        <DocumentScanner
          width="100%"
          height={500}
          scanDuration={2.5}
          scanColor="rgba(0, 180, 0, 0.3)"
        />
      </div>

      <h2 className="text-2xl font-semibold text-center mb-8">
        Comment ça fonctionne
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary">1</span>
          </div>
          <h3 className="font-semibold mb-2">Choisir le service</h3>
          <p className="text-sm text-muted-foreground">
            Choisissez le service que vous souhaitez utiliser
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary">2</span>
          </div>
          <h3 className="font-semibold mb-2">
            Entrez les informations de l'étudiant et les détails du diplôme
          </h3>
          <p className="text-sm text-muted-foreground">
            Entrez les informations de l'étudiant et les détails du diplôme
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-primary">3</span>
          </div>
          <h3 className="font-semibold mb-2">
            Consultez et téléchargez le rapport d'authenticité
          </h3>
          <p className="text-sm text-muted-foreground">
            Consultez et téléchargez le rapport d'authenticité
          </p>
        </div>
      </div>
    </div>
  )
}
