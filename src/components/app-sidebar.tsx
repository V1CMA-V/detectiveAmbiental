import {
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconMap,
  IconReport,
} from '@tabler/icons-react'
import * as React from 'react'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { TreeDeciduous } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from './auth-context'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Reportes',
      url: '',
      icon: IconDashboard,
    },
    {
      title: 'Mapa',
      url: 'map',
      icon: IconMap,
    },
  ],

  documents: [
    {
      name: 'Reportes Database',
      url: '#',
      icon: IconDatabase,
    },
    {
      name: 'Categorias',
      url: '#',
      icon: IconReport,
    },
    {
      name: 'Avisos Legales',
      url: '#',
      icon: IconFileWord,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, hasConfigPermission, logout } = useAuth()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/dashboard">
                <TreeDeciduous className="h-8 w-8 text-green-600" />
                <span className="text-base font-semibold">
                  Detective Ambiental
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          hasConfigPermission={hasConfigPermission()}
        />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} logout={logout} />}
      </SidebarFooter>
    </Sidebar>
  )
}
