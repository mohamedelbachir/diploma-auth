"use client"

import { useState } from "react"
import { Download, User } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Footer from "@/components/Footer"
import Header from "@/components/Header"

// Mock user data - in a real app, this would come from an authentication system
const studentData = {
  id: "ST12345",
  name: "Marie Dupont",
  matricule: "MAT2022-1234",
  domaines: ["Informatique", "Sciences des données"],
  filiere: "Ingénierie logicielle",
  avatar: null, // Optional profile picture URL
  diplomaUrl: null, // This would be a real URL in a production app
}

const Profile = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)

    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      toast.success("Votre diplôme a été téléchargé avec succès")
    }, 2000)
  }

  return (
    <div className="my-12">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Student info card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Détails de votre profil académique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={studentData.avatar || ""}
                    alt={studentData.name}
                  />
                  <AvatarFallback className="text-lg">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{studentData.name}</h2>
                  <p className="text-muted-foreground">
                    Matricule: {studentData.matricule}
                  </p>
                </div>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nom</TableCell>
                    <TableCell>{studentData.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Matricule</TableCell>
                    <TableCell>{studentData.matricule}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Domaines</TableCell>
                    <TableCell>{studentData.domaines.join(", ")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Filière</TableCell>
                    <TableCell>{studentData.filiere}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  "Téléchargement en cours..."
                ) : (
                  <>
                    <Download className="mr-2" />
                    Télécharger mon diplôme
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Additional cards can be added here */}
          <Card>
            <CardHeader>
              <CardTitle>Scolarité</CardTitle>
              <CardDescription>Détails de votre parcours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Année d&apos;obtention</h3>
                  <p>2023</p>
                </div>
                <div>
                  <h3 className="font-semibold">Établissement</h3>
                  <p>Université de Paris</p>
                </div>
                <div>
                  <h3 className="font-semibold">Statut du diplôme</h3>
                  <p className="text-green-600 font-medium">
                    Vérifié et certifié
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile
