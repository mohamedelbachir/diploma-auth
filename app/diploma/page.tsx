"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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

const formSchema = z.object({
  diplomaID: z.string().min(1, {
    message: "Diploma ID is required",
  }),
})

export default function DiplomaPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diplomaID: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/diploma/${values.diplomaID}`)
  }

  return (
    <div className="container mx-auto my-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Entrer ID de votre diplome</CardTitle>
          <CardDescription>
            Saisissez l&apos;ID de votre diplôme pour le vérifier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="diplomaID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diploma ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Diploma ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Vérifier le Diplome
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}