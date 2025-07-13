
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Button
              onClick={() => handleConnectAccount('google_ads')}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Search className="w-5 h-5 mr-2" />
              Conectar Google Ads
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Conecte sua conta do Google Ads para importar campanhas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Button
              onClick={() => handleConnectAccount('meta_ads')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Facebook className="w-5 h-5 mr-2" />
              Conectar Meta Ads
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Conecte sua conta do Meta Ads (Facebook/Instagram)
            </p>
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
