
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, Facebook, Settings, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdAccount {
  id: string;
  platform: 'google_ads' | 'meta_ads';
  account_id: string;
  account_name: string;
  is_active: boolean;
  created_at: string;
}

export function AdAccountsPage() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAdAccounts();
    }
  }, [user]);

  const fetchAdAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filtrar apenas plataformas válidas e fazer type assertion segura
      const validAccounts = (data || []).filter(account => 
        account.platform === 'google_ads' || account.platform === 'meta_ads'
      ) as AdAccount[];
      
      setAdAccounts(validAccounts);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas contas publicitárias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (platform: 'google_ads' | 'meta_ads') => {
    try {
      const functionName = platform === 'google_ads' ? 'google-ads-oauth' : 'meta-ads-oauth';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {},
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data.authUrl) {
        // Abrir janela de OAuth
        window.open(data.authUrl, '_blank', 'width=600,height=600');
        
        toast({
          title: 'Autenticação iniciada',
          description: `Complete a autenticação na janela que se abriu para conectar sua conta ${getPlatformName(platform)}.`,
        });
        
        // Recarregar contas após alguns segundos para capturar novas conexões
        setTimeout(() => {
          fetchAdAccounts();
        }, 5000);
      }
    } catch (error) {
      console.error('Erro ao conectar conta:', error);
      toast({
        title: 'Erro na conexão',
        description: 'Não foi possível iniciar a conexão. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'google_ads' ? Search : Facebook;
  };

  const getPlatformName = (platform: string) => {
    return platform === 'google_ads' ? 'Google Ads' : 'Meta Ads';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Contas Publicitárias
          </h1>
          <p className="text-gray-600 mt-1">Gerencie suas integrações com Google Ads e Meta Ads</p>
        </div>
      </div>

      {/* Conectar novas contas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-dashed border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-primary group">
          <CardContent className="p-8 text-center">
            <div className="mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Google Ads</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conecte sua conta do Google Ads para importar e monitorar suas campanhas de pesquisa
            </p>
            <Button
              onClick={() => handleConnectAccount('google_ads')}
              className="w-full bg-gradient-primary text-primary-foreground hover:shadow-primary transition-all"
            >
              <Search className="w-4 h-4 mr-2" />
              Conectar Google Ads
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-muted hover:border-secondary/50 transition-all duration-300 hover:shadow-card group">
          <CardContent className="p-8 text-center">
            <div className="mb-4 p-4 bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:bg-secondary/20 transition-colors">
              <Facebook className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">Meta Ads</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conecte sua conta do Meta Ads para gerenciar campanhas do Facebook e Instagram
            </p>
            <Button
              onClick={() => handleConnectAccount('meta_ads')}
              variant="secondary"
              className="w-full hover:shadow-card transition-all"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Conectar Meta Ads
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contas conectadas */}
      {adAccounts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Contas Conectadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adAccounts.map((account) => {
              const PlatformIcon = getPlatformIcon(account.platform);
              return (
                <Card key={account.id} className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          account.platform === 'google_ads' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          <PlatformIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {getPlatformName(account.platform)}
                          </CardTitle>
                          <p className="text-xs text-gray-500">{account.account_name}</p>
                        </div>
                      </div>
                      <Badge variant={account.is_active ? "default" : "secondary"}>
                        {account.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        ID: {account.account_id}
                      </p>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {adAccounts.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nenhuma conta conectada
            </h3>
            <p className="text-gray-600 mb-4">
              Conecte suas contas do Google Ads ou Meta Ads para começar a monitorar suas campanhas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
