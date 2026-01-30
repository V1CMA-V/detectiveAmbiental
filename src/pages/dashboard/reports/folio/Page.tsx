import AddReportReviewForm from '@/components/forms/add-report-review-form'
import ReportReviewDisplay from '@/components/report-review-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { authService } from '@/lib/auth'
import type { Report } from '@/types/report'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  MapPin,
  Tag,
  User,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { useNavigate, useParams } from 'react-router'

export default function ReportFolioPage() {
  const { folio } = useParams<{ folio: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReport = useCallback(async () => {
    if (!folio) return

    try {
      setLoading(true)
      const data = await authService.getReportFolio(folio)
      setReport(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar el reporte',
      )
    } finally {
      setLoading(false)
    }
  }, [folio])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'secondary'
      case 'finalizado':
        return 'default'
      default:
        return 'outline'
    }
  }

  // Crear icono personalizado para el marcador
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: #3b82f6;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive text-center">
              {error || 'No se encontró el reporte'}
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => navigate('/dashboard')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{report.title}</h1>
          <p className="text-muted-foreground">Folio: {report.folio}</p>
        </div>
        <Badge variant={getStatusColor(report.status.status)}>
          {report.status.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Reporte</CardTitle>
              <CardDescription>Información general del reporte</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground">{report.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Categoría</p>
                    <p className="text-sm text-muted-foreground">
                      {report.categories.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Reportado por</p>
                    <p className="text-sm text-muted-foreground">
                      {report.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ubicación</p>
                    <Button
                      variant="link"
                      className="p-0 text-sm"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps?q=${report.latitude},${report.longitude}`,
                          '_blank',
                        )
                      }}
                    >
                      Ver en Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Images */}
          {report.images && report.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Evidencias del Reporte</CardTitle>
                <CardDescription>Imágenes adjuntas al reporte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={image.url_image}
                        alt={`Evidencia ${index + 1}`}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/400x300?text=Imagen+no+disponible'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Section */}
          {report.review ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Revisión Completada
                </CardTitle>
                <CardDescription>
                  Atendido por {report.review.user.firstname}{' '}
                  {report.review.user.lastname}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReportReviewDisplay
                  reportReview={report.review}
                  onDeleted={fetchReport}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5 text-blue-600" />
                  Agregar Revisión
                </CardTitle>
                <CardDescription>
                  Completa la revisión de este reporte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddReportReviewForm
                  public_id_report={report.public_id}
                  onSuccess={fetchReport}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {report.status.status.toLowerCase() === 'finalizado' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <Badge
                  variant={getStatusColor(report.status.status)}
                  className="text-base"
                >
                  {report.status.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-75 rounded-lg overflow-hidden border">
                <MapContainer
                  center={[
                    parseFloat(report.latitude),
                    parseFloat(report.longitude),
                  ]}
                  zoom={17}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[
                      parseFloat(report.latitude),
                      parseFloat(report.longitude),
                    ]}
                    icon={customIcon}
                  />
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">ID Público</p>
                <p className="text-xs text-muted-foreground break-all">
                  {report.public_id}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Categoría</p>
                <Badge variant="outline" className="mt-1">
                  {report.categories.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
