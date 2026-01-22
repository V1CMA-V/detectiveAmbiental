import axios from 'axios'

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user_type: string
}

export const authService = {
  // Solo guarda el Token
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),

  isAuthenticated: (): boolean => !!localStorage.getItem('token'),

  // Login Solo guarda el token
  login: async ({ email, password }: LoginData): Promise<LoginResponse> => {
    try {
      const { data } = await axios.post<LoginResponse>(`api/auth/login`, {
        email,
        password,
      })

      // Verificar que solo usuarios admin puedan iniciar sesión
      if (data.user_type !== 'admin') {
        throw new Error('Solo los administradores pueden iniciar sesión')
      }

      // Guardar el token y tipo de usuario en localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user_type', data.user_type)

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Error en el login')
      }
      throw new Error('Error en el login')
    }
  },

  // Obtener datos del usuario desde el backend
  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }

    const { data } = await axios.get('api/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!data) {
      throw new Error('Error al obtener los datos del usuario')
    }

    return data
  },

  // Cerrar sesión
  logout: () => {
    authService.removeToken()
  },
}
