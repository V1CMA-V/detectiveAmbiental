import { ResetPasswordForm } from '@/components/forms/reset-password-form'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/auth'
import { Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  console.log('Token:', token)

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidatingToken(false)
        setIsTokenValid(false)
        return
      }

      try {
        await authService.validateToken(token)
        setIsTokenValid(true)
      } catch (error) {
        console.log(error)
        setIsTokenValid(false)
        toast.error('Error', {
          description: 'El token es inválido o ha expirado',
          position: 'bottom-right',
        })
      } finally {
        setIsValidatingToken(false)
      }
    }

    validateToken()
  }, [token])

  return (
    <>
      {isValidatingToken ? (
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Verificando token...</p>
        </div>
      ) : !isTokenValid ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <X className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Token inválido</h2>
            <p className="text-muted-foreground text-sm">
              El enlace que has utilizado no es válido o ha expirado.
              <br />
              Por favor, solicita un nuevo enlace de restablecimiento de
              contraseña.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button asChild className="w-full">
              <Link to="/forgot-password">Solicitar nuevo enlace</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Volver al inicio de sesión</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ResetPasswordForm token={token!} />
      )}
    </>
  )
}
