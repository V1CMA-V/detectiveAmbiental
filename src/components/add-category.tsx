import { PlusCircle } from 'lucide-react'
import { AddCategoryForm } from './forms/add-category-form'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

export default function AddCategory() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle />
          Agregar Categoría
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nueva Categoría</DialogTitle>
          <DialogDescription>
            Aquí puedes agregar una nueva categoría para organizar mejor tus
            elementos.
          </DialogDescription>
        </DialogHeader>

        {/* Form for add category */}
        <AddCategoryForm />
        {/* view categories */}

        {/* Close dialog */}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={'outline'}>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
