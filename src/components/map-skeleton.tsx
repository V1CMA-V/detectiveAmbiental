import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function MapPageSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-7 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-16">
            {/* Filtros */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="w-full md:w-50">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Información de resultados */}
            <Skeleton className="h-5 w-56" />

            {/* Mapa */}
            <Skeleton className="h-150 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
