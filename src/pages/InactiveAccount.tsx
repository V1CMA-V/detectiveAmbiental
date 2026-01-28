import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useNavigate } from 'react-router'

export default function InactiveAccount() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()

    navigate('/login')
  }

  return (
    <section className="h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-red-400">
            Cuenta Inactiva
          </CardTitle>
          <CardDescription>
            Lo siento {user?.firstname} parace que su cuenta con el correo{' '}
            {user?.email}, ha sido desactivada. <br />
            Por favor, póngase en contacto con soporte para más información.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <Button asChild>
            <a href="mailto:soporte@example.com">Contactar Soporte</a>
          </Button>
          <Button variant="outline" className="ml-4" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
