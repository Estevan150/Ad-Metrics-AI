
import { Bell, User, MessageCircle, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onToggleAI: () => void;
  onToggleAdvancedAI?: () => void;
}

export function DashboardHeader({ onToggleAI, onToggleAdvancedAI }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="text-foreground hover:bg-accent" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-card-foreground">Dashboard Analytics</h2>
          </div>
          <p className="text-sm text-muted-foreground">Monitore suas campanhas em tempo real</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          onClick={onToggleAI}
          className="bg-gradient-primary text-primary-foreground hover:shadow-primary transition-all duration-200 shadow-sm"
          size="sm"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          IA Assistente
        </Button>
        
        {onToggleAdvancedAI && (
          <Button
            onClick={onToggleAdvancedAI}
            variant="secondary"
            size="sm"
            className="shadow-sm hover:shadow-card transition-all duration-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            IA Avançada
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Bell className="w-5 h-5" />
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
          >
            3
          </Badge>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-popover border border-border shadow-lg"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-popover-foreground">Conta</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || 'usuário@email.com'}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleSignOut} 
              className="text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
