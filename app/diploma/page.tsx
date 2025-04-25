"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QrScanner from "@/components/QrScanner"

const formSchema = z.object({
  diplomaID: z
    .string()
    .min(1, { message: "Diploma ID is required" })
    .startsWith("DIP-2023-STU2025-", {
      message:
        "Identifiant du diplôme invalide. Doit commencer par DIP-2023-STU2025-",
    }),
})

export default function DiplomaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get("type") || "manual")

  //const [scanSuccess, setScanSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diplomaID: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/diploma/${values.diplomaID}`)
  }

  function handleScanResult(diplomaURL: string) {
    //setScanSuccess(true)
    const diplomaId = diplomaURL.split("/").pop()
    form.setValue("diplomaID", diplomaId ?? "")
    // setTimeout(() => {
    //   //setShowScanner(false)
    //   form.handleSubmit(onSubmit)()
    // }, 200)
  }

  return (
    <div className="container mx-auto my-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Vérifier votre diplôme</CardTitle>
          <CardDescription>
            Saisissez l&apos;ID de votre diplôme ou scannez le QR code pour le
            vérifier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="manual"
            value={tab}
            className="w-full"
            onValueChange={(value: string) => {
              setTab(value)
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">Saisie Manuelle</TabsTrigger>
              <TabsTrigger value="scan">Scanner QR Code</TabsTrigger>
            </TabsList>
            <TabsContent value="scan">
              <QrScanner
                onResult={handleScanResult}
                onClose={() => setTab("manual")}
              />
            </TabsContent>

            <TabsContent value="manual">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="diplomaID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID du Diplôme</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="DIP-2023-STU2025-"
                            {...field}
                            className={
                              //scanSuccess
                              //  ? "border-green-500 ring-green-500"
                              //  : ""
                              ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Vérifier le Diplôme
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
