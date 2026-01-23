import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus2 } from 'lucide-react'
import { NewUserAdminForm } from './forms/create-user-admin-form'

export function NewUserAdmin() {
  return (
    <Dialog>
      <DialogTrigger className="w-full flex items-center justify-start gap-2 cursor-pointer">
        <UserPlus2 className="h-5 w-5" />
        <span>Crear nuevo Admin</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear nuevo Admin</DialogTitle>
          <DialogDescription>
            Llena el siguiente formulario para crear un nuevo usuario admin.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <NewUserAdminForm />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
