import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"

const FormatCards = () => {
  const formats = [
    {
      title: "Vérification de diplôme",
      description: "Vérifiez l'authenticité d'un diplôme existant",
      icon: "🔍",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      link: "/verify?type=verification",
    },
    {
      title: "Génération de diplôme",
      description: "Créez des diplômes officiels avec signatures numériques",
      icon: "📜",
      color: "bg-green-100",
      textColor: "text-green-700",
      link: "/profil",
    },
    {
      title: "Archivage sécurisé",
      description: "Stockez vos diplômes dans une base de données chiffrée",
      icon: "🔒",
      color: "bg-orange-100",
      textColor: "text-orange-700",
      link: "/profil",
    },
    {
      title: "Partage de diplôme",
      description: "Partagez vos diplômes avec des tiers de manière sécurisée",
      icon: "🔄",
      color: "bg-gray-100",
      textColor: "text-gray-700",
      link: "/profil",
    },
    {
      title: "Certification",
      description: "Certifiez vos diplômes de manière sécurisée",
      icon: "🔗",
      color: "bg-purple-100",
      textColor: "text-purple-700",
      link: "/verify?type=certification",
    },
    {
      title: "Vérification par QR code",
      description: "Ajoutez un QR code pour une vérification instantanée",
      icon: "📱",
      color: "bg-red-100",
      textColor: "text-red-700",
      link: "/verify?type=verification",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {formats.map((format, index) => (
        <Link href={format.link} key={index}>
          <Card className="h-full hover:shadow-md duration-300 hover:-translate-y-1 transition-transform">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`text-4xl rounded-full p-4 ${format.color}`}>
                  {format.icon}
                </div>
                <h3 className={`text-lg font-semibold ${format.textColor}`}>
                  {format.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default FormatCards
