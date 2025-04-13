"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { login } from "../actions"

const formSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
})

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("password", values.password)
      const r = await login(formData)
      if (r.error) {
        setError(r.error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit(form.getValues())
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (error !== "") setError("")
  }

  return (
    <>
      <div className="mx-auto max-w-md space-y-6 py-12 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Se connecter</h1>
          <p className="text-gray-500">
            Entrez vos informations de connexion ci-dessous
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemple@domaine.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        handleChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
        </Form>

        {/* <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Mot de passe oublié?
          </Link>
        </div> */}

        {/* <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full">
            Continuer avec Google
          </Button>
        </div>

        <div className="text-center text-sm">
          <span className="text-gray-500">
            Vous n'avez pas encore de compte?
          </span>{" "}
          <Link href="/signup" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </div> */}
      </div>
    </>
  )
}

export default Login
