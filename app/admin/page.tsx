import { redirect } from "next/navigation"
import { Download, FileDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSession } from "@/app/actions"

// Function to fetch diploma data from the API
async function getDiplomasData() {
  const apiUrl = `${process.env.BACKEND_API_URL}/diplomas/filter/`

  // Get the user session with authentication token
  const session = await getSession()

  if (!session.user || !session.user.token || session.user.role === "student") {
    // User is not authenticated or not an admin
    redirect("/login")
    return null
  }

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch diplomas data")
  }

  return res.json()
}

export default async function AdminDiplomas() {
  const data = await getDiplomasData()

  // If no data is returned, user is not authenticated or not an admin
  if (!data) {
    redirect("/login")
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gestion des Diplômes</CardTitle>
          <CardDescription>
            Recherchez, filtrez et téléchargez les diplômes des étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un étudiant..." className="pl-8" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les années</SelectItem>
                {Array.from(new Set(data.map((d: any) => d.year)))
                  .sort()
                  .reverse()
                  .map((year: any) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Mention" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les mentions</SelectItem>
                {Array.from(new Set(data.map((d: any) => d.distinction))).map(
                  (distinction: any) => (
                    <SelectItem key={distinction} value={distinction}>
                      {distinction}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <div className="flex-grow flex justify-end">
              <form action="/api/download/bulk" method="POST">
                <Button className="w-full md:w-auto">
                  <FileDown className="mr-2 h-4 w-4" />
                  Télécharger sélection
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox id="select-all" />
                </TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Mention</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((diploma: any) => (
                <TableRow key={diploma.id}>
                  <TableCell>
                    <Checkbox
                      id={`select-${diploma.id}`}
                      name="selectedDiplomas"
                      value={diploma.reference_number}
                    />
                  </TableCell>
                  <TableCell>{diploma.student.registration_number}</TableCell>
                  <TableCell>
                    {diploma.student.first_name} {diploma.student.last_name}
                  </TableCell>
                  <TableCell>{diploma.reference_number}</TableCell>
                  <TableCell>{diploma.year}</TableCell>
                  <TableCell>{diploma.distinction}</TableCell>
                  <TableCell className="text-right">
                    <form
                      action="/api/download"
                      method="POST"
                      className="inline"
                    >
                      <input
                        type="hidden"
                        name="diplomaId"
                        value={diploma.reference_number}
                      />
                      <Button variant="ghost" size="sm" type="submit">
                        <Download className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Affichage de {data.length} diplômes
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
