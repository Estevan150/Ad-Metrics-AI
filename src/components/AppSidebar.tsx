
import { useState } from "react";
import { BarChart, Activity, LayoutDashboard, Settings, Link, FileText } from "lucide-react";
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
  { title: "Contas Publicitárias", id: "meta-ads", icon: Link },
  { title: "Campanhas", id: "campaigns", icon: Activity },
  { title: "Relatórios", id: "reports", icon: FileText },
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
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} border-r bg-card/80 backdrop-blur-sm shadow-card`}>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-primary">
              <BarChart className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AdMetrics AI
              </h1>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActivePage(item.id)}
                    className={`w-full justify-start transition-all duration-200 ${
                      activePage === item.id
                        ? "bg-gradient-primary text-primary-foreground shadow-primary border-r-2 border-primary"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${
                      activePage === item.id ? "text-primary-foreground" : "text-muted-foreground"
                    }`} />
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
