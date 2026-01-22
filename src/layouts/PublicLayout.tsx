import { ModeToggle } from '@/components/mode-toggle'
import { authService } from '@/lib/auth'
import { TreeDeciduous } from 'lucide-react'
import { Link, Navigate, Outlet } from 'react-router'

export default function PublicLayout() {
  const { isAuthenticated } = authService

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <TreeDeciduous className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">Detective Ambiental</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2026 Detective Ambiental BUAP. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
