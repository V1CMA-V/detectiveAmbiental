import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import z from 'zod'
import { CreateCategoryButton } from '../submit-buttons'

const formSchema = z.object({
  category: z.string(),
})

export function AddCategoryForm() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authService.addCategory(data.category)

      // Limpiar el formulario después del éxito
      form.reset()

      toast.success('Se creó correctamente la categoría', {
        description: `Se creó correctamente la categoría ${data.category}`,
        position: 'bottom-right',
      })

      // Recargar la página actual usando React Router
      setTimeout(() => {
        navigate(0)
      }, 1000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al crear la categoría'

      toast.error('Error al crear la categoría', {
        description: errorMessage,
        position: 'bottom-right',
      })
    }
  }

  return (
    <form
      id="form-create-category"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <Controller
        name="category"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="category">Nueva Categoría</FieldLabel>
            <Input
              {...field}
              id="category"
              type="text"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field>
        <CreateCategoryButton isSubmitting={form.formState.isSubmitting} />
      </Field>
    </form>
  )
}
