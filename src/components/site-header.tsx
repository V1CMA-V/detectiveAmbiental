import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLocation } from 'react-router'
import { ModeToggle } from './mode-toggle'

const titleSections: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'Cuenta',
  '/dashboard/map': 'Mapa de Reportes',
}

export function SiteHeader() {
  const location = useLocation()
  const pageTitle = titleSections[location.pathname] || 'Dashboard'

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pageTitle}</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a href="https://buap.mx" rel="noopener noreferrer" target="_blank">
              <img
                src="/Logo_de_la_BUAP.svg"
                alt="BUAP Logo"
                className="h-8 w-8"
              />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
