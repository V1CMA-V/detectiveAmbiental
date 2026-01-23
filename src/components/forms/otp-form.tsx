import { zodResolver } from '@hookform/resolvers/zod'
import { TreeDeciduous } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { authService } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from 'react-router'

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'El código debe contener solo números'),
})

export function OTPForm({ className, ...props }: React.ComponentProps<'div'>) {
  const navigate = useNavigate()

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    try {
      await authService.validateAccount(data.otp)
      toast.success('Cuenta verificada correctamente')
      navigate('/login')
    } catch (error) {
      console.error('Error al verificar OTP:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'El código ingresado no es válido. Por favor, verifica e intenta nuevamente.',
      )
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <TreeDeciduous className="size-6" />
              </div>
              <span className="sr-only">Detective Ambiental</span>
            </Link>
            <h1 className="text-xl font-bold">
              Ingresa el código de verificación
            </h1>
            <FieldDescription>
              Te enviamos un código de 6 dígitos a tu dirección de correo
              electrónico
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verificación OTP
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              containerClassName="gap-4"
              onChange={(value) =>
                setValue('otp', value, { shouldValidate: true })
              }
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <FieldDescription className="text-center text-destructive">
                {errors.otp.message}
              </FieldDescription>
            )}
            <FieldDescription className="text-center">
              ¿No recibiste el código? <a href="#">Reenviar</a>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verificando...' : 'Verificar'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Al hacer clic en continuar, aceptas nuestros{' '}
        <a href="#">Términos de Servicio</a> y{' '}
        <a href="#">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
