import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Report } from '@/types/report'
import { ChartLine, CheckCircle2, Info, SquareActivity } from 'lucide-react'

export function SectionCards({ reports }: { reports: Report[] }) {
  // Calcular los totales
  const totalReports = reports.length
  const totalPendingReports = reports.filter(
    (report) => report.status.status === 'Pendiente',
  ).length
  const totalInProcessReports = reports.filter(
    (report) => report.status.status === 'En Revision',
  ).length
  const totalResolvedReports = reports.filter(
    (report) => report.status.status === 'Finalizado',
  ).length

  // Calcular reportes del mes actual y mes anterior
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const reportsThisMonth = reports.filter((report) => {
    const reportDate = new Date(report.date)
    return (
      reportDate.getMonth() === currentMonth &&
      reportDate.getFullYear() === currentYear
    )
  }).length

  const reportsLastMonth = reports.filter((report) => {
    const reportDate = new Date(report.date)
    return (
      reportDate.getMonth() === lastMonth &&
      reportDate.getFullYear() === lastMonthYear
    )
  }).length

  // Calcular porcentaje de cambio
  const monthOverMonthChange = reportsLastMonth
    ? (
        ((reportsThisMonth - reportsLastMonth) / reportsLastMonth) *
        100
      ).toFixed(1)
    : reportsThisMonth > 0
      ? '100'
      : '0'

  const isPositiveChange = Number(monthOverMonthChange) >= 0

  const comparedResolvedToTotal = totalReports
    ? ((totalResolvedReports / totalReports) * 100).toFixed(1)
    : '0'

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total de Reportes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalReports}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isPositiveChange ? <IconTrendingUp /> : <IconTrendingDown />}
              {isPositiveChange ? '+' : ''}
              {monthOverMonthChange}% este mes
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reportes registrados en el sistema
            <ChartLine className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Todos los reportes hasta la fecha
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pendientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPendingReports}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Requieren atencion <Info className="size-4" />
          </div>
          <div className="text-muted-foreground">Reportes sin resolver aún</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>En Revision</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInProcessReports}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reportes en revision <SquareActivity className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Atendidos por mantenimiento
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Finalizados</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalResolvedReports}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {/* Porcentaje con respecto al total de reportes y solucionados  */}
              <IconTrendingUp />+{comparedResolvedToTotal}% del total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Reportes finalizados <CheckCircle2 className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Solucionados Correctamente
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
