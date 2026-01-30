import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { authService } from '@/lib/auth'
import type { ReportReview } from '@/types/report'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from './auth-context'

interface ReportReviewDisplayProps {
  reportReview: ReportReview
  onDeleted?: () => void
}

export default function ReportReviewDisplay({
  reportReview,
  onDeleted,
}: ReportReviewDisplayProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { hasConfigPermission } = useAuth()

  const isConfigPermission = hasConfigPermission()

  const handleDeleteReview = async () => {
    try {
      setIsDeleting(true)
      await authService.deleteReview(reportReview.public_id)
      toast.success('Revisión eliminada correctamente')
      setIsDialogOpen(false)
      onDeleted?.()
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar la revisión',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-sm text-muted-foreground">
            Revisado por:{' '}
            <span className="text-foreground font-medium">
              {reportReview.user.firstname} {reportReview.user.lastname}
            </span>
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">Comentario:</p>
            <p className="text-sm text-muted-foreground">
              {reportReview.comment}
            </p>
          </div>
        </div>
        {isConfigPermission && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                title="Eliminar revisión"
              >
                <Trash2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. La revisión y todas sus
                  imágenes serán eliminadas permanentemente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteReview}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar revisión'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {reportReview.reviewImages && reportReview.reviewImages.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">
            Imágenes de la revisión:
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {reportReview.reviewImages.map((image) => (
              <div
                key={image.id_image}
                className="aspect-square overflow-hidden rounded-lg border"
              >
                <img
                  src={image.url}
                  alt={`Imagen de revisión ${image.id_image}`}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
