import type { UserAdmin } from '@/types/user'
import UsersAdminTable from './users-admin-table'

interface UserTabProps {
  usersAdmin: UserAdmin[]
}

export default function UserTab({ usersAdmin }: UserTabProps) {
  return <UsersAdminTable data={usersAdmin} />
}
