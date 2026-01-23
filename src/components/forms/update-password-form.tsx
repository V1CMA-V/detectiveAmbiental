import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { UpdatePasswordButton } from '../submit-buttons'

const formSchema = z.object({
  current_password: z
    .string()
    .min(8, 'La contraseña actual debe tener al menos 8 caracteres.'),
  new_password: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
})

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authService.updatePassword({
        current_password: data.current_password,
        new_password: data.new_password,
      })

      // Limpiar el formulario después del éxito
      form.reset()

      toast.success('Cambio de contraseña exitoso', {
        description: `Se actualizó correctamente tu contraseña`,
        position: 'bottom-right',
      })
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
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="p-0 ">
        <CardContent className="p-0 ">
          <form
            id="form-update-password"
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 md:p-8"
          >
            <FieldGroup>
              <Controller
                name="current_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="current_password">
                      Contraseña Actual
                    </FieldLabel>
                    <Input
                      {...field}
                      id="current_password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="**********"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="new_password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new_password">
                      Contraseña Nueva
                    </FieldLabel>

                    <Input
                      {...field}
                      id="new_password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="**********"
                      autoComplete="new-password"
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
    </div>
  )
}
