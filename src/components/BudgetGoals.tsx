import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Target, Plus, Save, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetGoal {
  id: string;
  campaign_id: string;
  monthly_budget: number;
  target_cpc: number;
  target_ctr: number;
  target_roas: number;
  target_conversions: number;
  month_year: string;
  campaign_name?: string;
}

interface Campaign {
  id: string;
  campaign_name: string;
  cost: number;
  cpc: number;
  ctr: number;
  conversions: number;
}

export function BudgetGoals() {
  const [goals, setGoals] = useState<BudgetGoal[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    campaign_id: '',
    monthly_budget: 0,
    target_cpc: 0,
    target_ctr: 0,
    target_roas: 0,
    target_conversions: 0,
    month_year: currentMonth,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [goalsResponse, campaignsResponse] = await Promise.all([
        supabase
          .from('budget_goals')
          .select('*')
          .eq('month_year', currentMonth)
          .order('created_at', { ascending: false }),
        supabase
          .from('campaigns')
          .select('id, campaign_name, cost, cpc, ctr, conversions')
      ]);

      if (goalsResponse.error) throw goalsResponse.error;
      if (campaignsResponse.error) throw campaignsResponse.error;

      const goalsWithCampaigns = goalsResponse.data?.map(goal => {
        const campaign = campaignsResponse.data?.find(c => c.id === goal.campaign_id);
        return {
          ...goal,
          campaign_name: campaign?.campaign_name || 'Campanha não encontrada'
        };
      }) || [];

      setGoals(goalsWithCampaigns);
      setCampaigns(campaignsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar metas de orçamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    try {
      const { error } = await supabase
        .from('budget_goals')
        .upsert({
          user_id: user?.id,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Meta de orçamento salva com sucesso",
      });

      setShowForm(false);
      setFormData({
        campaign_id: '',
        monthly_budget: 0,
        target_cpc: 0,
        target_ctr: 0,
        target_roas: 0,
        target_conversions: 0,
        month_year: currentMonth,
      });
      fetchData();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar meta de orçamento",
        variant: "destructive",
      });
    }
  };

  const getPerformanceStatus = (current: number, target: number, isHigherBetter: boolean = true) => {
    const percentage = (current / target) * 100;
    const isGood = isHigherBetter ? percentage >= 90 : percentage <= 110;
    
    return {
      percentage,
      isGood,
      color: isGood ? 'text-green-600' : 'text-red-600',
      icon: isGood ? TrendingUp : TrendingDown
    };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Metas de Orçamento
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
            <Target className="h-5 w-5" />
            Metas de Orçamento - {new Date(currentMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Definir Meta de Orçamento</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="campaign-select">Campanha</Label>
                <Select 
                  value={formData.campaign_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, campaign_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma campanha" />
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

              <div>
                <Label htmlFor="monthly-budget">Orçamento Mensal (R$)</Label>
                <Input
                  id="monthly-budget"
                  type="number"
                  step="0.01"
                  value={formData.monthly_budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_budget: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="target-cpc">Meta CPC (R$)</Label>
                <Input
                  id="target-cpc"
                  type="number"
                  step="0.01"
                  value={formData.target_cpc}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_cpc: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="target-ctr">Meta CTR (%)</Label>
                <Input
                  id="target-ctr"
                  type="number"
                  step="0.01"
                  value={formData.target_ctr}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_ctr: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="target-roas">Meta ROAS</Label>
                <Input
                  id="target-roas"
                  type="number"
                  step="0.01"
                  value={formData.target_roas}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_roas: parseFloat(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="target-conversions">Meta Conversões</Label>
                <Input
                  id="target-conversions"
                  type="number"
                  value={formData.target_conversions}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_conversions: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label htmlFor="month-year">Mês/Ano</Label>
                <Input
                  id="month-year"
                  type="month"
                  value={formData.month_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, month_year: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button onClick={saveGoal}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Meta
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma meta de orçamento definida para este mês
          </p>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const campaign = campaigns.find(c => c.id === goal.campaign_id);
              
              return (
                <div key={goal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{goal.campaign_name}</h4>
                    <Badge variant="outline">
                      R$ {goal.monthly_budget.toFixed(2)}
                    </Badge>
                  </div>
                  
                  {campaign && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">CPC</Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">R$ {campaign.cpc?.toFixed(2) || '0.00'}</span>
                          <span className="text-sm text-muted-foreground">/ R$ {goal.target_cpc.toFixed(2)}</span>
                          {(() => {
                            const status = getPerformanceStatus(campaign.cpc || 0, goal.target_cpc, false);
                            const Icon = status.icon;
                            return <Icon className={`h-4 w-4 ${status.color}`} />;
                          })()}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">CTR</Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{(campaign.ctr || 0).toFixed(2)}%</span>
                          <span className="text-sm text-muted-foreground">/ {goal.target_ctr.toFixed(2)}%</span>
                          {(() => {
                            const status = getPerformanceStatus(campaign.ctr || 0, goal.target_ctr, true);
                            const Icon = status.icon;
                            return <Icon className={`h-4 w-4 ${status.color}`} />;
                          })()}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Conversões</Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{campaign.conversions || 0}</span>
                          <span className="text-sm text-muted-foreground">/ {goal.target_conversions}</span>
                          {(() => {
                            const status = getPerformanceStatus(campaign.conversions || 0, goal.target_conversions, true);
                            const Icon = status.icon;
                            return <Icon className={`h-4 w-4 ${status.color}`} />;
                          })()}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Gasto</Label>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">R$ {(campaign.cost || 0).toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">/ R$ {goal.monthly_budget.toFixed(2)}</span>
                          {(() => {
                            const status = getPerformanceStatus(campaign.cost || 0, goal.monthly_budget, false);
                            const Icon = status.icon;
                            return <Icon className={`h-4 w-4 ${status.color}`} />;
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}