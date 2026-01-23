import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'

const formSchema = z.object({
  email: z.string().email('Correo inválido.'),
})

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authService.forgotPassword(data.email)

      toast.success('Correo enviado', {
        description:
          'Revisa tu bandeja de entrada para restablecer tu contraseña',
        position: 'bottom-right',
      })

      // Redirigir después de un momento
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al enviar el correo'

      toast.error('Error', {
        description: errorMessage,
        position: 'bottom-right',
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-lg">
      <CardContent className="p-6 md:p-8">
        <form id="form-forgot-password" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
              <p className="text-muted-foreground text-balance text-sm">
                Ingresa tu correo electrónico y te enviaremos instrucciones para
                restablecer tu contraseña
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="m@ejemplo.com"
                    required
                  />
                )}
              />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
            <Field>
              {form.formState.isSubmitting ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </Button>
              ) : (
                <Button className="w-full" type="submit">
                  Enviar instrucciones
                </Button>
              )}
            </Field>
            <div className="text-center text-sm">
              ¿Recordaste tu contraseña?{' '}
              <Link to="/login" className="underline underline-offset-4">
                Inicia sesión
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
