import PrivateLayout from '@/layouts/PrivateLayout'
import PublicLayout from '@/layouts/PublicLayout'
import DashboardPage from '@/pages/dashboard/Page'
import HomePage from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import NotFoundPage from '@/pages/NotFound'
import { Route, Routes } from 'react-router'

export default function Routing() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Private Routes */}
      <Route path="dashboard/" element={<PrivateLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
