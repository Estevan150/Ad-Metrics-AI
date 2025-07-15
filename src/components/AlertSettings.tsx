import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AlertSetting {
  id: string;
  type: string;
  threshold_value: number;
  is_enabled: boolean;
  email_enabled: boolean;
  push_enabled: boolean;
}

export function AlertSettings() {
  const [settings, setSettings] = useState<AlertSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const alertTypes = [
    { key: 'budget_exceeded', label: 'Orçamento Excedido', unit: '%' },
    { key: 'low_ctr', label: 'CTR Baixo', unit: '%' },
    { key: 'high_cpc', label: 'CPC Alto', unit: 'R$' },
    { key: 'low_performance', label: 'Performance Baixa', unit: '%' },
    { key: 'opportunity', label: 'Oportunidades', unit: '%' },
  ];

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('alert_settings')
        .select('*');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching alert settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações de alerta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (type: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('alert_settings')
        .update({ [field]: value })
        .eq('type', type)
        .eq('user_id', user?.id);

      if (error) throw error;

      setSettings(prev => 
        prev.map(s => s.type === type ? { ...s, [field]: value } : s)
      );
    } catch (error) {
      console.error('Error updating alert setting:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar configuração",
        variant: "destructive",
      });
    }
  };

  const getSetting = (type: string) => {
    return settings.find(s => s.type === type);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Alertas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {alertTypes.map((alertType) => {
            const setting = getSetting(alertType.key);
            if (!setting) return null;

            return (
              <div key={alertType.key} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{alertType.label}</h4>
                  <Switch
                    checked={setting.is_enabled}
                    onCheckedChange={(checked) => 
                      updateSetting(alertType.key, 'is_enabled', checked)
                    }
                  />
                </div>
                
                {setting.is_enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`threshold-${alertType.key}`}>
                        Valor Limite ({alertType.unit})
                      </Label>
                      <Input
                        id={`threshold-${alertType.key}`}
                        type="number"
                        value={setting.threshold_value}
                        onChange={(e) => 
                          updateSetting(alertType.key, 'threshold_value', parseFloat(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting.push_enabled}
                          onCheckedChange={(checked) => 
                            updateSetting(alertType.key, 'push_enabled', checked)
                          }
                        />
                        <Label>Notificação Push</Label>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={setting.email_enabled}
                          onCheckedChange={(checked) => 
                            updateSetting(alertType.key, 'email_enabled', checked)
                          }
                        />
                        <Label>Email</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}