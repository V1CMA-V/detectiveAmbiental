import MapPageSkeleton from '@/components/map-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { authService } from '@/lib/auth'
import type { ReportMap } from '@/types/report'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router'

// Crear iconos personalizados para cada estado
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
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
}

// Iconos por estado
const icons = {
  Pendiente: createCustomIcon('#ef4444'), // Rojo
  'En proceso': createCustomIcon('#f97316'), // Naranja
  Finalizado: createCustomIcon('#22c55e'), // Verde
}

export default function MapPage() {
  const position: [number, number] = [19.000075, -98.200653]
  const [reports, setReports] = useState<ReportMap[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [folioSearch, setFolioSearch] = useState<string>('')

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await authService.getReportsMap()
        setReports(data)
      } catch (error) {
        console.error('Error al cargar los reportes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus =
        statusFilter === 'all' || report.status.status === statusFilter
      const matchesFolio = report.folio
        .toLowerCase()
        .includes(folioSearch.toLowerCase())
      return matchesStatus && matchesFolio
    })
  }, [reports, statusFilter, folioSearch])

  if (loading) {
    return <MapPageSkeleton />
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-16">
            {/* Filtros */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por folio..."
                  value={folioSearch}
                  onChange={(e) => setFolioSearch(e.target.value)}
                />
              </div>
              <div className="w-full md:w-50">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En proceso">En proceso</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información de resultados */}
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredReports.length} de {reports.length} reportes
            </div>

            {/* Mapa */}
            <div style={{ height: '600px', width: '100%' }}>
              <MapContainer
                center={position}
                zoom={16}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marcadores de los reportes filtrados */}
                {filteredReports.map((report) => {
                  const lat = parseFloat(report.latitude)
                  const lng = parseFloat(report.longitude)

                  // Validar que las coordenadas sean válidas
                  if (isNaN(lat) || isNaN(lng)) return null

                  // Seleccionar el icono según el estado
                  const icon =
                    icons[report.status.status as keyof typeof icons] ||
                    icons.Pendiente

                  return (
                    <Marker
                      key={report.folio}
                      position={[lat, lng]}
                      icon={icon}
                    >
                      <Popup>
                        <div style={{ minWidth: '250px' }}>
                          <h3
                            style={{
                              margin: '0 0 10px 0',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          >
                            {report.title}
                          </h3>
                          <div
                            style={{
                              marginBottom: '8px',
                              lineHeight: '1.6',
                            }}
                          >
                            <strong>Folio:</strong> {report.folio}
                            <br />
                            <strong>Fecha:</strong> {report.date}
                            <br />
                            <strong>Categoría:</strong>{' '}
                            {report.categories.category}
                            <br />
                            <strong>Estado:</strong>{' '}
                            <span
                              style={{
                                color:
                                  report.status.status === 'Finalizado'
                                    ? '#22c55e'
                                    : report.status.status === 'En proceso'
                                      ? '#f97316'
                                      : '#ef4444',
                                fontWeight: 'bold',
                              }}
                            >
                              {report.status.status}
                            </span>
                            <br />
                            <strong>Usuario:</strong> {report.user.email}
                          </div>
                          <Link
                            to={`/dashboard/reports/${report.folio}`}
                            className="flex items-center gap-2 font-medium group"
                          >
                            Ver detalle del reporte{' '}
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                          </Link>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
