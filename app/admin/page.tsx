import { redirect } from "next/navigation"
import { Download, FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getSession } from "@/app/actions"

import DiplomaFilters from "./DiplomaFilters"

interface Student {
  id: number | string
  registration_number: string
  first_name: string
  last_name: string
  // Add other student fields if necessary
}

interface Diploma {
  id: number | string
  student: Student
  month: number
  year: number | string
  distinction: string
  reference_number: string
  issue_date: string
}

// Function to fetch ALL diploma data from the API
async function getAllDiplomasData(): Promise<Diploma[] | null> {
  const apiUrl = `${process.env.BACKEND_API_URL}/diplomas/filter/`
  const session = await getSession()

  // Ensure only admins can access this data
  if (!session.user || !session.user.token || session.user.role === "student") {
    redirect("/login")
    // redirect() throws an error, so execution stops here.
    // To be extremely explicit, you could add 'return null;' but it's unreachable.
  }

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${session.user.token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    // Log the error for server-side inspection
    console.error(
      `Failed to fetch diplomas data: ${res.status} ${res.statusText}`
    )
    // Throw an error that can be caught by an error boundary or Next.js default error page
    throw new Error("Impossible de récupérer les données des diplômes.")
  }
  try {
    const diplomas = await res.json()
    return diplomas as Diploma[]
  } catch (e) {
    console.error("Failed to parse diplomas JSON:", e)
    throw new Error("Erreur lors du traitement des données des diplômes.")
  }
}

export default async function AdminDiplomasPage({
  searchParams,
}: {
  searchParams: { search?: string; year?: string; distinction?: string }
}) {
  const allDiplomas = await getAllDiplomasData()

  if (!allDiplomas) {
    // This case should ideally be handled by redirect or error in getAllDiplomasData
    // but as a fallback:
    return (
      <p className="container mx-auto py-10">
        Chargement des diplômes impossible ou accès refusé.
      </p>
    )
  }

  const searchTerm = searchParams.search?.toLowerCase() || ""
  const selectedYear = searchParams.year || "all"
  const selectedDistinction = searchParams.distinction || "all"

  const filteredDiplomas = allDiplomas.filter((diploma) => {
    const studentInfo =
      `${diploma.student.first_name} ${diploma.student.last_name} ${diploma.student.registration_number}`.toLowerCase()
    const matchesSearch = searchTerm
      ? studentInfo.includes(searchTerm) ||
        diploma.reference_number.toLowerCase().includes(searchTerm)
      : true
    const matchesYear =
      selectedYear === "all" ? true : diploma.year.toString() === selectedYear
    const matchesDistinction =
      selectedDistinction === "all"
        ? true
        : diploma.distinction === selectedDistinction
    return matchesSearch && matchesYear && matchesDistinction
  })

  const uniqueYears = Array.from(
    new Set(allDiplomas.map((d) => d.year.toString()))
  ).sort((a, b) => parseInt(b) - parseInt(a)) // Sort numerically descending

  const uniqueDistinctions = Array.from(
    new Set(allDiplomas.map((d) => d.distinction).filter(Boolean))
  ).sort()

  return (
    <div className="container mx-auto py-10">
      <DiplomaFilters
        currentSearch={searchParams.search || ""} // Pass original search param for controlled input
        currentYear={selectedYear}
        currentDistinction={selectedDistinction}
        allYears={uniqueYears}
        allDistinctions={uniqueDistinctions}
      />

      <form action="/api/download/bulk" method="POST">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Liste des Diplômes</CardTitle>
            <Button type="submit" className="w-full md:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Télécharger la sélection
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    {/* The "select-all" checkbox functionality requires client-side JS */}
                    <Checkbox id="select-all" aria-label="Select all rows" />
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
                {filteredDiplomas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      Aucun diplôme ne correspond à vos critères de recherche.
                    </TableCell>
                  </TableRow>
                )}
                {filteredDiplomas.map((diploma) => (
                  <TableRow key={diploma.id}>
                    <TableCell>
                      <Checkbox
                        id={`select-${diploma.id}`}
                        name="selectedDiplomas"
                        value={diploma.id.toString()}
                        aria-label={`Select diploma ${diploma.reference_number}`}
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
                      {/* Individual download form */}
                      <form
                        action="/api/download"
                        method="POST"
                        className="inline"
                      >
                        <input
                          type="hidden"
                          name="diplomaId"
                          value={diploma.id}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          aria-label="Télécharger le diplôme"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Affichage de {filteredDiplomas.length} sur {allDiplomas.length}{" "}
              diplômes.
            </div>
            {/* Pagination can be added here if needed */}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
