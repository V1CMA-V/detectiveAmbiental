import type { Report } from '@/types/report'
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
      const { data } = await axios.post<LoginResponse>(`/api/auth/login`, {
        email,
        password,
      })

      // Verificar que solo usuarios admin puedan iniciar sesión
      if (data.user_type !== 'admin') {
        throw new Error('Solo los administradores pueden iniciar sesión')
      }

      // Guardar el token y en localStorage
      localStorage.setItem('token', data.token)

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

    const { data } = await axios.get('/api/auth/user', {
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

  // Actualizar contraseña del usuario
  updatePassword: async ({
    current_password,
    new_password,
  }: {
    current_password: string
    new_password: string
  }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }

    try {
      const { data } = await axios.post(
        '/api/auth/update-password',
        {
          current_password: current_password,
          new_password: new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Error al actualizar la contraseña',
        )
      }
      throw new Error('Error al actualizar la contraseña')
    }
  },

  // Actualizar contraseña del usuario
  createUserAdmin: async ({
    firstname,
    lastname,
    password,
    email,
  }: {
    firstname: string
    lastname: string
    password: string
    email: string
  }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }

    try {
      const { data } = await axios.post(
        '/api/auth/create-account-admin',
        {
          firstname: firstname,
          lastname: lastname,
          password: password,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
            'Error al crear el usuario administrador',
        )
      }
      throw new Error('Error al crear el usuario administrador')
    }
  },

  validateAccount: async (otp: string) => {
    try {
      const { data } = await axios.post('/api/auth/confirm-account', {
        token: otp,
      })

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Error al validar la cuenta',
        )
      }
      throw new Error('Error al validar la cuenta')
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const { data } = await axios.post('/api/auth/forgot-password', {
        email: email,
      })

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Error al enviar el correo',
        )
      }
      throw new Error('Error al enviar el correoS')
    }
  },

  validateToken: async (token: string) => {
    try {
      const { data } = await axios.post('/api/auth/validate-token', {
        token: token,
      })
      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Token inválido o expirado',
        )
      }
      throw new Error('Token inválido o expirado')
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const { data } = await axios.post(`/api/auth/reset-password/${token}`, {
        password: newPassword,
      })

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error || 'Error al restablecer la contraseña',
        )
      }
      throw new Error('Error al restablecer la contraseña')
    }
  },

  getAllReports: async (): Promise<Report[]> => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No autenticado')
    }
    try {
      const { data } = await axios.get<Report[]>('/api/reports-admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Data authService:', data)

      return data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Error en getAllReports:',
          error.response?.data || error.message,
        )
        throw new Error(
          error.response?.data?.error || 'Error al obtener los reportes',
        )
      }
      throw new Error('Error al obtener los reportes')
    }
  },
}
