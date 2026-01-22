export interface User {
  id_user: number
  firstname: string
  lastname: string
  email: string
  user_type: 'admin' | 'general'
  confirmed: boolean
  active: boolean
  permission_config: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  login: (data: LoginCredentials) => Promise<User>
  logout: () => void
  loading: boolean
  hasConfigPermission: () => boolean
}
