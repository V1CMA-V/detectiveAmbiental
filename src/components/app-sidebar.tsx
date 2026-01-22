import {
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconMap,
  IconReport,
  IconUsers,
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

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Reportes',
      url: '#',
      icon: IconDashboard,
    },
    {
      title: 'Mapa',
      url: '#',
      icon: IconMap,
    },
    {
      title: 'Usuarios',
      url: '#',
      icon: IconUsers,
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <TreeDeciduous className="h-8 w-8 text-green-600" />
                <span className="text-base font-semibold">
                  Detective Ambiental
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
