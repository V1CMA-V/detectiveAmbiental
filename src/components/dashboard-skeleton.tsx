import { Card, CardFooter, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Section Cards */}
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {/* Card 1 - Total de Reportes */}
        <Card className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16 @[250px]/card:h-9" />
            <Skeleton className="h-6 w-28" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
          </CardFooter>
        </Card>

        {/* Card 2 - Pendientes */}
        <Card className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12 @[250px]/card:h-9" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-36" />
          </CardFooter>
        </Card>

        {/* Card 3 - En Proceso */}
        <Card className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-12 @[250px]/card:h-9" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
          </CardFooter>
        </Card>

        {/* Card 4 - Finalizados */}
        <Card className="@container/card">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-12 @[250px]/card:h-9" />
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
          </CardFooter>
        </Card>
      </div>

      {/* ChartAreaInteractive */}
      <div className="px-4 lg:px-6">
        <Card className="@container/card">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardHeader>
          <CardFooter className="px-2 pt-4 sm:px-6 sm:pt-6">
            <Skeleton className="h-62.5 w-full" />
          </CardFooter>
        </Card>
      </div>

      {/* DataTable */}
      <div className="flex flex-col gap-6">
        {/* Tabs header */}
        <div className="flex items-center justify-between px-4 lg:px-6">
          <Skeleton className="h-9 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 px-4 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-9 w-full lg:w-62.5" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-full lg:w-45" />
              <Skeleton className="h-9 w-full lg:w-45" />
              <Skeleton className="h-9 w-full lg:w-45" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-hidden rounded-lg border">
            <div className="w-full">
              {/* Header */}
              <div className="bg-muted flex h-12 items-center gap-4 border-b px-4">
                <Skeleton className="size-4" />
                <Skeleton className="size-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-40" />
              </div>
              {/* Rows */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex h-16 items-center gap-4 border-b px-4"
                >
                  <Skeleton className="size-4" />
                  <Skeleton className="size-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between px-4">
            <Skeleton className="hidden h-4 w-48 lg:block" />
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Skeleton className="hidden size-8 lg:block" />
                <Skeleton className="size-8" />
                <Skeleton className="size-8" />
                <Skeleton className="hidden size-8 lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
