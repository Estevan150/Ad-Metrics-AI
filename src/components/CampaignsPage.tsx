
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RefreshCw, TrendingUp, Search, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  platform: 'google_ads' | 'meta_ads';
  campaign_id: string;
  campaign_name: string;
  status: string;
  budget_amount: number;
  currency: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
  last_synced_at: string;
}

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCampaigns();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_synced_at', { ascending: false });

      if (error) throw error;
      
      // Filtrar apenas plataformas válidas e fazer type assertion segura
      const validCampaigns = (data || []).filter(campaign => 
        campaign.platform === 'google_ads' || campaign.platform === 'meta_ads'
      ) as Campaign[];
      
      setCampaigns(validCampaigns);
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas campanhas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('campaigns-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'campaigns',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchCampaigns();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSyncCampaigns = async () => {
    setSyncing(true);
    // Simular sincronização (implementar integração real posteriormente)
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: "Sincronização concluída",
        description: "Suas campanhas foram atualizadas com sucesso"
      });
    }, 2000);
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'google_ads' ? Search : Facebook;
  };

  const formatCurrency = (amount: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Campanhas
          </h1>
          <p className="text-gray-600 mt-1">Monitore o desempenho de suas campanhas em tempo real</p>
        </div>
        <Button
          onClick={handleSyncCampaigns}
          disabled={syncing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhuma campanha encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Conecte suas contas publicitárias para visualizar suas campanhas aqui
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const PlatformIcon = getPlatformIcon(campaign.platform);
            const isActive = campaign.status.toLowerCase() === 'active';
            
            return (
              <Card key={campaign.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      campaign.platform === 'google_ads' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <PlatformIcon className="w-5 h-5" />
                    </div>
                    <Badge variant={isActive ? "default" : "secondary"}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-800 leading-tight">
                    {campaign.campaign_name}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Orçamento: {formatCurrency(campaign.budget_amount, campaign.currency)}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(campaign.impressions)}
                      </p>
                      <p className="text-xs text-gray-500">Impressões</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {formatNumber(campaign.clicks)}
                      </p>
                      <p className="text-xs text-gray-500">Cliques</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-600">
                        {campaign.ctr.toFixed(2)}%
                      </p>
                      <p className="text-xs text-gray-500">CTR</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(campaign.cpc, campaign.currency)}
                      </p>
                      <p className="text-xs text-gray-500">CPC</p>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Gasto total:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(campaign.cost, campaign.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                      <span>Última atualização:</span>
                      <span>{new Date(campaign.last_synced_at).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
