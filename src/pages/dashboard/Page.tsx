import { useAuth } from '@/components/auth-context'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { authService } from '@/lib/auth'
import type { Category } from '@/types/category'
import type { Report } from '@/types/report'
import type { UserAdmin } from '@/types/user'

import { useEffect, useState } from 'react'

export default function Page() {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [usersAdmin, setUsersAdmin] = useState<UserAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const { hasConfigPermission } = useAuth()

  const isConfigPermission = hasConfigPermission()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        const data = await authService.getAllReports()
        console.log('Reports fetched:', data)

        const categories = await authService.getAllCategories()
        console.log('Categories fetched:', categories)

        setReports(data)
        setCategories(categories)

        // Cargar usuarios solo si tiene permiso de configuración
        if (isConfigPermission) {
          console.log('User has config permission - fetching admin users')
          const users = await authService.getAdminUsers()
          console.log('Admin users fetched:', users)
          setUsersAdmin(users)
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [isConfigPermission])

  if (loading) {
    return <div className="p-4">Cargando reportes...</div>
  }

  return (
    <>
      <SectionCards reports={reports} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive reports={reports} />
      </div>
      <DataTable
        data={reports}
        categories={categories}
        usersAdmin={usersAdmin}
      />
    </>
  )
}
