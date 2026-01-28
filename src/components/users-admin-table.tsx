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

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import type { UserAdmin } from '@/types/user'
import { toast } from 'sonner'

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

export default function UsersAdminTable({
  data: initialData,
}: {
  data?: UserAdmin[]
}) {
  const [data, setData] = React.useState<UserAdmin[]>(() => initialData || [])
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
  const [loadingUserId, setLoadingUserId] = React.useState<number | null>(null)

  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id_user }) => id_user) || [],
    [data],
  )

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      setLoadingUserId(userId)

      if (isActive) {
        console.log('Deactivating user with ID:', userId)
        await authService.deactivateUserAdmin(userId)
        toast.success('Usuario desactivado correctamente')
      } else {
        console.log('Reactivating user with ID:', userId)
        await authService.reactivateUserAdmin(userId)
        toast.success('Usuario activado correctamente')
      }

      // Actualizar el estado local
      setData((prevData) =>
        prevData.map((user) =>
          user.id_user === userId ? { ...user, active: !isActive } : user,
        ),
      )
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Error al cambiar el estado del usuario',
      )
    } finally {
      setLoadingUserId(null)
    }
  }

  const columns: ColumnDef<UserAdmin>[] = [
    {
      id: 'drag',
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id_user} />,
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
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      accessorKey: 'id_user',
      header: 'ID',
      cell: ({ row }) => <p className="font-medium">{row.original.id_user}</p>,
      enableHiding: false,
    },
    {
      accessorKey: 'firstname',
      header: 'Nombre',
      cell: ({ row }) => <p>{row.original.firstname}</p>,
    },
    {
      accessorKey: 'lastname',
      header: 'Apellido',
      cell: ({ row }) => <p>{row.original.lastname}</p>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <p className="text-muted-foreground">{row.original.email}</p>
      ),
    },
    {
      accessorKey: 'user_type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge
          variant={row.original.user_type === 'admin' ? 'default' : 'secondary'}
        >
          {row.original.user_type}
        </Badge>
      ),
    },
    {
      accessorKey: 'active',
      header: 'Activo',
      cell: ({ row }) => (
        <Badge variant={row.original.active ? 'default' : 'destructive'}>
          {row.original.active ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
    {
      accessorKey: 'permission_config',
      header: 'Config',
      cell: ({ row }) => (
        <Badge variant={row.original.permission_config ? 'default' : 'outline'}>
          {row.original.permission_config ? 'Sí' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Permisos',
      cell: ({ row }) => (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleToggleUserStatus(row.original.id_user, row.original.active)
            }
            disabled={loadingUserId === row.original.id_user}
          >
            {loadingUserId === row.original.id_user
              ? 'Procesando...'
              : row.original.active
                ? 'Desactivar cuenta'
                : 'Activar cuenta'}
          </Button>
        </div>
      ),
    },
  ]

  function DraggableRow({ row }: { row: Row<UserAdmin> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id_user,
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
    getRowId: (row) => row.id_user.toString(),
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
              htmlFor="rows-per-page-users"
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
                id="rows-per-page-users"
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
    </div>
  )
}
