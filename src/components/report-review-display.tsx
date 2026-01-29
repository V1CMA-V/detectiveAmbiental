import type { ReportReview } from '@/types/report'

interface ReportReviewDisplayProps {
  reportReview: ReportReview
}

export default function ReportReviewDisplay({
  reportReview,
}: ReportReviewDisplayProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-2">
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
