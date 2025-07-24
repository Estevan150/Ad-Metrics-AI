import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { OnboardingTrigger } from './OnboardingTour';

interface UserPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserPreferencesModal({ open, onOpenChange }: UserPreferencesModalProps) {
  const { preferences, updatePreferences } = useUserPreferences();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preferências do Usuário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') => 
                updatePreferences({ theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select
              value={preferences.language}
              onValueChange={(value: 'pt' | 'en') => 
                updatePreferences({ language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notificações</Label>
            <Switch
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => 
                updatePreferences({ notifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sons</Label>
            <Switch
              id="sound"
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => 
                updatePreferences({ soundEnabled: checked })
              }
            />
          </div>

          <div className="pt-4 border-t">
            <OnboardingTrigger />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}