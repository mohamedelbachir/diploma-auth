import Link from "next/link"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <span className="text-xl font-bold text-white">Dip</span>
              </div>
              <span className="text-xl font-semibold">Auth</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Solution complète d&apos;authentification et de génération de
              diplômes sécurisés pour les institutions académiques.
            </p>
          </div>

          <div>
            <h3 className="font-medium">Services</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Tarification
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Fonctionnalités</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/verification"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Vérification de diplôme
                </Link>
              </li>
              <li>
                <Link
                  href="/generation"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Génération de diplôme
                </Link>
              </li>
              <li>
                <Link
                  href="/certification"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Certification blockchain
                </Link>
              </li>
              <li>
                <Link
                  href="/archivage"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Archivage sécurisé
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium">Assistance</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Centre d&apos;aide
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@diplomaauth.com"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  support@diplomaauth.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {currentYear} DiplomaAuth. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
