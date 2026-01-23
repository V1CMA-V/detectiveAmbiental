import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'
import { UpdatePasswordButton } from '../submit-buttons'

const formSchema = z.object({
  password: z
    .string()
    .min(8, 'La contraseña actual debe tener al menos 8 caracteres.'),
  confirmPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
})

export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      if (data.confirmPassword !== data.password) {
        toast.error('Error', {
          description: 'Las contraseñas no coinciden',
          position: 'bottom-right',
        })
        return
      }

      await authService.resetPassword(token, data.password)

      // Limpiar el formulario después del éxito
      form.reset()

      toast.success('Se modificó la contraseña correctamente', {
        description: `Se modificó la contraseña correctamente.`,
        position: 'bottom-right',
      })

      navigate('/login')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al cambiar contraseña'

      toast.error('Error al cambiar contraseña', {
        description: errorMessage,
        position: 'bottom-right',
      })
    }
  }

  return (
    <Card className="w-full max-w-lg ">
      <CardHeader>
        <CardTitle>Restablecer Contraseña</CardTitle>
        <CardDescription>
          Ingresa tu nueva contraseña para restablecer tu cuenta.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 ">
        <form
          id="form-reset-password"
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 md:p-8 space-y-4"
        >
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
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

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirmar Contraseña
                  </FieldLabel>
                  <Input
                    {...field}
                    id="confirmPassword"
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
              <UpdatePasswordButton
                isSubmitting={form.formState.isSubmitting}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
