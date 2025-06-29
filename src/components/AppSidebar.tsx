
import { useState } from "react";
import { BarChart, Activity, LayoutDashboard, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", id: "dashboard", icon: LayoutDashboard },
  { title: "Meta Ads", id: "meta-ads", icon: Activity },
  { title: "Google Ads", id: "google-ads", icon: BarChart },
  { title: "Campanhas", id: "campaigns", icon: Activity },
  { title: "Configurações", id: "settings", icon: Settings },
];

interface AppSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export function AppSidebar({ activePage, setActivePage }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r bg-white/80 backdrop-blur-sm`}>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AdMetrics AI
              </h1>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-gray-500 px-4">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActivePage(item.id)}
                    className={`w-full justify-start ${
                      activePage === item.id
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-r-2 border-blue-600"
                        : "hover:bg-gray-50"
                    } transition-all duration-200`}
                  >
                    <item.icon className={`h-5 w-5 ${activePage === item.id ? "text-blue-600" : "text-gray-500"}`} />
                    {!isCollapsed && <span className="ml-3">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
