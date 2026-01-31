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
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { CreateUserAdminButton } from '../submit-buttons'

const formSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  password: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
  email: z
    .string()
    .email('Correo electrónico inválido')
    .refine(
      (email) =>
        email.endsWith('@correo.buap.mx') || email.endsWith('@alumno.buap.mx'),
      'El correo debe ser de dominio @correo.buap.mx o @alumno.buap.mx',
    ),
})

export function NewUserAdminForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      password: '',
      email: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authService.createUserAdmin({
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        email: data.email,
      })

      // Limpiar el formulario después del éxito
      form.reset()

      toast.success('Se creó correctamente el usuario administrador', {
        description: `Se creó correctamente el usuario administrador, recuerda que tiene que validar su correo electrónico.`,
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
    <Card className="p-0 ">
      <CardContent className="p-0 ">
        <form
          id="form-create-user-admin"
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-6 md:p-8 space-y-4"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FieldGroup>
            <div className="flex items-center gap-3">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="firstname">Nombre</FieldLabel>
                    <Input
                      {...field}
                      id="firstname"
                      type="text"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="lastname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="lastname">Apellido</FieldLabel>

                    <Input
                      {...field}
                      id="lastname"
                      type="text"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
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

            <Field>
              <CreateUserAdminButton
                isSubmitting={form.formState.isSubmitting}
              />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
