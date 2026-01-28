import { authService } from '@/lib/auth'
import type { AuthContextType, LoginCredentials, User } from '@/types/user'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Al cargar la app, si hay token, obtener datos del usuario
  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.fetchUser()
          setUser(userData)
        } catch (error) {
          // Token inválido o expirado
          console.log('Sesión inválida, redirigiendo al login.', error)
          authService.removeToken()
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginCredentials) => {
    await authService.login(data)

    // Obtener datos del usuario después del login
    const userData = await authService.fetchUser()
    setUser(userData)

    return userData
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Funciones helper para verificar permisos
  const hasConfigPermission = () => {
    return user?.permission_config === true
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        hasConfigPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
