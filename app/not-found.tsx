import Link from "next/link"

import { Button } from "@/components/ui/button"

const NotFound = () => {
  return (
    <>
      <div className="text-center px-4 my-12">
        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl font-semibold mb-4">Page non trouvée</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Button size="lg" asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </>
  )
}

export default NotFound
