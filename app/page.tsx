import Link from "next/link"
import { Check, LucideUpload } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import FeatureCards from "@/components/FeatureCards"
import FormatCards from "@/components/FormatCards"
import Student from "@/assets/college-degree.jpeg"
const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Features */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                DiplomaAI
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-gray-800">
                Authentification et génération de diplômes sécurisés
              </h2>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary p-1 mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">
                    Générez des diplômes officiels avec signature numérique
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary p-1 mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">
                    Vérifiez l&apos;authenticité des diplômes en quelques clics
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary p-1 mt-0.5">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-gray-700">
                    Stockage sécurisé dans une base de données chiffrée
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500 space-y-1 pt-4">
                <p>+237 699 000 000 | Support technique 24/7</p>
                <p>Assistance par email disponible tous les jours</p>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="#2e7d32"
                        stroke="none"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">
                    258 avis provenant de
                  </span>
                  <span className="font-semibold text-sm">
                    universités partenaires
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Upload Box */}
            <div>
              <Card className="border-dashed">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-4">
                      Vérifiez ou générez un diplôme
                    </h3>

                    <div className="flex justify-center mb-6 p-5 rounded-md bg-gray-100">
                      <LucideUpload className="h-32" />
                    </div>

                    <p className="text-lg mb-3">
                      Déposez votre fichier de diplôme ici
                    </p>

                    <div className="flex items-center justify-center mb-4">
                      <div className="border-t border-gray-300 flex-grow"></div>
                      <span className="px-3 text-gray-500">OU</span>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>

                    <Button
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-4"
                      size="lg"
                      asChild
                    >
                      <Link href="/verify?type=verification">
                        Vérifier l&apos;authenticité
                      </Link>
                    </Button>

                    <p className="text-sm text-gray-500 mt-4">
                      Importez votre diplôme au format PDF (5 Mo max.)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Formats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Services de gestion de diplômes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez parmi nos différents services d&apos;authentification
              et de génération
            </p>
          </div>

          <FormatCards />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Illustration */}
            <div className="flex justify-center">
              <Image
                src={Student}
                alt="How it works"
                className="max-w-full h-auto"
              />
            </div>

            {/* Right side - Steps */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Comment ça marche ?
              </h2>
              <p className="text-lg mb-8 text-gray-700">
                Authentifiez ou générez des diplômes officiels en quelques
                étapes simples :
              </p>

              <div className="relative flex flex-col">
                {/* Step 1 */}
                <div className="flex mb-6">
                  <div className="relative flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-lg z-10">
                      1
                    </div>
                    <div className="absolute top-8 bottom-0 w-[2px] border-l-2 border-dashed border-blue-300 h-full"></div>
                  </div>
                  <div className="ml-4 pt-1">
                    <p className="text-lg font-medium text-gray-800">
                      Importez le diplôme à vérifier ou à certifier
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex mb-6">
                  <div className="relative flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-lg z-10">
                      2
                    </div>
                    <div className="absolute top-8 bottom-0 w-[2px] border-l-2 border-dashed border-blue-300 h-full"></div>
                  </div>
                  <div className="ml-4 pt-1">
                    <p className="text-lg font-medium text-gray-800">
                      choisir soit de verifier ou certifier
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-lg z-10">
                      3
                    </div>
                  </div>
                  <div className="ml-4 pt-1">
                    <p className="text-lg font-medium text-gray-800">
                      Recevez le résultat de vérification ou votre diplôme
                      certifié généré
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modify PDF Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Authentifiez un diplôme dès maintenant
            </h2>
            <p className="text-lg mb-8 text-gray-600">
              Notre système sécurisé vérifie l&apos;authenticité des diplômes
              instantanément. Importez un document pour commencer le processus
              de vérification.
            </p>
            <Button
              size="lg"
              className="px-8 py-6 text-lg bg-red-500 hover:bg-red-600 text-white"
              asChild
            >
              <Link href="/verify">Commencer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Pourquoi choisir DiplomaAI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Notre solution d&apos;authentification et de génération offre de
              nombreux avantages
            </p>
          </div>

          <FeatureCards />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-blue opacity-10"></div>
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Commencez à verifié ou certifié vos diplômes aujourd&apos;hui
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Aucune inscription requise pour vérifier l&apos;authenticité.
              Essayez notre service maintenant !
            </p>
            <Button size="lg" className="px-8" asChild>
              <Link href="/verify">Démarrer</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Index
