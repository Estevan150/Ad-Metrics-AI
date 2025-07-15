import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Play, Pause, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  type: string;
  condition_type: string;
  condition_value: number;
  action_type: string;
  action_value: number;
  is_active: boolean;
  campaigns: string[];
  created_at: string;
}

interface Campaign {
  id: string;
  campaign_name: string;
}

export function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    type: 'pause_low_roi',
    condition_type: 'ctr_below',
    condition_value: 0,
    action_type: 'pause',
    action_value: 0,
    campaigns: [] as string[],
    is_active: true,
  });

  const ruleTypes = [
    { key: 'pause_low_roi', label: 'Pausar Baixo ROI' },
    { key: 'adjust_budget', label: 'Ajustar Orçamento' },
    { key: 'optimize_keywords', label: 'Otimizar Palavras-chave' },
    { key: 'bid_adjustment', label: 'Ajuste de Lance' },
  ];

  const conditionTypes = [
    { key: 'ctr_below', label: 'CTR Abaixo de' },
    { key: 'cpc_above', label: 'CPC Acima de' },
    { key: 'roi_below', label: 'ROI Abaixo de' },
    { key: 'budget_exceeded', label: 'Orçamento Excedido' },
  ];

  const actionTypes = [
    { key: 'pause', label: 'Pausar' },
    { key: 'increase_budget', label: 'Aumentar Orçamento' },
    { key: 'decrease_budget', label: 'Diminuir Orçamento' },
    { key: 'adjust_bid', label: 'Ajustar Lance' },
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [rulesResponse, campaignsResponse] = await Promise.all([
        supabase
          .from('automation_rules')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('campaigns')
          .select('id, campaign_name')
      ]);

      if (rulesResponse.error) throw rulesResponse.error;
      if (campaignsResponse.error) throw campaignsResponse.error;

      setRules(rulesResponse.data || []);
      setCampaigns(campaignsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar regras de automação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRule = async () => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .insert({
          user_id: user?.id,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Regra de automação criada com sucesso",
      });

      setShowForm(false);
      setFormData({
        name: '',
        type: 'pause_low_roi',
        condition_type: 'ctr_below',
        condition_value: 0,
        action_type: 'pause',
        action_value: 0,
        campaigns: [],
        is_active: true,
      });
      fetchData();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar regra de automação",
        variant: "destructive",
      });
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      setRules(prev => 
        prev.map(r => r.id === id ? { ...r, is_active: isActive } : r)
      );

      toast({
        title: "Sucesso",
        description: `Regra ${isActive ? 'ativada' : 'desativada'} com sucesso`,
      });
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar regra",
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRules(prev => prev.filter(r => r.id !== id));

      toast({
        title: "Sucesso",
        description: "Regra removida com sucesso",
      });
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover regra",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string, array: Array<{key: string, label: string}>) => {
    return array.find(item => item.key === type)?.label || type;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Regras de Automação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Regras de Automação
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Regra
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Criar Nova Regra</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="rule-name">Nome da Regra</Label>
                <Input
                  id="rule-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Pausar campanhas com CTR baixo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-type">Tipo</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ruleTypes.map((type) => (
                        <SelectItem key={type.key} value={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition-type">Condição</Label>
                  <Select 
                    value={formData.condition_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, condition_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionTypes.map((condition) => (
                        <SelectItem key={condition.key} value={condition.key}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition-value">Valor da Condição</Label>
                  <Input
                    id="condition-value"
                    type="number"
                    step="0.01"
                    value={formData.condition_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition_value: parseFloat(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="action-type">Ação</Label>
                  <Select 
                    value={formData.action_type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, action_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((action) => (
                        <SelectItem key={action.key} value={action.key}>
                          {action.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(formData.action_type === 'increase_budget' || formData.action_type === 'decrease_budget' || formData.action_type === 'adjust_bid') && (
                <div>
                  <Label htmlFor="action-value">Valor da Ação (%)</Label>
                  <Input
                    id="action-value"
                    type="number"
                    step="0.01"
                    value={formData.action_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, action_value: parseFloat(e.target.value) }))}
                  />
                </div>
              )}

              <div>
                <Label>Campanhas (deixe vazio para aplicar em todas)</Label>
                <Select 
                  value={formData.campaigns.join(',')} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campaigns: value ? value.split(',') : [] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione campanhas específicas" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.campaign_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, is_active: checked }))
                  }
                />
                <Label>Ativar regra</Label>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={createRule}>
                  <Zap className="h-4 w-4 mr-2" />
                  Criar Regra
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {rules.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma regra de automação configurada
          </p>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={rule.is_active ? "default" : "secondary"}>
                      {rule.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRule(rule.id, !rule.is_active)}
                    >
                      {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  <strong>Tipo:</strong> {getTypeLabel(rule.type, ruleTypes)}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  <strong>Condição:</strong> {getTypeLabel(rule.condition_type, conditionTypes)} {rule.condition_value}
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  <strong>Ação:</strong> {getTypeLabel(rule.action_type, actionTypes)}
                  {rule.action_value > 0 && ` (${rule.action_value}%)`}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <strong>Campanhas:</strong> {rule.campaigns.length > 0 ? `${rule.campaigns.length} selecionadas` : 'Todas'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}