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
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconEye,
  IconGripVertical,
  IconLayoutColumns,
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Category } from '@/types/category'
import type { Report } from '@/types/report'
import type { UserAdmin } from '@/types/user'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import { Link } from 'react-router'
import AddCategory from './add-category'
import { useAuth } from './auth-context'
import CategoriesTable from './categories-table'
import AddReportReviewForm from './forms/add-report-review-form'
import ReportReviewDisplay from './report-review-display'
import UserTab from './user-tab'

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
const markerIcons = {
  Pendiente: createCustomIcon('#ef4444'), // Rojo
  'En proceso': createCustomIcon('#f97316'), // Naranja
  Finalizado: createCustomIcon('#22c55e'), // Verde
}

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
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<Report>[] = [
  {
    id: 'drag',
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id_report} />,
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
    accessorKey: 'folio',
    header: 'Folio',
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },
  {
    accessorKey: 'categoria',
    header: 'Categoria',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.categories.category}
        </Badge>
      </div>
    ),
    filterFn: (row, value) => {
      return row.original.categories.category === value
    },
  },
  {
    accessorKey: 'estatus',
    header: 'Estatus',
    cell: ({ row }) => {
      const status = row.original.status.status
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {status === 'Finalizado' ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : status === 'En Proceso' ? (
            <IconEye className="text-yellow-500" />
          ) : status === 'Pendiente' ? (
            <IconClock className="text-blue-500" />
          ) : null}
          {status}
        </Badge>
      )
    },
    filterFn: (row, value) => {
      return row.original.status.status === value
    },
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha de creación',
    cell: ({ row }) => (
      <p>
        {new Date(row.original.date).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </p>
    ),
  },
  {
    accessorKey: 'titulo',
    header: 'Titulo',
    cell: ({ row }) => <p>{row.original.title}</p>,
  },
  {
    accessorKey: 'correo',
    header: 'Correo del usuario',
    cell: ({ row }) => <p>{row.original.user.email}</p>,
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<Report> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id_report,
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

export function DataTable({
  data: initialData,
  categories,
  usersAdmin = [],
}: {
  data: Report[]
  categories?: Category[]
  usersAdmin?: UserAdmin[]
}) {
  const [data, setData] = React.useState(() => initialData)
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
    () => data?.map(({ id_report }) => id_report) || [],
    [data],
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
    getRowId: (row) => row.id_report.toString(),
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

  const { hasConfigPermission } = useAuth()

  const isConfigPermission = hasConfigPermission()

  return (
    <Tabs
      defaultValue="reports"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          Ver
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Seleccionar vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reports">Reportes</SelectItem>
            <SelectItem value="categories">Categorías</SelectItem>

            {isConfigPermission && (
              <SelectItem value="users">Usuarios</SelectItem>
            )}

            <SelectItem value="past-performance">
              Mas tablas en el futuro
            </SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="categories">
            Categorías{' '}
            <Badge variant={'secondary'}>{categories?.length || 0}</Badge>
          </TabsTrigger>

          {isConfigPermission && (
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          )}

          <TabsTrigger value="past-performance">
            Posibles tablas en el futuro
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {/* Add category */}
          <AddCategory />
        </div>
      </div>
      <TabsContent
        value="reports"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        {/* Filtros y búsqueda */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Buscador por folio */}
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Buscar por folio..."
                value={
                  (table.getColumn('folio')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('folio')?.setFilterValue(event.target.value)
                }
                className="h-9 w-full lg:w-62.5"
              />
            </div>

            {/* Filtros y personalizar columnas */}
            <div className="flex items-center gap-2">
              {/* Filtro por categoría */}
              <Select
                value={
                  (table.getColumn('categoria')?.getFilterValue() as string) ??
                  'all'
                }
                onValueChange={(value) =>
                  table
                    .getColumn('categoria')
                    ?.setFilterValue(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-45">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id_category}
                      value={category.category}
                    >
                      {category.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por estatus */}
              <Select
                value={
                  (table.getColumn('estatus')?.getFilterValue() as string) ??
                  'all'
                }
                onValueChange={(value) =>
                  table
                    .getColumn('estatus')
                    ?.setFilterValue(value === 'all' ? '' : value)
                }
              >
                <SelectTrigger className="h-9 w-full lg:w-45">
                  <SelectValue placeholder="Todos los estatus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estatus</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>

              {/* Ordenar por fecha */}
              <Select
                value={
                  sorting[0]?.id === 'fecha'
                    ? sorting[0]?.desc
                      ? 'desc'
                      : 'asc'
                    : 'default'
                }
                onValueChange={(value) => {
                  if (value === 'default') {
                    setSorting([])
                  } else {
                    setSorting([{ id: 'fecha', desc: value === 'desc' }])
                  }
                }}
              >
                <SelectTrigger className="h-9 w-full lg:w-45">
                  <SelectValue placeholder="Ordenar por fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Sin ordenar</SelectItem>
                  <SelectItem value="desc">Más reciente</SelectItem>
                  <SelectItem value="asc">Más antigua</SelectItem>
                </SelectContent>
              </Select>

              {/* Personalizar columnas */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <IconLayoutColumns />
                    <span className="hidden lg:inline">Columnas</span>
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== 'undefined' &&
                        column.getCanHide(),
                    )
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

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
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Filas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
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
      </TabsContent>
      <TabsContent value="categories">
        <CategoriesTable data={categories} />
      </TabsContent>

      {isConfigPermission && (
        <TabsContent value="users">
          <UserTab usersAdmin={usersAdmin} />
        </TabsContent>
      )}

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

function TableCellViewer({ item }: { item: Report }) {
  const isMobile = useIsMobile()

  const textDate = new Date(item.date).toLocaleDateString('es-MX')

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.folio}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.folio}</DrawerTitle>
          <DrawerDescription>Detalles y edición del reporte</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* Images for Reports */}
          {item.images && item.images.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg border"
                  >
                    <img
                      src={image.url_image}
                      alt={`Imagen del reporte ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <Separator />
            </>
          )}

          {/* Pin on Map */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Ubicación del reporte
            </h3>

            <div className="h-64 w-full rounded-md border">
              <MapContainer
                center={[parseFloat(item.latitude), parseFloat(item.longitude)]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    parseFloat(item.latitude),
                    parseFloat(item.longitude),
                  ]}
                  icon={
                    markerIcons[
                      item.status.status as keyof typeof markerIcons
                    ] || markerIcons.Pendiente
                  }
                ></Marker>
              </MapContainer>
            </div>
          </div>

          <Separator />

          {/* Form to edit Report */}

          <form className="flex flex-col gap-4">
            <h4 className="flex flex-col gap-3 text-xl text-foreground font-medium ">
              <span className="text-sm text-muted-foreground font-normal">
                Titulo
              </span>
              {item.title}
            </h4>

            <p className="text-muted-foreground leading-relaxed text-sm">
              {item.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <p className="text-sm text-muted-foreground ">
                Fecha <br />
                <span className="text-lg text-foreground">{textDate}</span>
              </p>
              <p className="text-sm text-muted-foreground ">
                Email <br />
                <span className="text-lg text-foreground">
                  {item.user.email}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                {/* TODO: Pendiente a mostrar todas las categorias en caso de que si se requiera modificar la categoria */}
                <Label htmlFor="category">Categoria</Label>
                <Select defaultValue={item.categories.category}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={item.categories.category}>
                      {item.categories.category}
                    </SelectItem>
                    <SelectItem value="Executive Summary">
                      Mas categorias
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                {/* TODO: Pendiente a cargar los demas estatus del reporte para ir modificando a como se avance en el reporte */}
                <Label htmlFor="status">Estatus</Label>
                <Select defaultValue={item.status.status}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value={item.status.status}>
                      {item.status.status}
                    </SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          <Separator />

          {/* Admin report-review */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              Revisión del reporte
            </h3>

            {/* Mostrar revisión del reporte si existe */}
            {item.review && <ReportReviewDisplay reportReview={item.review} />}

            {/* Crear reporte si no hay uno asignado */}
            {!item.review && (
              <AddReportReviewForm public_id_report={item.public_id} />
            )}
          </div>
        </div>

        <DrawerFooter>
          <Button asChild>
            <Link to={`/dashboard/reports/${item.folio}`} className="w-full">
              Ver reporte completo
            </Link>
          </Button>

          <DrawerClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
