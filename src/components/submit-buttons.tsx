import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface LogginButtonProps {
  isSubmitting: boolean
}

export function LogginButton({ isSubmitting }: LogginButtonProps) {
  return (
    <>
      {isSubmitting ? (
        <Button disabled className="w-fit">
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Iniciando sesión...
        </Button>
      ) : (
        <Button className="w-fit" type="submit">
          Iniciar sesión
        </Button>
      )}
    </>
  )
}
