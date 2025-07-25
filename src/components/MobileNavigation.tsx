import { useState } from 'react';
import { Home, BarChart3, Settings, Bell, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface MobileNavigationProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'campaigns', title: 'Campanhas', icon: BarChart3 },
  { id: 'reports', title: 'Relatórios', icon: FileText },
  { id: 'settings', title: 'Configurações', icon: Settings },
];

export function MobileNavigation({ activePage, setActivePage }: MobileNavigationProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMobile) return null;

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePage(item.id)}
              className="flex flex-col h-auto py-2 px-3 min-w-0"
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs truncate">{item.title}</span>
            </Button>
          ))}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col h-auto py-2 px-3 relative">
                <Bell className="h-5 w-5 mb-1" />
                <span className="text-xs">Alertas</span>
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Notificações</h3>
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Alerta de Performance</p>
                      <p className="text-sm text-muted-foreground">CPC acima do limite em Campaign {i + 1}</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
}