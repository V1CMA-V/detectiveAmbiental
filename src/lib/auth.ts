import axios from 'axios'

interface LoginData {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user_type: string
}

export async function categories() {
  const response = await fetch('http://localhost:4000/api/categories', {
    method: 'GET',
  })
  const data = await response.json()
  console.log('Data: ', data)
}

export const login = async ({
  email,
  password,
}: LoginData): Promise<LoginResponse> => {
  // Todo: Utilizar env variable para la URL base

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
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_type')
}

export const getToken = (): string | null => localStorage.getItem('token')

export const getUserType = (): string | null =>
  localStorage.getItem('user_type')

export const isAuthenticated = (): boolean => !!getToken()
export const isAdmin = (): boolean => getUserType() === 'admin'
