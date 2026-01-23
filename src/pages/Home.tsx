import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TreeDeciduous, User, UserCheck2Icon } from 'lucide-react'
import { Link } from 'react-router'

export default function HomePage() {
  const urlPageOficial =
    'https://desarrollosustentable.buap.mx/content/coordinaci%C3%B3n-de-gesti%C3%B3n-ambiental'

  const informationCards = [
    {
      title: 'Visualizar Reportes',
      description:
        'Revisa y administra los reportes de incidentes ambientales enviados por la comunidad universitaria.',
    },

    {
      title: 'Gestión de Usuarios',
      description:
        'Administra los perfiles de usuarios, asigna roles y controla el acceso a diferentes secciones del dashboard.',
    },
    {
      title: 'Estadísticas y Análisis',
      description:
        'Visualiza gráficos y estadísticas sobre los incidentes reportados para identificar tendencias y áreas de mejora.',
    },
  ]

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center gap-12 px-4 md:px-8 lg:px-16 py-20">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Bienvenidos al Detective Ambiental
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Para la gestión ambiental de la BUAP, impulsado por alumnos y
                  coordinadores especializados.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <User className="w-5 h-5" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/validate-account">
                  <Button
                    variant={'outline'}
                    size="lg"
                    className="text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <UserCheck2Icon className="w-5 h-5" />
                    Validar Cuenta
                  </Button>
                </Link>

                <Link
                  to={urlPageOficial}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    size="lg"
                    variant={'outline'}
                    className="text-lg flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                  >
                    <TreeDeciduous className="w-5 h-5" />
                    Página Oficial
                  </Button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-linear-to-tr from-[#03294E]/20 to-transparent rounded-3xl blur-3xl"></div>
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500">
                <img
                  src="/buap.webp"
                  alt="BUAP Logo"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto space-y-8 mt-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Gestiona tu Dashboard
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                En este Dashboard podrás gestionar todo el contenido relacionado
                con la plataforma Detective Ambiental.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {informationCards.map(
                (
                  {
                    title,
                    description,
                  }: { title: string; description: string },
                  idx,
                ) => (
                  <Card
                    key={idx}
                    className="hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 group"
                  >
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
