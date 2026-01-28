import { AppSidebar } from '@/components/app-sidebar'
import { useAuth } from '@/components/auth-context'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { authService } from '@/lib/auth'
import { Navigate, Outlet } from 'react-router'

export default function PrivateLayout() {
  const { isAuthenticated } = authService

  const { user } = useAuth()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (user?.active === false) {
    return <Navigate to="/inactive-account" replace />
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
