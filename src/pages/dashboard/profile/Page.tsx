import { useAuth } from '@/components/auth-context'
import { UpdatePasswordForm } from '@/components/forms/update-password-form'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { KeyRound, Mail, Shield, User } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()

  console.log('User data in ProfilePage:', user)

  if (!user) {
    return <div>Cargando...</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Información de tu cuenta y permisos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card de Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>Datos básicos de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nombre
              </label>
              <p className="text-lg font-semibold">
                {`${user.firstname} ${user.lastname}`}
              </p>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">
                  Correo Electrónico
                </label>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Permisos y Estado */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permisos y Estado
            </CardTitle>
            <CardDescription>
              Información sobre tu rol y permisos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tipo de Usuario
              </label>
              <div className="mt-1">
                <Badge
                  variant={user.user_type === 'admin' ? 'default' : 'secondary'}
                >
                  {user.user_type === 'admin' ? 'Administrador' : 'General'}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Estado
                </label>
                <div className="mt-1">
                  <Badge variant={user.active ? 'default' : 'destructive'}>
                    {user.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Card para el cambio de contraseña */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Actualiza tu contraseña regularmente para mantener la seguridad de
            tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-3/4 mx-auto">
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
