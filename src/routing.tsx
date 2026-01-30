import PrivateLayout from '@/layouts/PrivateLayout'
import PublicLayout from '@/layouts/PublicLayout'
import DashboardPage from '@/pages/dashboard/Page'
import HomePage from '@/pages/Home'
import { LoginPage } from '@/pages/Login'
import NotFoundPage from '@/pages/NotFound'
import { Route, Routes } from 'react-router'
import AuthProvider from './components/auth-context'
import MapPage from './pages/dashboard/maps/Page'
import ProfilePage from './pages/dashboard/profile/Page'
import ForgotPassword from './pages/ForgotPassword'
import InactiveAccount from './pages/InactiveAccount'
import ResetPassword from './pages/ResetPassword'
import Unauthotized from './pages/Unauthotized'
import ValidateAccount from './pages/ValidateAccoutn'

export default function Routing() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="validate-account" element={<ValidateAccount />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Private Routes */}
        <Route path="dashboard/" element={<PrivateLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="map" element={<MapPage />} />
        </Route>

        {/* Inactive Account Route */}
        <Route path="/inactive-account" element={<InactiveAccount />} />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthotized />} />
        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  )
}
