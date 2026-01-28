import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
} from '@tabler/icons-react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { authService } from '@/lib/auth'
import type { Category } from '@/types/category'
import { Check, Edit, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from './ui/input'

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Mantén presionado para reordenar</span>
    </Button>
  )
}

interface ColumnsProps {
  editingId: number | null
  editValue: string
  onEdit: (id: number, currentValue: string) => void
  onSave: (id: number) => void
  onCancel: () => void
  onDelete: (id: number) => void
  onInputChange: (value: string) => void
}

const createColumns = ({
  editingId,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onInputChange,
}: ColumnsProps): ColumnDef<Category>[] => [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id_category} />,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id_category',
    header: 'ID',
    cell: ({ row }) => (
      <p className="font-medium">{row.original.id_category}</p>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
    cell: ({ row }) => {
      const isEditing = editingId === row.original.id_category
      return (
        <Input
          id={`category-${row.original.id_category}`}
          value={isEditing ? editValue : row.original.category}
          onChange={(e) => isEditing && onInputChange(e.target.value)}
          disabled={!isEditing}
          className="disabled:opacity-100 disabled:cursor-default"
        />
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const isEditing = editingId === row.original.id_category

      if (isEditing) {
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="default"
              onClick={() => onSave(row.original.id_category)}
            >
              <Check className="size-4" />
              <span className="sr-only">Guardar cambios</span>
            </Button>
            <Button size="icon" variant="ghost" onClick={onCancel}>
              <X className="size-4" />
              <span className="sr-only">Cancelar edición</span>
            </Button>
          </div>
        )
      }

      return (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              onEdit(row.original.id_category, row.original.category)
            }
          >
            <Edit className="size-4" />
            <span className="sr-only">Editar categoría</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original.id_category)}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Eliminar categoría</span>
          </Button>
        </div>
      )
    },
  },
]

function DraggableRow({ row }: { row: Row<Category> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id_category,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function CategoriesTable({
  data: initialData,
}: {
  data?: Category[]
}) {
  const [data, setData] = React.useState<Category[]>(() => initialData || [])
  const [editingId, setEditingId] = React.useState<number | null>(null)
  const [editValue, setEditValue] = React.useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [categoryToDelete, setCategoryToDelete] = React.useState<number | null>(
    null,
  )
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id_category }) => id_category) || [],
    [data],
  )

  const handleEdit = React.useCallback((id: number, currentValue: string) => {
    setEditingId(id)
    setEditValue(currentValue)
  }, [])

  const handleSave = React.useCallback(
    async (id: number) => {
      if (!editValue.trim()) {
        toast.error('El nombre de la categoría no puede estar vacío')
        return
      }

      try {
        await authService.updateCategory(id, editValue.trim())
        setData((prevData) =>
          prevData.map((item) =>
            item.id_category === id
              ? { ...item, category: editValue.trim() }
              : item,
          ),
        )
        setEditingId(null)
        setEditValue('')
        toast.success('Categoría actualizada correctamente')
      } catch (error) {
        console.error('Error al actualizar categoría:', error)
        toast.error(
          error instanceof Error
            ? error.message
            : 'Error al actualizar la categoría',
        )
      }
    },
    [editValue],
  )

  const handleCancel = React.useCallback(() => {
    setEditingId(null)
    setEditValue('')
  }, [])

  const handleDelete = React.useCallback(async (id: number) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }, [])

  const confirmDelete = React.useCallback(async () => {
    if (categoryToDelete === null) return

    try {
      await authService.deleteCategory(categoryToDelete)
      setData((prevData) =>
        prevData.filter((item) => item.id_category !== categoryToDelete),
      )
      toast.success('Categoría eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al eliminar la categoría',
      )
    } finally {
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }, [categoryToDelete])

  const handleInputChange = React.useCallback((value: string) => {
    setEditValue(value)
  }, [])

  const columns = React.useMemo(
    () =>
      createColumns({
        editingId,
        editValue,
        onEdit: handleEdit,
        onSave: handleSave,
        onCancel: handleCancel,
        onDelete: handleDelete,
        onInputChange: handleInputChange,
      }),
    [
      editingId,
      editValue,
      handleEdit,
      handleSave,
      handleCancel,
      handleDelete,
      handleInputChange,
    ],
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id_category.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label
              htmlFor="rows-per-page-categories"
              className="text-sm font-medium"
            >
              Filas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger
                size="sm"
                className="w-20"
                id="rows-per-page-categories"
              >
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la primera página</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir a la página anterior</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la página siguiente</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir a la última página</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La categoría será eliminada
              permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
