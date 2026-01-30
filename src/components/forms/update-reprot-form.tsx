import { authService } from '@/lib/auth'
import type { Category } from '@/types/category'
import type { Report } from '@/types/report'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

interface UpdateReportFormProps {
  item: Report
  categories?: Category[]
}

const statusOptions = [
  { id: 1, status: 'Pendiente' },
  { id: 2, status: 'En Revision' },
]

export default function UpdateReportForm({
  item,
  categories = [],
}: UpdateReportFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    item.categories.id_category,
  )
  const [selectedStatusId, setSelectedStatusId] = useState(
    item.status.id_status,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificar si hay cambios
    if (
      selectedCategoryId === item.categories.id_category &&
      selectedStatusId === item.status.id_status
    ) {
      toast.info('No hay cambios para guardar')
      return
    }

    setIsSubmitting(true)

    try {
      await authService.updateCategoryStatusBFolio({
        folio: item.folio,
        id_category: selectedCategoryId,
        id_status: selectedStatusId,
      })

      toast.success('Reporte actualizado correctamente')

      // Recargar la página después de 1 segundo
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al actualizar el reporte',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={selectedCategoryId.toString()}
            onValueChange={(value) => setSelectedCategoryId(Number(value))}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category.id_category}
                  value={category.id_category.toString()}
                >
                  {category.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="status">Estatus</Label>
          <Select
            value={selectedStatusId.toString()}
            onValueChange={(value) => setSelectedStatusId(Number(value))}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.id} value={status.id.toString()}>
                  {status.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </form>
  )
}
