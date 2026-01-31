import { useAuth } from '@/components/auth-context'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import DashboardSkeleton from '@/components/dashboard-skeleton'
import { DataTable } from '@/components/data-table'
import { SectionCards } from '@/components/section-cards'
import { authService } from '@/lib/auth'
import type { Category } from '@/types/category'
import type { Report } from '@/types/report'
import type { UserAdmin } from '@/types/user'

import { useCallback, useEffect, useState } from 'react'

export default function Page() {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [usersAdmin, setUsersAdmin] = useState<UserAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const { hasConfigPermission } = useAuth()

  const isConfigPermission = hasConfigPermission()

  const fetchCategories = async () => {
    try {
      const categories = await authService.getAllCategories()
      setCategories(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await authService.getAllReports()

      await fetchCategories()

      setReports(data)

      // Cargar usuarios solo si tiene permiso de configuración
      if (isConfigPermission) {
        const users = await authService.getAdminUsers()
        setUsersAdmin(users)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [isConfigPermission])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  if (loading) {
    return <DashboardSkeleton />
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
        onCategoriesUpdate={fetchCategories}
        onRefresh={fetchAllData}
      />
    </>
  )
}
