import { authService } from '@/lib/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export default function AddReportReviewForm({
  public_id_report,
  onSuccess,
}: {
  public_id_report: string
  onSuccess?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [images, setImages] = useState<File[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3)
      setImages(filesArray)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!reviewNotes.trim()) {
      toast.error('Por favor ingresa notas de revisión')
      return
    }

    setIsSubmitting(true)
    try {
      await authService.createReview({
        public_id_report,
        review_notes: reviewNotes,
        images,
      })

      toast.success('Revisión enviada exitosamente', {
        position: 'bottom-left',
      })
      setReviewNotes('')
      setImages([])
      // Reset file input
      const fileInput = document.getElementById('pictures') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      // Call onSuccess callback or reload page
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.reload()
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al enviar la revisión',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="review-notes">Notas de revisión</FieldLabel>
          <Textarea
            id="review-notes"
            className="w-full rounded-md border border-muted-foreground/50 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={4}
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="pictures">
            Imagenes {images.length > 0 && `(${images.length}/3)`}
          </FieldLabel>
          <Input
            id="pictures"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/webp"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </Field>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Guardar notas de revisión'}
        </Button>
      </FieldGroup>
    </form>
  )
}
