import { useAuth } from '@/components/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'
import { LogginButton } from '../submit-buttons'

const formSchema = z.object({
  email: z.string().email('Correo inválido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const user = await login({
        email: data.email,
        password: data.password,
      })

      toast.success('Inicio de sesión exitoso', {
        description: `Bienvenido: ${user.firstname}`,
        position: 'bottom-right',
      })

      // Redirigir al usuario según su tipo
      // Puedes personalizar la ruta según tus necesidades
      navigate('/dashboard')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al iniciar sesión'

      toast.error('Error al iniciar sesión', {
        description: errorMessage,
        position: 'bottom-right',
      })
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            id="form-login"
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Detective Ambiental</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia sesión para continuar
                </p>
              </div>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Correo</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="a@buap.mx"
                      // autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <Link
                        to="/reset-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <LogginButton isSubmitting={form.formState.isSubmitting} />
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/lobito.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover "
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
