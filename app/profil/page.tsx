import { redirect } from "next/navigation"
import { Download, User } from "lucide-react"

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

import { getSession } from "../actions"

// Server component to fetch student data from the API
async function getDashboardData() {
  const apiUrl = `${process.env.BACKEND_API_URL}/auth/dashboard/`

  // Get the user session with authentication token
  const session = await getSession()

  if (!session.user || !session.user.token) {
    // User is not authenticated
    return null
  }

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data")
  }

  return res.json()
}

export default async function Profile() {
  const data = await getDashboardData()

  // If no data is returned, user is not authenticated
  if (!data) {
    redirect("/login")
    return null
  }

  const studentProfile = data.student_profile
  const diploma = data.diplomas[0] // Assuming we show the first diploma

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
                    src=""
                    alt={`${diploma.student.first_name} ${diploma.student.last_name}`}
                  />
                  <AvatarFallback className="text-lg">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{`${diploma.student.first_name} ${diploma.student.last_name}`}</h2>
                  <p className="text-muted-foreground">
                    Matricule: {studentProfile.registration_number}
                  </p>
                </div>
              </div>

              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nom</TableCell>
                    <TableCell>{`${diploma.student.first_name} ${diploma.student.last_name}`}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Matricule</TableCell>
                    <TableCell>{studentProfile.registration_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{diploma.student.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Filière</TableCell>
                    <TableCell>{diploma.student.series.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mention</TableCell>
                    <TableCell>{diploma.distinction}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <form action="/api/download" method="POST">
                <input
                  type="hidden"
                  name="diplomaId"
                  value={diploma.reference_number}
                />
                <Button className="w-full" type="submit">
                  <Download className="mr-2" />
                  Télécharger mon diplôme
                </Button>
              </form>
            </CardFooter>
          </Card>

          {/* Additional card with academic details */}
          <Card>
            <CardHeader>
              <CardTitle>Scolarité</CardTitle>
              <CardDescription>Détails de votre parcours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Année d&apos;obtention</h3>
                  <p>{diploma.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Mois d&apos;obtention</h3>
                  <p>{diploma.month}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Spécialisation</h3>
                  <p>{diploma.student.series.specialization.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Numéro de référence</h3>
                  <p>{diploma.reference_number}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Date d&apos;émission</h3>
                  <p>{diploma.issue_date}</p>
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
