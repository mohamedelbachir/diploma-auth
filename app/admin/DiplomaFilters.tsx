"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DiplomaFiltersProps {
  currentSearch: string
  currentYear: string
  currentDistinction: string
  allYears: string[]
  allDistinctions: string[]
}

export default function DiplomaFilters({
  currentSearch,
  currentYear,
  currentDistinction,
  allYears,
  allDistinctions,
}: DiplomaFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const existingSearchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [year, setYear] = useState(currentYear)
  const [distinction, setDistinction] = useState(currentDistinction)

  useEffect(() => {
    setSearchTerm(currentSearch)
  }, [currentSearch])

  useEffect(() => {
    setYear(currentYear)
  }, [currentYear])

  useEffect(() => {
    setDistinction(currentDistinction)
  }, [currentDistinction])

  const navigateWithFilters = (newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const handleYearChange = (value: string) => {
    setYear(value)
    const params = new URLSearchParams(existingSearchParams.toString())
    if (value !== "all") {
      params.set("year", value)
    } else {
      params.delete("year")
    }
    navigateWithFilters(params)
  }

  const handleDistinctionChange = (value: string) => {
    setDistinction(value)
    const params = new URLSearchParams(existingSearchParams.toString())
    if (value !== "all") {
      params.set("distinction", value)
    } else {
      params.delete("distinction")
    }
    navigateWithFilters(params)
  }

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const params = new URLSearchParams(existingSearchParams.toString())
    if (searchTerm) {
      params.set("search", searchTerm)
    } else {
      params.delete("search")
    }
    navigateWithFilters(params)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Gestion des Diplômes</CardTitle>
        <CardDescription>
          Recherchez, filtrez et téléchargez les diplômes des étudiants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Matricule, Nom, Réf..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={year} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Année" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les années</SelectItem>
              {allYears.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={distinction} onValueChange={handleDistinctionChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Mention" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les mentions</SelectItem>
              {allDistinctions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full md:w-auto">
            Rechercher
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
